"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDigitalTime } from "../lib/utils";

const Timer = ({ startTime }: { startTime: Date }) => {
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
      <p className="mb-2">Waiting for other people</p>
      <span
        className="text-2xl mt-2"
        role="timer"
        aria-live="polite"
        aria-label="Elapsed time"
      >
        {formatDigitalTime(Date.now() - startTime.getTime())}
      </span>
    </div>
  );
};
export default Timer;
