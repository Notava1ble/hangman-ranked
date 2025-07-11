import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { words } from "./allWords";

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
    result += `${milliseconds}`;
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
