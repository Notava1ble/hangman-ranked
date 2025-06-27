"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
  guesses?: string[];
  correctGuesses?: string[];
  wrongGuesses?: string[];
  className?: string;
}

// Define the three rows of a standard QWERTY keyboard
const KEY_ROWS: string[][] = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  guesses = [],
  correctGuesses = [],
  wrongGuesses = [],
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {KEY_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-2">
          {row.map((key) => {
            const isCorrect = correctGuesses.includes(key.toLowerCase());
            const isWrong = wrongGuesses.includes(key.toLowerCase());
            const isDisabled = guesses.includes(key.toLowerCase());

            return (
              <button
                key={key}
                type="button"
                className={cn(
                  // Base styles that are always applied
                  "w-7 h-8 flex items-center font-semibold justify-center text-sm rounded-sm font-mono",
                  {
                    // Classes for the 'correct' state
                    "bg-green-300 text-green-800 cursor-not-allowed font-bold":
                      isCorrect,
                    // Classes for the 'wrong' state
                    "bg-red-300 text-red-800 cursor-not-allowed font-bold":
                      isWrong,
                    // Classes for the default/idle state
                    "bg-gray-200 text-black hover:bg-gray-300 cursor-pointer":
                      !isCorrect && !isWrong,
                  }
                )}
                onClick={() => {
                  if (!isDisabled && onKeyPress) onKeyPress(key);
                }}
                disabled={isDisabled}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
