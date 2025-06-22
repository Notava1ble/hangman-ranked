import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activeGames: defineTable({
    word: v.string(),
    guesses: v.record(v.string(), v.boolean()),
  }),
});
