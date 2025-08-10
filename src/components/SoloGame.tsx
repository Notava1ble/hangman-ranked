"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import Container from "./Container";
import Keyboard from "./Keyboard";
import HangmanFigure from "./HangmanFigure";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import Countdown from "./Countdown";

const SoloGame = () => {
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const displayWord = useQuery(api.game.getDisplayWord);
  const currentGameStats = useQuery(api.game.getCurrentGameStats);

  const createGame = useMutation(api.game.createGame);
  const makeGuess = useMutation(api.game.makeGuess);

  const isGameActive = !!displayWord;
  const wrongGuesses = currentGameStats?.guesses.filter(
    (q) => !currentGameStats.correctGuesses.includes(q)
  );

  const onKeyPress = useCallback(
    (key: string) => {
      if (!currentGameStats?.guesses.includes(key.toLowerCase())) {
        makeGuess({ guess: key });
      }
    },
    [currentGameStats, makeGuess]
  );
  useEffect(() => {
    const handleKeyPressEvent = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        onKeyPress(key);
      }
    };
    window.addEventListener("keypress", handleKeyPressEvent);

    return () => {
      window.removeEventListener("keypress", handleKeyPressEvent);
    };
  }, [onKeyPress]);

  useEffect(() => {
    if (!isGameActive) {
      startButtonRef.current?.focus();
    }
  }, [isGameActive]);

  if (!isGameActive) {
    return (
      <Container className="flex-center">
        <Button
          ref={startButtonRef}
          onClick={() => createGame()}
          className="text-lg"
          size="lg"
          variant="primary"
        >
          Start Game
        </Button>
      </Container>
    );
  }

  return (
    <Container className="flex-center space-x-4">
      <div className="w-2/5 h-full mb-4 hidden md:block">
        <HangmanFigure wrongGuesses={currentGameStats?.mistakes} />
        {currentGameStats && (
          <Countdown
            lastUpdate={new Date(currentGameStats.lastUpdate)}
            countdownFrom={60}
          />
        )}
      </div>
      <div className="w-3/5  flex flex-col justify-between items-center h-full gap-10 my-6">
        <div className="w-full flex-center gap-4">
          <MistakeAttemptCard
            displayText="Attempts"
            amount={currentGameStats?.attempts.toString()}
            className="bg-green-100 text-green-600"
          />
          <MistakeAttemptCard
            displayText="Mistakes"
            amount={currentGameStats?.mistakes.toString()}
            className="bg-red-100 text-red-600"
          />
        </div>
        <h2 className="text-3xl text-blue-700 font-bold font-mono text-center">
          {displayWord.join(" ")}
        </h2>
        <Keyboard
          correctGuesses={currentGameStats?.correctGuesses}
          wrongGuesses={wrongGuesses}
          guesses={currentGameStats?.guesses}
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
