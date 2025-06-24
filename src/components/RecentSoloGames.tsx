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
            <TableHead className="w-[100px]">Word</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Mistakes</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentGames.map((game, i) => {
            return (
              <TableRow
                key={game._id}
                className={`
                  ${
                    game.isWon
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-red-100 hover:bg-red-200"
                  }
                  ${i === 0 && "rounded-t-xl"}
                    ${i === 5 && "rounded-b-xl"}
                  
                `}
              >
                <TableCell>{game.word}</TableCell>
                <TableCell>{game.score}</TableCell>
                <TableCell>{game.mistakes}</TableCell>
                <TableCell>{game.attempts}</TableCell>
                <TableCell>{game.isWon ? "Won" : "Loss"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default RecentSoloGames;
