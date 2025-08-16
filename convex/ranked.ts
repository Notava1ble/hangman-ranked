import { getAuthUserId } from "@convex-dev/auth/server";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";
import { words } from "./data/allWords";
import { v } from "convex/values";
import { getEloDelta, getUpdatedStats } from "./lib/utils";
import { internal } from "./_generated/api";

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

  const isUser1 = activeRankedGame.userId1 === user._id;
  const opponent = await ctx.db.get(
    isUser1 ? activeRankedGame.userId2 : activeRankedGame.userId1
  );

  if (!opponent) {
    return null;
  }

  return {
    activeRankedGame,
    user,
    opponent,
  };
}

export const exitMatchmaking = mutation({
  handler: async (ctx) => {
    const user = await getLoggedInUserHelper(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const activeQueue = await ctx.db
      .query("matchQueue")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!activeQueue) return;

    await ctx.db.delete(activeQueue._id);
  },
});

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

    const now = Date.now();

    const matchId = await ctx.db.insert("rankedMatches", {
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
      startTime: now,
      lastUpdateFrom1: now,
      lastUpdateFrom2: now,
      isCompleted: false,
      isAbandoned: false,
    });

    // Delete the game if no move is ever made for 60 seconds
    await ctx.scheduler.runAfter(
      30 * 1000,
      internal.ranked.timeoutStaleDelete,
      {
        matchId,
        lastUpdate: now,
      }
    );
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
      const now = Date.now();
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
        lastUpdate: now,
        opponentLastUpdate: now,
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
    const lastUpdate = isUser1
      ? activeRankedGame.lastUpdateFrom1
      : activeRankedGame.lastUpdateFrom2;

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
    const opponentLastUpdate = !isUser1
      ? activeRankedGame.lastUpdateFrom1
      : activeRankedGame.lastUpdateFrom2;

    return {
      opponentData: {
        name: activeRankedGame[isUser1 ? "userName2" : "userName1"],
        elo: activeRankedGame[isUser1 ? "userElo2" : "userElo1"],
      },
      guesses,
      correctGuesses,
      mistakes,
      attempts,
      lastUpdate,
      opponentGuesses,
      opponentCorrectGuesses,
      opponentMistakes,
      opponentAttempts,
      opponentLastUpdate,
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
    const { activeRankedGame: game, user, opponent } = data;

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

    const now = Date.now();
    const isCompleted = isWon || isLost;
    const endTime = isCompleted ? now : undefined;

    const totalTime = endTime ? endTime - game.startTime : undefined;

    let schedulerId = undefined;
    if (isUser1) {
      if (!isCompleted) {
        if (game.timeoutScheduleIdFor1) {
          await ctx.scheduler.cancel(game.timeoutScheduleIdFor1);
        }
        schedulerId = await ctx.scheduler.runAfter(
          30 * 1000,
          internal.ranked.timeoutSchedule,
          {
            gameId: game._id,
            lastUpdate: now,
            userId: user._id,
            opponentId,
            isUser1,
            opponentName,
          }
        );
      } else if (game.timeoutScheduleIdFor1) {
        await ctx.scheduler.cancel(game.timeoutScheduleIdFor1);
      }
    } else {
      if (!isCompleted) {
        if (game.timeoutScheduleIdFor2) {
          await ctx.scheduler.cancel(game.timeoutScheduleIdFor2);
        }
        schedulerId = await ctx.scheduler.runAfter(
          30 * 1000,
          internal.ranked.timeoutSchedule,
          {
            gameId: game._id,
            lastUpdate: now,
            userId: user._id,
            opponentId,
            isUser1,
            opponentName,
          }
        );
      } else if (game.timeoutScheduleIdFor2) {
        await ctx.scheduler.cancel(game.timeoutScheduleIdFor2);
      }
    }

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
      [isUser1 ? "lastUpdateFrom1" : "lastUpdateFrom2"]: now,
      winner: isCompleted ? (isWon ? user.name : opponentName) : undefined,
      winnerId: isCompleted ? (isWon ? user._id : opponentId) : undefined,
      [isUser1 ? "timeoutScheduleIdFor1" : "timeoutScheduleIdFor2"]:
        schedulerId,
    });

    if (isCompleted) {
      const opponentElo = game[isUser1 ? "userElo2" : "userElo1"];
      const eloChange = isWon // Can simplify in here
        ? getEloDelta(
            isUser1 ? user.elo : opponentElo,
            isUser1 ? opponentElo : user.elo,
            isUser1
          )
        : getEloDelta(
            isUser1 ? user.elo : opponentElo,
            isUser1 ? opponentElo : user.elo,
            !isUser1
          );
      await Promise.all([
        ctx.db.patch(user._id, {
          elo: isUser1 ? user.elo + eloChange : user.elo - eloChange,
          userStats: getUpdatedStats(user, isWon),
        }),
        ctx.db.patch(opponentId, {
          elo: isUser1 ? opponentElo - eloChange : opponentElo + eloChange,
          userStats: getUpdatedStats(opponent, !isWon),
        }),
        ctx.db.patch(game._id, { eloChange }),
      ]);
    }
  },
});

export const timeoutSchedule = internalMutation({
  args: {
    gameId: v.id("rankedMatches"),
    lastUpdate: v.number(),
    isUser1: v.boolean(),
    userId: v.id("users"),
    opponentId: v.id("users"),
    opponentName: v.optional(v.string()),
  },
  handler: async (
    { db },
    { gameId, lastUpdate, isUser1, opponentId, opponentName, userId }
  ) => {
    const game = await db.get(gameId);
    if (!game) return;
    if (game.isCompleted) return;

    const user = await db.get(userId);
    const opponent = await db.get(opponentId);

    if (!user || !opponent) {
      // Remove the game if either user is not found
      await db.delete(gameId);
      return;
    }

    // If the last update differs, dont end the game
    if (isUser1) {
      if (game.lastUpdateFrom1 !== lastUpdate) return;
    } else {
      if (game.lastUpdateFrom2 !== lastUpdate) return;
    }

    // Elo logic
    const userElo = user.elo;
    const opponentElo = opponent.elo;
    const eloChange = getEloDelta(
      isUser1 ? userElo : opponentElo,
      isUser1 ? opponentElo : userElo,
      !isUser1
    );
    const now = Date.now();
    await Promise.all([
      db.patch(userId, {
        elo: isUser1 ? userElo + eloChange : userElo - eloChange,
        userStats: getUpdatedStats(
          user,
          false // User lost by timeout
        ),
      }),
      db.patch(opponentId, {
        elo: isUser1 ? opponentElo - eloChange : opponentElo + eloChange,
        userStats: getUpdatedStats(
          opponent,
          true // Opponent won by timeout
        ),
      }),

      db.patch(gameId, {
        eloChange: eloChange,
        isCompleted: true,
        winner: opponentName,
        winnerId: opponentId,
        timeoutScheduleIdFor1: undefined,
        timeoutScheduleIdFor2: undefined,
        isAbandoned: true,
        endTime: now,
        totalTime: now - game.startTime,
      }),
    ]);
  },
});

export const timeoutStaleDelete = internalMutation({
  args: {
    matchId: v.id("rankedMatches"),
    lastUpdate: v.number(),
  },
  handler: async ({ db, runMutation }, { matchId, lastUpdate }) => {
    const game = await db.get(matchId);
    if (!game) return;
    if (game.isCompleted) return;

    const firstUnchanged = game.lastUpdateFrom1 === lastUpdate;
    const secondUnchanged = game.lastUpdateFrom2 === lastUpdate;

    // Nobody moved thus delete the match
    if (firstUnchanged && secondUnchanged) {
      await db.delete(matchId);
      return;
    }

    // Both moved meaning they have their own schedules so we do nothing
    if (!firstUnchanged && !secondUnchanged) {
      return;
    }

    // Exactly one player hasn't moved so timeout that inactive player
    const inactiveIsUser1 = firstUnchanged; // true if the first user is inactive, else its false, meaning the second is inactive
    const inactiveUserId = inactiveIsUser1 ? game.userId1 : game.userId2;
    const activeUserId = inactiveIsUser1 ? game.userId2 : game.userId1;
    const activeName = inactiveIsUser1 ? game.userName2 : game.userName1;
    const inactiveLastUpdate = inactiveIsUser1
      ? game.lastUpdateFrom1
      : game.lastUpdateFrom2;

    // call the timeoutSchedule funciton for the inactive player
    await runMutation(internal.ranked.timeoutSchedule, {
      gameId: matchId,
      lastUpdate: inactiveLastUpdate,
      isUser1: inactiveIsUser1,
      userId: inactiveUserId,
      opponentId: activeUserId,
      opponentName: activeName,
    });
  },
});
