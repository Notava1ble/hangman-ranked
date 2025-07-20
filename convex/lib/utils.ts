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
