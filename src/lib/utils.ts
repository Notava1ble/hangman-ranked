import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { words } from "./allWords";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getRandomWord = () => {
  const filteredWords = words.filter((word) => word.length >= 5);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};

export const getDisplayWord = (word: string, guesses: string[]) => {
  if (!guesses || guesses.length === 0) {
    return Array(word.length).fill("_") as string[];
  }
  return word
    .split("")
    .map((letter) => (guesses.includes(letter) ? letter : "_"));
};

export function toSentenceCase(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .toLowerCase()
    .replace(/^./, (str) => str.toUpperCase());
}

export function sum(...args: (number | undefined)[]) {
  return args.reduce((acc: number, val) => {
    if (typeof val === "number") {
      return acc + val;
    }
    return acc;
  }, 0);
}

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day; // approximate
const year = 365 * day; // approximate

export function formatLastSeen(lastSeen: number) {
  const now = Date.now();

  if (lastSeen === 0) {
    return "Never";
  }
  if (lastSeen > now) {
    return "Tomorrow";
  }

  const diff = now - lastSeen;

  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diff < 4 * week) {
    const weeks = Math.floor(diff / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

export function getEloProgression(
  recentGames: NonNullable<
    Awaited<ReturnType<typeof useQuery<typeof api.user.getRecentRankedGames>>>
  >
) {
  let currentElo = 1200;
  const eloProgression = [
    { game: "0", elo: "1200" },
    ...recentGames
      .slice()
      .reverse()
      .map(({ eloChange }, idx) => {
        currentElo += eloChange ?? 0;
        return { game: (idx + 1).toString(), elo: currentElo.toString() };
      }),
  ];
  return eloProgression;
}
