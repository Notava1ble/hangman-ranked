"use client";

import { useMutation, useQuery } from "convex/react";
import Container from "./Container";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";
import { useCallback, useEffect, useRef } from "react";
import HangmanFigure from "./HangmanFigure";
import { MistakeAttemptCard } from "./SoloGame";
import Keyboard from "./Keyboard";
import Timer from "./Timer";

const RankedGame = () => {
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const queueInfo = useQuery(api.ranked.queueInfo);
  const displayWord = useQuery(api.ranked.getDisplayWord);
  const currentRankedGameStats = useQuery(api.ranked.getCurrentRankedGameStats);

  const enterMatchmaking = useMutation(api.ranked.enterMatchmaking);
  const makeGuess = useMutation(api.ranked.makeGuess);

  const isGameActive = !!displayWord;
  const wrongGuesses = currentRankedGameStats?.guesses.filter(
    (q) => !currentRankedGameStats.correctGuesses.includes(q)
  );

  const onKeyPress = useCallback(
    (key: string) => {
      if (!currentRankedGameStats?.guesses.includes(key.toLowerCase())) {
        makeGuess({ guess: key });
      }
    },
    [currentRankedGameStats, makeGuess]
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

  // Work on displaying to the ui when the user is in matchmaking
  if (!isGameActive && !queueInfo?.isInQueue) {
    return (
      <Container className="flex-center">
        <Button
          ref={startButtonRef}
          onClick={() => enterMatchmaking()}
          className="text-lg"
          size="lg"
          variant="primary"
        >
          Start Game
        </Button>
      </Container>
    );
  }

  if (queueInfo?.isInQueue) {
    return (
      <Container>
        {/* We know that queueEmtryTime is defined as isInQueue is true */}
        <Timer startTime={new Date(queueInfo.queueEntryTime! + 1000)} />
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto w-fit mb-2">
        <span className="text-muted-foreground">Opponent: </span>
        <span className="text-2xl font-semibold">
          {currentRankedGameStats?.opponentData.name} (
          {currentRankedGameStats?.opponentData.elo})
        </span>
      </div>
      <div className="flex-center space-x-4">
        <div className="w-2/5 h-full mb-4 hidden md:block">
          <HangmanFigure wrongGuesses={currentRankedGameStats?.mistakes} />
        </div>
        <div className="w-3/5  flex flex-col justify-between items-center h-full gap-10 my-6">
          <div className="w-full flex-center gap-4">
            <MistakeAttemptCard
              displayText="Attempts"
              amount={currentRankedGameStats?.attempts.toString()}
              className="bg-green-100 text-green-600"
            />
            <MistakeAttemptCard
              displayText="Mistakes"
              amount={currentRankedGameStats?.mistakes.toString()}
              className="bg-red-100 text-red-600"
            />
          </div>
          <h2 className="text-3xl text-blue-700 font-bold font-mono text-center">
            {displayWord!.join(" ")}
          </h2>
          <Keyboard
            correctGuesses={currentRankedGameStats?.correctGuesses}
            wrongGuesses={wrongGuesses}
            guesses={currentRankedGameStats?.guesses}
            onKeyPress={onKeyPress}
          />
        </div>
      </div>
    </Container>
  );
};
export default RankedGame;
