"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDigitalTime } from "../lib/utils";

const Timer = ({ startTime }: { startTime: Date }) => {
  const [displayedTime, setDisplayedTime] = useState(
    Date.now() - startTime.getTime() < 0 ? 0 : Date.now() - startTime.getTime()
  );

  const updateTimer = useCallback(() => {
    setDisplayedTime((prev) => prev + 1000);
  }, []);

  // Rerender every second
  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div className="w-fit mx-auto text-center">
      <p className="mb-2">Waiting for other people</p>
      <span
        className="text-2xl mt-2"
        role="timer"
        aria-live="polite"
        aria-label="Elapsed time"
      >
        {formatDigitalTime(displayedTime)}
      </span>
    </div>
  );
};
export default Timer;
