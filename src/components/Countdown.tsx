"use client";

import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Countdown = ({
  lastUpdate,
  countdownFrom,
}: {
  lastUpdate: Date;
  countdownFrom?: number;
}) => {
  const [, setTick] = useState(0);

  const updateTimer = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Rerender every second
  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div className="w-fit mx-auto text-center">
      <Tooltip>
        <TooltipTrigger>
          <p>Time Remaining</p>
        </TooltipTrigger>
        <TooltipContent>
          Make a move before the timer runs out to avoid losing
        </TooltipContent>
      </Tooltip>
      <div
        className="text-2xl"
        role="timer"
        aria-live="polite"
        aria-label="Time left"
      >
        {Math.max(
          0,
          (countdownFrom ?? 30) -
            Math.ceil((Date.now() - lastUpdate.getTime()) / 1000)
        )}
        s
      </div>
    </div>
  );
};
export default Countdown;
