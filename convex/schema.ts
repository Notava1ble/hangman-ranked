import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    userId: v.id("users"),
    word: v.string(),
    guessedLetters: v.array(v.string()),
    correctGuesses: v.array(v.string()),
    wrongGuesses: v.array(v.string()),
    attempts: v.number(),
    mistakes: v.number(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    totalTime: v.optional(v.number()),
    isCompleted: v.boolean(),
    isWon: v.boolean(),
    score: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_completion", ["isCompleted"])
    .index("score", ["score"])
    .index("total_time", ["totalTime"]),
  ...authTables,
});
