import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import words from "./data/allWords";

// Return the last 100 tasks in a given task list.
export const getDisplayWord = query({
  handler: async (ctx) => {
    const activeGames = await ctx.db.query("activeGames").collect();
    if (!activeGames.length || !activeGames[0]?.word) {
      return "No active game found";
    }
    const word = activeGames[0].word.toLowerCase();
    const guesses = Object.keys(activeGames[0].guesses || {});
    if (!guesses || guesses.length === 0) {
      return "_".repeat(word.length);
    }
    const displayWord = word
      .split("")
      .map((letter) => (guesses.includes(letter) ? letter : "_"))
      .join("");
    return displayWord;
  },
});

export const setGameWord = internalMutation({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    const { word } = args;
    const activeGames = await ctx.db.query("activeGames").collect();
    if (activeGames.length > 0) {
      await ctx.db.patch(activeGames[0]._id, { word });
    } else {
      await ctx.db.insert("activeGames", { word, guesses: {} });
    }
  },
});

export const createGame = action({
  handler: async (ctx) => {
    const filteredWords = words.filter((word) => word.length >= 5);
    const randomWord =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

    const data = await ctx.runMutation(internal.word.setGameWord, {
      word: randomWord.toLowerCase(),
    });
  },
});

export const getGuesses = query({
  handler: async (ctx) => {
    const activeGames = await ctx.db.query("activeGames").collect();
    if (!activeGames.length || !activeGames[0]?.guesses) {
      return [];
    }
    return Object.keys(activeGames[0].guesses);
  },
});

export const makeGuess = mutation({
  args: { guess: v.string() },
  handler: async (ctx, args) => {
    const guess = args.guess.toLowerCase()[0];
    const activeGames = await ctx.db.query("activeGames").collect();
    if (!activeGames.length || !activeGames[0]?.guesses) {
      throw new Error("No active game found");
    }
    const gameId = activeGames[0]._id;
    const guesses = activeGames[0].guesses;

    if (guesses[guess]) {
      throw new Error("You have already guessed this letter");
    }

    await ctx.db.patch(gameId, {
      guesses: { ...guesses, [guess]: true },
    });

    const wrongGuesses = Object.keys(guesses).filter(
      (g) => !activeGames[0].word.includes(g)
    );
    if (wrongGuesses.length >= 6) {
      ctx.runMutation(internal.word.removeGame);
      return "Game Over! Too many wrong guesses.";
    }
  },
});

export const removeGame = internalMutation({
  handler: async (ctx) => {
    const activeGames = await ctx.db.query("activeGames").collect();
    if (activeGames.length > 0) {
      await ctx.db.delete(activeGames[0]._id);
    }
  },
});
