import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { cn, formatLastSeen, formatTime } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export const revalidate = 1800; // 30 min

const Page = () => {
  return (
    <Tabs defaultValue="solo">
      <div className="flex-center w-full h-full">
        <div className="bg-white rounded-md drop-shadow-lg w-[95%] lg:w-[55%] md:w-[75%] sm:w-[85%] mt-6 mb-6">
          {/* Header: title on the left, tabs always visible on the right */}
          <div className="p-6 bg-indigo-600 rounded-t-md text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  🏆 Leaderboard
                </h2>
                <p className="mt-2 opacity-90">
                  Top 100 Games/Players Worldwide
                </p>
              </div>

              {/* Desktop: pill-style tabs */}
              <div className="hidden sm:flex items-center">
                <TabsList className="bg-white/10 p-1 rounded-full inline-flex gap-1">
                  <TabsTrigger
                    value="solo"
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-all whitespace-nowrap",
                      "data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-semibold",
                      "data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/20"
                    )}
                  >
                    Score
                  </TabsTrigger>
                  <TabsTrigger
                    value="ranked"
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-all whitespace-nowrap",
                      "data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-semibold",
                      "data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/20"
                    )}
                  >
                    Elo
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Mobile: stacked compact buttons below header */}
              <div className="sm:hidden w-full">
                <TabsList className="w-full bg-muted/60">
                  <TabsTrigger value="solo">Score</TabsTrigger>
                  <TabsTrigger value="ranked">Elo</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* Content area: TabsContent stays inside the same card so tabs never disappear */}
          <div className="py-2 px-4">
            <TabsContent value="solo">
              <SoloLeaderboard />
            </TabsContent>
            <TabsContent value="ranked">
              <RankedLeaderboard />
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

const RankedLeaderboard = async () => {
  const ranked = await fetchQuery(api.leaderboard.getEloLeaderboard);

  if (!ranked || ranked.length === 0) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">No ranked data yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-indigo-50">
          <TableHead className="text-right w-[40px]">#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Elo</TableHead>
          <TableHead className="text-right">Games</TableHead>
          <TableHead className="text-right">Win%</TableHead>
          <TableHead className="text-right pr-6">Last seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ranked.map((p, idx) => {
          const isEven = (idx + 1) % 2 === 0;
          return (
            <TableRow
              key={p.rank}
              className={cn("hover:bg-indigo-200", isEven && "bg-indigo-50")}
            >
              <TableCell className="text-right">{p.rank}</TableCell>
              <TableCell>
                <Link href={`profile/${p.user}`}>{p.user}</Link>
              </TableCell>
              <TableCell className="text-right font-medium">{p.elo}</TableCell>
              <TableCell className="text-right">{p.games}</TableCell>
              <TableCell className="text-right">
                {(p.winPct * 100).toFixed(1)}%
              </TableCell>
              <TableCell className="text-right pr-6">
                {formatLastSeen(p.lastSeen)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const SoloLeaderboard = async () => {
  const topGames = await fetchQuery(api.leaderboard.getSoloLeaderboard);
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-indigo-50">
          <TableHead className="text-right w-[40px]">#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-center">Word</TableHead>
          <TableHead className="text-right max-sm:hidden">Attempts</TableHead>
          <TableHead className="text-right max-md:hidden">Mistakes</TableHead>
          <TableHead className="text-right pr-6">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topGames.map((game, idx) => {
          const isEven = (idx + 1) % 2 === 0;
          return (
            <TableRow
              key={game.rank}
              className={cn("hover:bg-indigo-200", isEven && "bg-indigo-50")}
            >
              <TableCell className="text-right">{game.rank}</TableCell>
              <Link href={`profile/${game.user}`}>{game.user}</Link>
              <TableCell className="text-right">{game.score}</TableCell>
              <TableCell className="text-center">{game.word}</TableCell>
              <TableCell className="text-right max-sm:hidden">
                {game.attempts}
              </TableCell>
              <TableCell className="text-right max-md:hidden">
                {game.mistakes}
              </TableCell>
              <TableCell className="text-right pr-6">
                {formatTime(game.time)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Page;
