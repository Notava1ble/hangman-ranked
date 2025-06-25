"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import Container from "./Container";
import Keyboard from "./Keyboard";
import HangmanFigure from "./HangmanFigure";
import { cn } from "@/lib/utils";

const SoloGame = () => {
  const displayWord = useQuery(api.game.getDisplayWord);
  const currectGameStats = useQuery(api.game.getCurrentGameStats);

  const createGame = useMutation(api.game.createGame);
  const makeGuess = useMutation(api.game.makeGuess);

  const wrongGuesses = currectGameStats?.guesses.filter(
    (q) => !currectGameStats.correctGuesses.includes(q)
  );

  const onKeyPress = (key: string) => {
    if (!currectGameStats?.guesses.includes(key.toLowerCase())) {
      makeGuess({ guess: key });
    }
  };

  if (!displayWord)
    return (
      <div className="mx-auto w-[50%] flex-center mt-6">
        <Button
          onClick={() => createGame()}
          className="text-lg"
          size="lg"
          variant="primary"
        >
          Start Game
        </Button>
      </div>
    );

  return (
    <Container className="flex-center space-x-4">
      <div className="w-2/5 h-full mb-4">
        <HangmanFigure wrongGuesses={currectGameStats?.mistakes} />
      </div>
      <div className="w-3/5  flex flex-col justify-between items-center h-full gap-10 my-6">
        <div className="w-full flex gap-4">
          <MistakeAttemptCard
            displayText="Attempts"
            amount={currectGameStats?.attempts.toString()}
            className="bg-green-100 text-green-600"
          />
          <MistakeAttemptCard
            displayText="Mistakes"
            amount={currectGameStats?.mistakes.toString()}
            className="bg-red-100 text-red-600"
          />
        </div>
        <h2 className="text-3xl text-blue-700 font-bold font-mono text-center">
          {displayWord.join(" ")}
        </h2>
        <Keyboard
          correctGuesses={currectGameStats?.correctGuesses}
          wrongGuesses={wrongGuesses}
          guesses={currectGameStats?.guesses}
          onKeyPress={onKeyPress}
        />
      </div>
    </Container>
  );
};
export default SoloGame;

export const MistakeAttemptCard = ({
  displayText,
  amount = "0",
  className,
}: {
  displayText: "Attempts" | "Mistakes";
  amount?: string;
  className: string;
}) => {
  return (
    <div
      className={cn("flex-1 px-8 py-4 flex-col-center rounded-md", className)}
    >
      <p className="font-semibold">{displayText}</p>
      <p className="font-bold text-2xl">
        {amount + (displayText === "Mistakes" ? "/6" : "")}
      </p>
    </div>
  );
};
