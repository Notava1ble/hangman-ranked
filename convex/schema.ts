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
  matchQueue: defineTable({
    userId: v.id("users"),
    userElo: v.id("users"),
  }),
  rankedMatches: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
    word: v.string(),
    guessedLetters1: v.array(v.string()),
    guessedLetters2: v.array(v.string()),
    correctGuesses1: v.array(v.string()),
    correctGuesses2: v.array(v.string()),
    wrongGuesses1: v.array(v.string()),
    wrongGuesses2: v.array(v.string()),
    attempts1: v.number(),
    attempts2: v.number(),
    mistakes1: v.number(),
    mistakes2: v.number(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    totalTime: v.optional(v.number()),
    isCompleted: v.boolean(),
    winner: v.optional(v.id("users")),
  }),
  ...authTables,
  users: defineTable({
    elo: v.number(),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
  })
    .index("phone", ["phone"])
    .index("email", ["email"]),
});
