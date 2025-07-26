"use client";

import { useEffect, useState } from "react";
import { formatDigitalTime } from "../lib/utils";

const Timer = ({ startTime }: { startTime: Date }) => {
  const [, setTick] = useState(0);

  // Rerender every second
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-fit mx-auto text-center">
      <p className="mb-2">Waiting for other people</p>
      <span className="text-2xl mt-2">
        {formatDigitalTime(Date.now() - startTime.getTime())}
      </span>
    </div>
  );
};
export default Timer;
