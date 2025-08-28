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

export const getEloLeaderboard = query({
  handler: async (ctx) => {
    const topEloPlayers = await ctx.db
      .query("users")
      .withIndex("by_elo")
      .order("desc")
      .take(100);

    const filteredPlayers = topEloPlayers.filter(
      (player) =>
        player.userStats?.gamesPlayed && player.userStats.gamesPlayed > 0
    );

    filteredPlayers.sort((a, b) => {
      if (b.elo !== a.elo) return b.elo - a.elo;
      const gamesA = a.userStats.gamesPlayed;
      const gamesB = b.userStats.gamesPlayed;
      if (gamesB !== gamesA) return gamesB - gamesA;
      return a._creationTime - b._creationTime;
    });

    return filteredPlayers.map((player, i) => {
      return {
        rank: i + 1,
        user: player.name,
        elo: player.elo,
        games: player.userStats?.gamesPlayed || 0,
        winPct: player.userStats?.winRate || 0,
        lastSeen: player.userStats?.lastSeen || 0,
      };
    });
  },
});
