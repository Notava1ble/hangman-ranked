import { useAction } from "convex/react"
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export const useServerTime = () => {
  const getServerTime = useAction(api.misc.getServerTime);
  const [offset, setOffset] = useState<number>(0);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const sync = async () => {
      const clientRequestTime = Date.now();
      
      // 1. Ask Server what time it is
      const serverTime = await getServerTime();
      
      // 2. Calculate Latency (Round Trip Time)
      const clientResponseTime = Date.now();
      const roundTripTime = clientResponseTime - clientRequestTime;
      
      // 3. Estimate that the server generated the time halfway through the request
      const adjustedServerTime = serverTime + (roundTripTime / 2);
      
      // 4. Calculate the difference between Client and Server
      const clockOffset = adjustedServerTime - clientResponseTime;

      setOffset(clockOffset);
      setIsSynced(true);
    };

    sync();
  }, [getServerTime]);

  // Helper to get the current server time based on local clock + offset
  const getCurrentServerTime = () => {
    return Date.now() + offset;
  };

  return { offset, isSynced, getCurrentServerTime };
};