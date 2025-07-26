import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";
import { words } from "./data/allWords";
import { v } from "convex/values";

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
      userId1: user._id,
      userId2: opponent.userId,
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

    const opponent = await ctx.db.get(
      isUser1 ? activeRankedGame.userId2 : activeRankedGame.userId1
    );

    return {
      opponentData: opponent
        ? { name: opponent.name, elo: opponent.elo }
        : { name: "Unknown", elo: 1200 },
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
    throw new Error("makeGuess is not yet implemented");
  },
  // Temporary function
});
