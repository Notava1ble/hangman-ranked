import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import words from "./allWords";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  let result = "";
  if (minutes > 0) {
    result += `${minutes}min `;
  }
  if (minutes > 0 || seconds > 0) {
    result += `${seconds}sec `;
  }
  result += `${milliseconds}ms`;
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
