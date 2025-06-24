"use client";

import { useState } from "react";
import HangmanFigure from "./HangmanFigure";
import { Button } from "./ui/button";

const SoloGame = () => {
  const [wrongGuesses, setWrongGuesses] = useState(0);

  return (
    <div>
      <HangmanFigure wrongGuesses={wrongGuesses} />
      <Button onClick={() => setWrongGuesses(wrongGuesses + 1)}>
        MakeWrongGuess
      </Button>
      <Button onClick={() => setWrongGuesses(0)}>Reset</Button>
    </div>
  );
};
export default SoloGame;
