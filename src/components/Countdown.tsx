"use client";

import { useEffect, useState } from "react";
import { formatDigitalTime } from "../lib/utils";
import { useServerTime } from "@/hooks/useServerTime"; // Import the hook
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Countdown = ({ lastUpdate, countdownFrom = 30 }: { lastUpdate: number, countdownFrom?: number }) => {
  const { getCurrentServerTime, isSynced } = useServerTime();
  
  // We initialize with a safe default, but the effect will snap it to the correct time
  const [timeLeft, setTimeLeft] = useState(countdownFrom * 1000);

  useEffect(() => {
    if (!isSynced) return;

    const interval = setInterval(() => {
      // 1. Get the CURRENT time on the server
      const now = getCurrentServerTime();
      
      // 2. Calculate how much time has passed since the game started
      const elapsed = now - lastUpdate;
      
      // 3. Calculate remaining
      const remaining = (countdownFrom * 1000) - elapsed;

      // 4. Update display (clamp to 0 so we don't show negative)
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 100); // Update every 100ms for smoothness, though we only show seconds

    return () => clearInterval(interval);
  }, [isSynced, lastUpdate, countdownFrom, getCurrentServerTime]);

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
        {isSynced ? Math.ceil(timeLeft / 1000) : countdownFrom}s
      </div>
    </div>
  );
};

export default Countdown;