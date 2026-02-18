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
import LineChartComponent from "./LineChart";
import { cn, getEloProgression } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>Your recent Games</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-37.5 pl-6">Word</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Mistakes
              </TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Attempts
              </TableHead>
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
                  <TableCell className="hidden text-right sm:table-cell">
                    {game.mistakes}
                  </TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    {game.attempts}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    {game.isAbandoned
                      ? "Abandoned"
                      : game.isWon
                        ? "Won"
                        : "Lost"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export const RecentRankedGames = ({
  preloadedRecentGames,
}: {
  preloadedRecentGames: PreloadedRecentRankedGamesType;
}) => {
  const recentGames = usePreloadedQuery(preloadedRecentGames);

  const eloProgression = getEloProgression(recentGames);

  return (
    <>
      <RecentRankedGamesTable recentGames={recentGames} />
      {eloProgression.length > 3 && (
        <RankedGamesGraph eloProgression={eloProgression} />
      )}
    </>
  );
};

export const RecentRankedGamesTable = ({
  recentGames,
  tableTitle = "Your recent Games",
  limit = 5,
  paginate = false,
}: {
  recentGames: Awaited<
    ReturnType<typeof fetchQuery<typeof api.user.getUserProfile>>
  >["recentGames"];
  tableTitle?: string;
  limit?: number;
  paginate?: boolean;
}) => {
  const [page, setPage] = useState(0);

  // if paginate is true, use 5 per page, otherwise respect limit
  const pageSize = limit;
  const start = paginate ? page * pageSize : 0;
  const end = start + pageSize;
  const gamesToShow = recentGames.slice(start, end);

  const totalPages = paginate ? Math.ceil(recentGames.length / pageSize) : 1;

  return (
    <Container>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>{tableTitle}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-37.5 pl-6">Word</TableHead>
              <TableHead className="text-right">Opponent</TableHead>
              <TableHead className="text-right">Elo Change</TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Mistakes
              </TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Attempts
              </TableHead>
              <TableHead className="pr-6 text-right">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamesToShow.map((game) => {
              return (
                <TableRow
                  key={game._id}
                  className={`
                    ${
                      game.hasUserWon
                        ? "bg-green-100 hover:bg-green-200"
                        : "bg-red-100 hover:bg-red-200"
                    }
                  `}
                >
                  <TableCell className="pl-6">{game.word}</TableCell>
                  <TableCell>
                    {game.opponent === "deleted-user" ? (
                      <p>{game.opponent}</p>
                    ) : (
                      <Link
                        href={`/profile/${encodeURIComponent(game.opponent)}`}
                      >
                        {game.opponent}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {game.eloChange
                      ? game.eloChange > 0
                        ? `+${game.eloChange}`
                        : game.eloChange
                      : 0}
                  </TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    {game.mistakes}
                  </TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    {game.attempts}
                  </TableCell>
                  <TableCell>
                    {game.winner === "deleted-user" ? (
                      <p>{game.winner}</p>
                    ) : (
                      <Link href={`/profile/${game.winner}`}>
                        {game.winner}
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {paginate && totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft />
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </Container>
  );
};

export const RankedGamesGraph = ({
  eloProgression,
}: {
  eloProgression: {
    game: number;
    elo: number;
  }[];
}) => {
  return (
    <Container>
      <LineChartComponent
        chartConfig={{
          elo: {
            label: "Elo",
            color: "var(--chart-3)",
          },
        }}
        chartData={eloProgression}
        lineType="linear"
        yDomain={["dataMin", "dataMax"]}
        yPadding={{ bottom: 20, top: 20 }}
        dot={{
          fill: "var(--chart-3)",
        }}
        activeDot={{
          r: 6,
        }}
      />
    </Container>
  );
};
