export function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  let result = "";
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0) {
    result += `${minutes}min `;
  }
  if (minutes > 0 || seconds > 0) {
    result += `${seconds}sec `;
  }
  result += `${milliseconds}ms`;
  return result.trim();
}
export function formatDigitalTime(ms: number, includeMs?: boolean) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const milliseconds = ms % 1000;

  let result = `${hours}:${minutes}:${seconds}`;
  if (includeMs) {
    result += `:${milliseconds.toString().padStart(3, "0")}`;
  }
  return result.trim();
}

export function sum(...args: (number | undefined)[]) {
  return args.reduce((acc: number, val) => {
    if (typeof val === "number") {
      return acc + val;
    }
    return acc;
  }, 0);
}

export function countLetters(str: string) {
  const letterCount: Record<string, number> = {};
  for (const letter of str) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }
  return letterCount;
}

export function getEloDelta(
  ratingA: number,
  ratingB: number,
  didAWin: boolean,
  kFactor: number = 32
): number {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const actualA = didAWin ? 1 : 0;
  return Math.round(kFactor * (actualA - expectedA));
}

const BASE62_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomSuffix(length = 6): string {
  const n = BASE62_ALPHABET.length;
  let result = "";

  // fine enough for name suffixes
  for (let i = 0; i < length; i++) {
    result += BASE62_ALPHABET[Math.floor(Math.random() * n)];
  }
  return result;
}

// export function getUpdatedStats(
//   user: DataModel["users"]["document"],
//   isWon: boolean
// ) {
//   const totalGames = user.userStats ? user.userStats.gamesPlayed + 1 : 1;
//   const wins = user.userStats
//     ? isWon
//       ? user.userStats.wins + 1
//       : user.userStats.wins
//     : 1;

//   return {
//     gamesPlayed: totalGames,
//     wins,
//     winRate: wins / totalGames,
//     lastSeen: Date.now(),
//   };
// }
