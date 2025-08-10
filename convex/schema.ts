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
    lastUpdate: v.number(),
    isCompleted: v.boolean(),
    isWon: v.boolean(),
    isAbandoned: v.boolean(),
    score: v.optional(v.number()),
    timeoutScheduleId: v.optional(v.id("_scheduled_functions")),
  })
    .index("by_user", ["userId"])
    .index("by_completion", ["isCompleted"])
    .index("by_isAbandoned", ["isAbandoned"])
    .index("score", ["score"])
    .index("total_time", ["totalTime"]),
  matchQueue: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    userElo: v.number(),
  }).index("by_elo", ["userElo"]),
  rankedMatches: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
    // TODO: If user changes the name, the data will become stale
    userName1: v.string(),
    userName2: v.string(),
    userElo1: v.number(),
    userElo2: v.number(),
    eloChange: v.optional(v.number()),
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
    lastUpdateFrom1: v.number(),
    lastUpdateFrom2: v.number(),
    isCompleted: v.boolean(),
    winner: v.optional(v.string()),
    winnerId: v.optional(v.id("users")),
    isAbandoned: v.boolean(),
    timeoutScheduleIdFor1: v.optional(v.id("_scheduled_functions")),
    timeoutScheduleIdFor2: v.optional(v.id("_scheduled_functions")),
  })
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"])
    .index("by_completion", ["isCompleted"])
    .index("by_total_time", ["totalTime"]),
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
    .index("email", ["email"])
    .index("by_elo", ["elo"]),
});
