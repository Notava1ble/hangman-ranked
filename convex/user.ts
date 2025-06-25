import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";

export const getUserStats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const games = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    const totalGames = games.length;
    const totalWins = games.filter((game) => game.isWon).length;
    const totalScore = games.reduce((sum, game) => sum + (game.score || 0), 0);

    return {
      totalGames,
      totalWins,
      totalScore,
    };
  },
});

export const getRecentSoloGames = query({
  handler: async (ctx) => {
    const user = await getLoggedInUserHelper(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }
    const recentGames = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .order("desc")
      .take(5);
    return recentGames;
  },
});
