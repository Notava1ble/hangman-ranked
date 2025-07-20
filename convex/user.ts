import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { getLoggedInUserHelper } from "./auth";
import { sum, countLetters, formatDigitalTime } from "./lib/utils";

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

export const getUserDetailedStats = query({
  handler: async (ctx) => {
    const user = await getLoggedInUserHelper(ctx);
    if (!user) {
      return null;
    }

    const games = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const wonGames = games.filter((game) => game.isWon);

    return {
      header: {
        totalGames: games.length,
        totalWins: wonGames.length,
        timeGuessing: sum(...games.map((game) => game.totalTime)), // In ms
      },
      pbs: {
        longestWordGuessed: wonGames.reduce(
          (longest, game) =>
            game.word.length > longest.length ? game.word : longest,
          ""
        ),
        fastestWin: formatDigitalTime(
          Math.min(...wonGames.map((game) => game.totalTime!))
        ), // In ms (Since the game is won, we know that totalTime is defined)
        maxScore: Math.max(...wonGames.map((game) => game.score || 0)),
        leastMistakes: Math.min(...games.map((game) => game.mistakes || 6)), // 6 is the max mistakes allowed
        highestAccuracy: Math.round(
          Math.max(
            ...games.map((game) =>
              game.attempts
                ? (game.correctGuesses.length / game.attempts) * 100
                : 0
            )
          )
        ), // Highest % of correct guesses in a game
        mostWinsInADay: (() => {
          // Group games by day and count wins
          const winsByDay: Record<string, number> = {};
          wonGames.forEach((game) => {
            const dateStr = new Date(game._creationTime)
              .toISOString()
              .slice(0, 10); // YYYY-MM-DD
            winsByDay[dateStr] = (winsByDay[dateStr] || 0) + 1;
          });
          return Math.max(0, ...Object.values(winsByDay));
        })(),
      },
      avarages: {
        withoutLossGames: {
          avarageScore: Math.round(
            sum(...wonGames.map((game) => game.score)) / wonGames.length
          ),
          avarageWordLength: Math.round(
            sum(...wonGames.map((game) => game.word.length)) / wonGames.length
          ),
          avarageGuesses: Math.round(
            sum(...wonGames.map((game) => game.attempts)) / wonGames.length
          ),
          avarageMistakes: Math.round(
            sum(...wonGames.map((game) => game.mistakes)) / wonGames.length
          ),
          avarageTime: formatDigitalTime(
            Math.round(
              sum(...wonGames.map((game) => game.totalTime)) / wonGames.length
            )
          ), // In ms
        },
        withLossGames: {
          avarageScore: Math.round(
            sum(...games.map((game) => game.score)) / games.length
          ),
          avarageWordLength: Math.round(
            sum(...games.map((game) => game.word.length)) / games.length
          ),
          avarageGuesses: Math.round(
            sum(...games.map((game) => game.attempts)) / games.length
          ),
          avarageMistakes: Math.round(
            sum(...games.map((game) => game.mistakes)) / games.length
          ),
          avarageTime: formatDigitalTime(
            Math.round(
              sum(...games.map((game) => game.totalTime)) / games.length
            )
          ), // In ms
        },
      },
      charts: {
        scoreOverGames: wonGames.map((game) => game.score || 0), // Line chart
        mistakesPerGame: wonGames.map((game) => game.mistakes), // Bar chart
        guessesUsedPerGame: wonGames.map((game) => game.attempts), // Bar or line chart
        guessAccuracyPerGame: wonGames.map((game) =>
          game.attempts ? (game.correctGuesses.length / game.attempts) * 100 : 0
        ), // Line chart
        gamesPerDay: (() => {
          const dateMap = new Map<string, number>();

          for (const game of games) {
            const dateStr = new Date(game._creationTime)
              .toISOString()
              .split("T")[0]; // Normalize to YYYY-MM-DD
            dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
          }

          return Array.from(dateMap.entries()).map(([dateStr, count]) => ({
            date: dateStr,
            count,
          }));
        })(), // heatmap Github style

        // Show in the same heatmap or sum similar
        letterAppearedFrequency: countLetters(
          games.map((game) => game.word).join("")
        ),
        letterGuessedFrequency: countLetters(
          games.map((game) => game.guessedLetters.join("")).join("")
        ),
        winRateBasedOnFirstGuess: {
          // Imma fill ts some other time
        },
      },
      curiosities: {
        mostCommonlyGuessedWrongLetter: "p",
        mostCommonlyGuessedCorrectLetter: "i",
      },
    };
  },
});
