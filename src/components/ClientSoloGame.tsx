"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Container from "./Container";
import { Button } from "./ui/button";
import { formatTime, getDisplayWord, getRandomWord } from "@/lib/utils";
import HangmanFigure from "./HangmanFigure";
import { MistakeAttemptCard } from "./SoloGame";
import Keyboard from "./Keyboard";

type GameType = {
  word: string;
  guessedLetters: string[];
  correctGuesses: string[];
  wrongGuesses: string[];
  attempts: number;
  mistakes: number;
  startTime: number;
  endTime?: number;
  totalTime?: number;
  isCompleted: boolean;
  isWon: boolean;
  score?: number;
};

const ClientSoloGame = () => {
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const createGame = () => {
    setActiveGame({
      word: getRandomWord(),
      guessedLetters: [],
      correctGuesses: [],
      wrongGuesses: [],
      attempts: 0,
      mistakes: 0,
      startTime: Date.now(),
      isCompleted: false,
      isWon: false,
    });
    setIsGameActive(true);
  };

  const onKeyPress = useCallback(
    (key: string) => {
      const guess = key[0].toLowerCase();

      if (guess.length !== 1 || !/^[a-z]$/.test(guess)) {
        console.error("Invalid guess. Please enter a single letter.");
        return;
      }
      if (!activeGame) {
        console.error("No active game found");
        return;
      }
      if (activeGame.isCompleted) {
        console.error("Game is already completed");
        return;
      }

      const guesses = activeGame.guessedLetters;

      if (guesses.includes(guess)) {
        console.error("You have already guessed this letter");
        return;
      }

      const newGuessedLetters = [...activeGame.guessedLetters, guess];
      const isCorrect = activeGame.word.includes(guess);

      const newCorrectGuesses = [...activeGame.correctGuesses];
      const newWrongGuesses = [...activeGame.wrongGuesses];
      let newMistakes = activeGame.mistakes;

      if (isCorrect) {
        newCorrectGuesses.push(guess);
      } else {
        newWrongGuesses.push(guess);
        newMistakes++;
      }

      // Check if activeGame is won (all letters guessed)
      const uniqueLetters = [...new Set(activeGame.word.split(""))];
      const isWon = uniqueLetters.every((l) => newCorrectGuesses.includes(l));

      // Check if activeGame is lost (6 mistakes)
      const isLost = newMistakes >= 6;

      const isCompleted = isWon || isLost;
      const endTime = isCompleted ? Date.now() : undefined;

      let score = 0;
      if (isCompleted && isWon) {
        // Calculate score based on word length, attempts, mistakes, and time
        const timeInSeconds = Math.floor(
          (endTime! - activeGame.startTime) / 1000
        );
        const baseScore = activeGame.word.length * 10;
        const attemptBonus = Math.max(0, 50 - (activeGame.attempts + 1) * 2);
        const mistakeBonus = Math.max(0, 60 - newMistakes * 10);
        const timeBonus = Math.max(0, 100 - timeInSeconds);

        score = baseScore + attemptBonus + mistakeBonus + timeBonus;
      }

      setActiveGame({
        word: activeGame.word,
        startTime: activeGame.startTime,
        guessedLetters: newGuessedLetters,
        correctGuesses: newCorrectGuesses,
        wrongGuesses: newWrongGuesses,
        attempts: activeGame.attempts + 1,
        mistakes: newMistakes,
        isCompleted,
        isWon,
        endTime,
        score,
      });
      if (isCompleted) setIsGameActive(false);
    },
    [activeGame]
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
      <>
        {activeGame && (
          <Container className="flex-col-center">
            <h2 className="text-lg">Previous Game</h2>
            <div className="flex justify-around items-center w-full">
              <span>word: {activeGame.word}</span>
              <span>score: {activeGame.score}</span>
              <span>mistakes: {activeGame.mistakes}</span>
              <span>
                mistakes:{" "}
                {formatTime(
                  activeGame.endTime
                    ? activeGame.endTime - activeGame.startTime
                    : 0
                )}
              </span>
            </div>
          </Container>
        )}
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
      </>
    );
  }

  const displayWord = getDisplayWord(
    activeGame!.word,
    activeGame!.guessedLetters
  );
  return (
    <Container className="flex-center space-x-4">
      <div className="w-2/5 h-full mb-4 hidden md:block">
        <HangmanFigure wrongGuesses={activeGame?.mistakes} />
      </div>
      <div className="w-3/5  flex flex-col justify-between items-center h-full gap-10 my-6">
        <div className="w-full flex-center gap-4">
          <MistakeAttemptCard
            displayText="Attempts"
            amount={activeGame?.attempts.toString()}
            className="bg-green-100 text-green-600"
          />
          <MistakeAttemptCard
            displayText="Mistakes"
            amount={activeGame?.mistakes.toString()}
            className="bg-red-100 text-red-600"
          />
        </div>
        <h2 className="text-3xl text-blue-700 font-bold font-mono text-center">
          {displayWord.join(" ")}
        </h2>
        <Keyboard
          correctGuesses={activeGame?.correctGuesses}
          wrongGuesses={activeGame!.wrongGuesses}
          guesses={activeGame?.guessedLetters}
          onKeyPress={onKeyPress}
        />
      </div>
    </Container>
  );
};

export default ClientSoloGame;
