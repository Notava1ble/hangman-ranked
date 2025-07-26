import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";
import { words } from "./data/allWords";
import { v } from "convex/values";
import { getEloDelta } from "./lib/utils";

async function getActiveRankedGameHelper(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }

  const activeRankedGame = await ctx.db
    .query("rankedMatches")
    .withIndex("by_completion", (q) => q.eq("isCompleted", false))
    .filter((q) =>
      q.or(
        q.eq(q.field("userId1"), user._id),
        q.eq(q.field("userId2"), user._id)
      )
    )
    .first();

  if (!activeRankedGame) {
    return null;
  }
  return {
    activeRankedGame,
    user,
  };
}

export const enterMatchmaking = mutation({
  handler: async (ctx) => {
    const user = await getLoggedInUserHelper(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if the user is already in matchmaking
    const allQueuedUsers = await ctx.db.query("matchQueue").collect();

    const existingMatchmaking = allQueuedUsers.find(
      (entry) => entry.userId === user._id
    );

    if (existingMatchmaking) {
      throw new Error("You are already in matchmaking");
    }

    // Create a new matchmaking entry
    const potentialOpponents = allQueuedUsers.filter(
      (entry) => entry.userId !== user._id
    );

    if (potentialOpponents.length === 0) {
      // Queue the user for matchmaking instead of creating a match
      await ctx.db.insert("matchQueue", {
        userId: user._id,
        userName: user.name || "Unknown",
        userElo: user.elo,
      });
      return { status: "queued", message: "Added to matchmaking queue" };
    }

    const opponent =
      potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

    const filteredWords = words.filter((word) => word.length >= 5);
    const word =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

    await ctx.db.delete(opponent._id);

    await ctx.db.insert("rankedMatches", {
      userName1: user.name || "Unknown",
      userName2: opponent.userName,
      userId1: user._id,
      userId2: opponent.userId,
      userElo1: user.elo,
      userElo2: opponent.userElo,
      word: word,
      guessedLetters1: [],
      guessedLetters2: [],
      correctGuesses1: [],
      correctGuesses2: [],
      wrongGuesses1: [],
      wrongGuesses2: [],
      attempts1: 0,
      attempts2: 0,
      mistakes1: 0,
      mistakes2: 0,
      startTime: Date.now(),
      isCompleted: false,
    });
  },
});

export const queueInfo = query({
  handler: async (ctx) => {
    const user = await getLoggedInUserHelper(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userEntryInQueue = await ctx.db
      .query("matchQueue")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!userEntryInQueue) {
      return { isInQueue: false, queueEntryTime: undefined };
    }

    return {
      isInQueue: true,
      queueEntryTime: userEntryInQueue._creationTime,
    };
  },
});

export const getDisplayWord = query({
  handler: async (ctx) => {
    const data = await getActiveRankedGameHelper(ctx);
    if (!data) {
      return null;
    }

    const { activeRankedGame, user } = data;

    const word = activeRankedGame.word;
    const guesses =
      activeRankedGame.userId1 === user._id
        ? activeRankedGame.guessedLetters1
        : activeRankedGame.guessedLetters2;

    if (!guesses || guesses.length === 0) {
      return Array(word.length).fill("_") as string[];
    }
    const displayWord = word
      .split("")
      .map((letter) => (guesses.includes(letter) ? letter : "_"));
    return displayWord;
  },
});

export const getCurrentRankedGameStats = query({
  handler: async (ctx) => {
    const data = await getActiveRankedGameHelper(ctx);
    if (!data) {
      return {
        opponentData: { name: "Unknown", elo: 1200 },
        guesses: [],
        correctGuesses: [],
        mistakes: 0,
        attempts: 0,
        opponentGuesses: [],
        opponentCorrectGuesses: [],
        opponentMistakes: 0,
        opponentAttempts: 0,
      };
    }
    const { activeRankedGame, user } = data;
    const isUser1 = activeRankedGame.userId1 === user._id;

    const guesses = isUser1
      ? activeRankedGame.guessedLetters1
      : activeRankedGame.guessedLetters2;
    const correctGuesses = isUser1
      ? activeRankedGame.correctGuesses1
      : activeRankedGame.correctGuesses2;
    const mistakes = isUser1
      ? activeRankedGame.mistakes1
      : activeRankedGame.mistakes2;
    const attempts = isUser1
      ? activeRankedGame.attempts1
      : activeRankedGame.attempts2;

    const opponentGuesses = !isUser1
      ? activeRankedGame.guessedLetters1
      : activeRankedGame.guessedLetters2;
    const opponentCorrectGuesses = !isUser1
      ? activeRankedGame.correctGuesses1
      : activeRankedGame.correctGuesses2;
    const opponentMistakes = !isUser1
      ? activeRankedGame.mistakes1
      : activeRankedGame.mistakes2;
    const opponentAttempts = !isUser1
      ? activeRankedGame.attempts1
      : activeRankedGame.attempts2;

    return {
      opponentData: {
        name: activeRankedGame[isUser1 ? "userName2" : "userName1"],
        elo: activeRankedGame[isUser1 ? "userElo2" : "userElo1"],
      },
      guesses,
      correctGuesses,
      mistakes,
      attempts,
      opponentGuesses,
      opponentCorrectGuesses,
      opponentMistakes,
      opponentAttempts,
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
    const data = await getActiveRankedGameHelper(ctx);
    if (!data) {
      throw new Error("No active game found");
    }
    const { activeRankedGame: game, user } = data;

    if (game.isCompleted) {
      throw new Error("Game is already completed");
    }

    // Check which user is making the guess
    const isUser1 = game.userId1 === user._id;

    const opponentId = isUser1 ? game.userId2 : game.userId1;
    const opponentName = isUser1 ? game.userName2 : game.userName1;
    const guesses = isUser1 ? game.guessedLetters1 : game.guessedLetters2;
    const correctGuesses = isUser1
      ? game.correctGuesses1
      : game.correctGuesses2;
    const wrongGuesses = isUser1 ? game.wrongGuesses1 : game.wrongGuesses2;
    const mistakes = isUser1 ? game.mistakes1 : game.mistakes2;

    if (guesses.includes(guess)) {
      throw new Error("You have already guessed this letter");
    }

    const newGuessedLetters = [...guesses, guess];
    const isCorrect = game.word.includes(guess);

    const newCorrectGuesses = correctGuesses;
    const newWrongGuesses = wrongGuesses;
    let newMistakes = mistakes;

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
    const endTime = isCompleted ? Date.now() : undefined;

    const totalTime = endTime ? endTime - game.startTime : undefined;

    await ctx.db.patch(game._id, {
      [isUser1 ? "guessedLetters1" : "guessedLetters2"]: newGuessedLetters,
      [isUser1 ? "correctGuesses1" : "correctGuesses2"]: newCorrectGuesses,
      [isUser1 ? "wrongGuesses1" : "wrongGuesses2"]: newWrongGuesses,
      [isUser1 ? "attempts1" : "attempts2"]:
        (isUser1 ? game.attempts1 : game.attempts2) + 1,
      [isUser1 ? "mistakes1" : "mistakes2"]: newMistakes,
      isCompleted,
      endTime,
      totalTime,
      winner: isCompleted ? (isWon ? user.name : opponentName) : undefined,
      winnerId: isCompleted ? (isWon ? user._id : opponentId) : undefined,
    });

    if (isCompleted) {
      const opponentElo = game[isUser1 ? "userElo2" : "userElo1"];
      const eloChange = isWon
        ? getEloDelta(user.elo, opponentElo, true)
        : getEloDelta(user.elo, opponentElo, false);
      await Promise.all([
        ctx.db.patch(user._id, { elo: user.elo + eloChange }),
        ctx.db.patch(opponentId, { elo: opponentElo - eloChange }),
        ctx.db.patch(game._id, { eloChange }),
      ]);
      return {
        isCompleted,
        isWon,
        attempts: isUser1 ? game.attempts1 + 1 : game.attempts2 + 1,
        mistakes: newMistakes,
        timeTaken: totalTime,
      };
    }
  },
});
