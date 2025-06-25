"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type PreloadedRecentGamesType = Preloaded<
  typeof api.user.getRecentSoloGames
>;

const RecentSoloGames = ({
  preloadedRecentGames,
}: {
  preloadedRecentGames: PreloadedRecentGamesType;
}) => {
  const recentGames = usePreloadedQuery(preloadedRecentGames);

  return (
    <div className="bg-white p-6 rounded-md drop-shadow-lg w-[50%] mx-auto mt-6">
      <Table>
        <TableCaption>Your recent Games</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] pl-8">Word</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Mistakes</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead className="pr-8 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentGames.map((game) => {
            return (
              <TableRow
                key={game._id}
                className={`
                  ${
                    game.isWon
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-red-100 hover:bg-red-200"
                  }
                `}
              >
                <TableCell className="pl-8">{game.word}</TableCell>
                <TableCell className="text-right">{game.score}</TableCell>
                <TableCell className="text-right">{game.mistakes}</TableCell>
                <TableCell className="text-right">{game.attempts}</TableCell>
                <TableCell className="pr-8 text-right">
                  {game.isWon ? "Won" : "Loss"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default RecentSoloGames;
