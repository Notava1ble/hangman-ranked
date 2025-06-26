import { query } from "./_generated/server";

export const getSoloLeaderboard = query({
  handler: async (ctx) => {
    const topGames = await ctx.db
      .query("games")
      .withIndex("score", (q) => q.gte("score", 1))
      .order("desc")
      .take(100);

    const userIdSet = [...new Set(topGames.map((game) => game.userId))];
    const users = await Promise.all(userIdSet.map((id) => ctx.db.get(id)));

    const userMap = new Map(
      users
        .filter(<T>(user: T | null): user is T => user !== null)
        .map((user) => [user._id, user.name])
    );

    return topGames.map((game, i) => {
      return {
        rank: i + 1,
        user: userMap.get(game.userId) || "Unknown",
        score: game.score,
        word: game.word,
        mistakes: game.mistakes,
        attempts: game.attempts,
        time: game.endTime! - game.startTime, // We know that end time is defined since when the game is completed (has a score) we also add the endTIme
      };
    });
  },
});
