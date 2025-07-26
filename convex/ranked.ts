import { mutation } from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";
import { words } from "./data/allWords";

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

    const opponent =
      potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

    const filteredWords = words.filter((word) => word.length >= 5);
    const word =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

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
