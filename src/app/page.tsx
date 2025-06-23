"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [previousGameStats, setPreviousGameStats] = useState<{
    isCompleted: boolean;
    isWon: boolean;
    score: number;
    attempts: number;
    mistakes: number;
    timeTaken?: number;
  } | null>(null);

  const displayWord = useQuery(api.game.getDisplayWord);
  const guesses = useQuery(api.game.getGuesses);

  const makeGuess = useMutation(api.game.makeGuess);
  const startNewGame = useMutation(api.game.createGame);

  const handleGuess = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const guessInput = event.currentTarget.elements.namedItem(
      "guess"
    ) as HTMLInputElement;
    const guess = guessInput.value.trim().toLowerCase();
    if (guess) {
      try {
        const stats = await makeGuess({ guess });
        guessInput.value = "";
        if (stats) {
          setPreviousGameStats({
            isCompleted: stats.isCompleted,
            isWon: stats.isWon,
            score: stats.score,
            attempts: stats.attempts,
            mistakes: stats.mistakes,
            timeTaken: stats.timeTaken,
          });
        }
      } catch (error) {
        console.error("Error making guess:", error);
      }
    }
  };
  const handleNewGame = async () => {
    try {
      await startNewGame();
    } catch (error) {
      console.error("Error starting new game:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 flex-1">
        <h1 className="text-2xl font-bold mb-4">Word Guessing Game</h1>
        <div className="mb-4">
          <p className="text-lg">Word: {displayWord || "Loading..."}</p>
          <p className="text-lg">Guesses: {guesses?.join(", ") || "None"}</p>
        </div>
        <form onSubmit={handleGuess} className="mb-4">
          <input
            type="text"
            name="guess"
            maxLength={1}
            className="border p-2 mr-2"
            placeholder="Enter a letter"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Guess
          </button>
        </form>
        <button
          onClick={handleNewGame}
          className="bg-green-500 text-white px-4 py-2"
        >
          Start New Game
        </button>
        <div className="mt-4">
          <Link href="/history" className="text-blue-500 underline">
            View Game History
          </Link>
        </div>
      </div>
      <div className="flex-1 ">
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          {previousGameStats && (
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">Previous Game Stats</h2>
              <p>
                Status:{" "}
                {previousGameStats.isCompleted
                  ? previousGameStats.isWon
                    ? "Won"
                    : "Lost"
                  : "In Progress"}
              </p>
              <p>Score: {previousGameStats.score}</p>
              <p>Attempts: {previousGameStats.attempts}</p>
              <p>Mistakes: {previousGameStats.mistakes}</p>
              {previousGameStats.timeTaken && (
                <p>Time Taken: {previousGameStats.timeTaken} seconds</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
