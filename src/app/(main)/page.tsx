"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

const Page = () => {
  const [previousGameStats, setPreviousGameStats] = useState<{
    isCompleted: boolean;
    isWon: boolean;
    score: number;
    attempts: number;
    mistakes: number;
    timeTaken?: number;
  } | null>(null);

  const { signOut } = useAuthActions();

  const user = useQuery(api.auth.loggedInUser);
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
    <div>
      <p className="text-2xl">Hello THere</p>
    </div>
  );
};
export default Page;
