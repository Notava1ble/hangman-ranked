"use client";

import LinkBtn from "@/components/LinkBtn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { ExternalLinkIcon } from "lucide-react";
import { EmptyObject } from "react-hook-form";

type UserStatsData = {
  totalGames: number;
  totalWins: number;
  totalScore: number;
};

type UserStatsProps = {
  preloadedStats: Preloaded<
    FunctionReference<
      "query",
      "public",
      EmptyObject,
      UserStatsData,
      string | undefined
    >
  >;
};

const UserStats: React.FC<UserStatsProps> = ({ preloadedStats }) => {
  const userStats = usePreloadedQuery(preloadedStats);

  return (
    <div className="w-[50%] mx-auto mt-6 flex justify-around items-center bg-white p-4 rounded-md relative drop-shadow-lg">
      <span>Total Games: {userStats.totalGames}</span>
      <span>Total Score: {userStats.totalScore}</span>
      <span>Total Wins: {userStats.totalWins}</span>
      <Tooltip>
        <TooltipTrigger className="absolute right-0 top-0">
          <LinkBtn
            href="/stats"
            size="icon"
            variant="link"
            className="text-zinc-400"
          >
            <ExternalLinkIcon />
          </LinkBtn>
        </TooltipTrigger>
        <TooltipContent>
          <p>View all Stats</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
export default UserStats;
