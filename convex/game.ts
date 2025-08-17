import { api, internal } from "./_generated/api";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { words } from "./data/allWords";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getActiveGameHelper(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }

  const activeGame = await ctx.db
    .query("games")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .filter((q) => q.eq(q.field("isCompleted"), false))
    .first();
  return activeGame;
}

export const createGame = mutation({
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.auth.loggedInUser);
    if (!user) {
      throw new Error("User not authenticated");
    }
    const filteredWords = words.filter((word) => word.length >= 5);
    const word =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

    const currentGames = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
    if (currentGames.length > 0) {
      await ctx.db.patch(currentGames[0]._id, { word });
    } else {
      const now = Date.now();
      const gameId = await ctx.db.insert("games", {
        userId: user._id,
        word: word.toLowerCase(),
        guessedLetters: [],
        correctGuesses: [],
        wrongGuesses: [],
        attempts: 0,
        mistakes: 0,
        startTime: now,
        lastUpdate: now,
        isAbandoned: false,
        isCompleted: false,
        isWon: false,
      });
      const schedulerId = await ctx.scheduler.runAfter(
        60 * 1000,
        internal.game.timeoutSchedule,
        {
          gameId,
          lastUpdate: now,
        }
      );
      await ctx.db.patch(gameId, { timeoutScheduleId: schedulerId });
    }
  },
});

export const getDisplayWord = query({
  handler: async (ctx) => {
    const activeGame = await getActiveGameHelper(ctx);
    if (!activeGame || !activeGame?.word) {
      return null;
    }
    const word = activeGame.word;
    const guesses = activeGame.guessedLetters;
    if (!guesses || guesses.length === 0) {
      return Array(word.length).fill("_") as string[];
    }
    const displayWord = word
      .split("")
      .map((letter) => (guesses.includes(letter) ? letter : "_"));
    return displayWord;
  },
});

export const getCurrentGameStats = query({
  handler: async (ctx) => {
    const activeGame = await getActiveGameHelper(ctx);
    if (!activeGame || !activeGame?.guessedLetters) {
      return {
        guesses: [],
        correctGuesses: [],
        mistakes: 0,
        attempts: 0,
        lastUpdate: Date.now(),
      };
    }
    const guesses = activeGame.guessedLetters;
    const correctGuesses = activeGame.correctGuesses;
    const mistakes = activeGame.mistakes;
    const attempts = activeGame.attempts;
    const lastUpdate = activeGame.lastUpdate;

    return {
      guesses,
      correctGuesses,
      mistakes,
      attempts,
      lastUpdate,
    };
  },
});

export const makeGuess = mutation({
  args: { guess: v.string() },
  handler: async (ctx, args) => {
    const guess = args.guess.toLowerCase();

    if (guess.length !== 1 || !/^[a-z]$/.test(guess)) {
      throw new Error("Invalid guess. Please enter a single letter.");
    }
    const game = await getActiveGameHelper(ctx);
    if (!game) {
      throw new Error("No active game found");
    }
    if (game.isCompleted) {
      throw new Error("Game is already completed");
    }
    const guesses = game.guessedLetters;

    if (guesses.includes(guess)) {
      throw new Error("You have already guessed this letter");
    }

    const newGuessedLetters = [...game.guessedLetters, guess];
    const isCorrect = game.word.includes(guess);

    const newCorrectGuesses = [...game.correctGuesses];
    const newWrongGuesses = [...game.wrongGuesses];
    let newMistakes = game.mistakes;

    if (isCorrect) {
      newCorrectGuesses.push(guess);
    } else {
      newWrongGuesses.push(guess);
      newMistakes++;
    }

    // Check if game is won (all letters guessed)
    const uniqueLetters = [...new Set(game.word.split(""))];
    const isWon = uniqueLetters.every((l) => newCorrectGuesses.includes(l));

    // Check if game is lost (6 mistakes)
    const isLost = newMistakes >= 6;

    const isCompleted = isWon || isLost;

    const now = Date.now();
    const endTime = isCompleted ? now : undefined;

    let score = 0;
    if (isCompleted && isWon) {
      // Calculate score based on word length, attempts, mistakes, and time
      const timeInSeconds = Math.floor((endTime! - game.startTime) / 1000);
      const baseScore = game.word.length * 10;
      const attemptBonus = Math.max(0, 50 - (game.attempts + 1) * 2);
      const mistakeBonus = Math.max(0, 60 - newMistakes * 10);
      const timeBonus = Math.max(0, 100 - timeInSeconds);

      score = baseScore + attemptBonus + mistakeBonus + timeBonus;
    }

    const totalTime = endTime ? endTime - game.startTime : undefined;

    let schedulerId = undefined;
    if (!isCompleted) {
      if (game.timeoutScheduleId) {
        ctx.scheduler.cancel(game.timeoutScheduleId);
      }
      schedulerId = await ctx.scheduler.runAfter(
        60 * 1000,
        internal.game.timeoutSchedule,
        {
          gameId: game._id,
          lastUpdate: now,
        }
      );
    } else if (game.timeoutScheduleId) {
      ctx.scheduler.cancel(game.timeoutScheduleId);
    }

    await ctx.db.patch(game._id, {
      guessedLetters: newGuessedLetters,
      correctGuesses: newCorrectGuesses,
      wrongGuesses: newWrongGuesses,
      attempts: game.attempts + 1,
      mistakes: newMistakes,
      isCompleted,
      isWon,
      endTime,
      totalTime,
      lastUpdate: now,
      score,
      timeoutScheduleId: schedulerId,
    });

    if (isCompleted) {
      if (isWon) {
        const user = await ctx.db.get(game.userId);
        if (!user) {
          throw new Error("User not found");
        }

        await ctx.db.patch(game.userId, {
          personalScoreRecord: Math.max(user.personalScoreRecord ?? 0, score),
        });
      }
      return {
        isCompleted,
        isWon,
        score,
        attempts: game.attempts + 1,
        mistakes: newMistakes,
        timeTaken: totalTime,
      };
    }
  },
});

export const createTotalTime = internalMutation({
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();
    for (const game of games) {
      if (game.startTime && game.endTime) {
        const totalTime = game.endTime - game.startTime;
        await ctx.db.patch(game._id, { totalTime });
      }
    }
  },
});

export const timeoutSchedule = internalMutation({
  args: {
    gameId: v.id("games"),
    lastUpdate: v.number(),
  },
  handler: async ({ db }, { gameId, lastUpdate }) => {
    const game = await db.get(gameId);
    if (!game) return;
    if (game.isCompleted) return;

    // Since the lastUpdate is different, the user has done an update, do nothing
    if (game.lastUpdate !== lastUpdate) return;

    const now = Date.now();
    await db.patch(gameId, {
      isCompleted: true,
      isWon: false,
      isAbandoned: true,
      score: 0,
      endTime: now,
      totalTime: now - game.startTime,
    });
  },
});
