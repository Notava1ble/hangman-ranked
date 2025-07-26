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
import Container from "./Container";

export type PreloadedRecentSoloGamesType = Preloaded<
  typeof api.user.getRecentSoloGames
>;
export type PreloadedRecentRankedGamesType = Preloaded<
  typeof api.user.getRecentRankedGames
>;

export const RecentSoloGames = ({
  preloadedRecentGames,
}: {
  preloadedRecentGames: PreloadedRecentSoloGamesType;
}) => {
  const recentGames = usePreloadedQuery(preloadedRecentGames);

  return (
    <Container>
      <Table>
        <TableCaption>Your recent Games</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] pl-6">Word</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Mistakes</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead className="pr-6 text-right">Status</TableHead>
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
                <TableCell className="pl-6">{game.word}</TableCell>
                <TableCell className="text-right">{game.score}</TableCell>
                <TableCell className="text-right">{game.mistakes}</TableCell>
                <TableCell className="text-right">{game.attempts}</TableCell>
                <TableCell className="pr-6 text-right">
                  {game.isWon ? "Won" : "Loss"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};

export const RecentRankedGames = ({
  preloadedRecentGames,
}: {
  preloadedRecentGames: PreloadedRecentRankedGamesType;
}) => {
  const recentGames = usePreloadedQuery(preloadedRecentGames);

  return (
    <Container>
      <Table>
        <TableCaption>Your recent Games</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] pl-6">Word</TableHead>
            <TableHead className="text-right">Opponent</TableHead>
            <TableHead className="text-right">Elo Change</TableHead>
            <TableHead className="text-right">Mistakes</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead className="pr-6 text-right">Winner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentGames.map((game) => {
            return (
              <TableRow
                key={game._id}
                className={`
                  ${
                    game.winner !== game.opponent
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-red-100 hover:bg-red-200"
                  }
                `}
              >
                <TableCell className="pl-6">{game.word}</TableCell>
                <TableCell className="text-right">{game.opponent}</TableCell>
                <TableCell className="text-right">{game.eloChange}</TableCell>
                <TableCell className="text-right">{game.mistakes}</TableCell>
                <TableCell className="text-right">{game.attempts}</TableCell>
                <TableCell className="pr-6 text-right">{game.winner}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};
export default RecentRankedGames;
