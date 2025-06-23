"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { FunctionReference } from "convex/server";
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
    <div className=" w-[50%] mx-auto mt-6 flex justify-around items-center bg-white p-4 rounded-md">
      <span>Total Games: {userStats.totalGames}</span>
      <span>Total Score: {userStats.totalScore}</span>
      <span>Total Wins: {userStats.totalWins}</span>
    </div>
  );
};
export default UserStats;
