"use client";

import Container from "@/components/Container";
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
    <Container className="flex justify-around items-center p-4 relative">
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
    </Container>
  );
};
export default UserStats;
