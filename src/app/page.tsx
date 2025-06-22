"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [guess, setGuess] = useState("");

  const displayWord = useQuery(api.word.getDisplayWord);
  const createGame = useAction(api.word.createGame);
  const guesses = useQuery(api.word.getGuesses);
  const makeGuess = useMutation(api.word.makeGuess);

  console.log("displayWord", displayWord);

  if (!displayWord) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1>An unexpected error occured</h1>
      </div>
    );
  }
  if (displayWord === "No active game found") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1>{displayWord}</h1>
        <Button onClick={() => createGame()}>Start Game</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1>{displayWord}</h1>
      <Input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess"
        className="mt-4 w-64"
        autoFocus={true}
      ></Input>
      <Button
        onClick={() => {
          makeGuess({ guess });
          setGuess("");
        }}
      >
        Guess
      </Button>
      <p>
        {guesses && guesses.length > 0 ? (
          <span>Previous guesses: {guesses.join(", ")}</span>
        ) : (
          <span>No guesses yet</span>
        )}
      </p>
    </div>
  );
};
export default Page;
