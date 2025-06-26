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
import { cn } from "@/lib/utils";

export const revalidate = 1800; // 30 min

const Page = async () => {
  const topGames = await fetchQuery(api.leaderboard.getSoloLeaderboard);
  return (
    <div className="flex-center w-full h-full">
      <div className="bg-white rounded-md drop-shadow-lg w-[55%] mt-6 mb-6">
        <div className="p-6 bg-indigo-600 rounded-t-md text-white">
          <h2 className="text-3xl font-bold">🏆 Leaderboard</h2>
          <p className="mt-2">Top 100 Games Worldwide</p>
        </div>
        <div className="py-2 px-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-indigo-50">
                <TableHead className="text-right w-[40px]">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Word</TableHead>
                <TableHead>Mistakes</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topGames.map((game, idx) => {
                const isEven = (idx + 1) % 2 === 0;
                return (
                  <TableRow
                    key={game.rank}
                    className={cn(
                      "hover:bg-indigo-200",
                      isEven && "bg-indigo-50"
                    )}
                  >
                    <TableCell className="text-right">{game.rank}</TableCell>
                    <TableCell>{game.user}</TableCell>
                    <TableCell>{game.score}</TableCell>
                    <TableCell>{game.word}</TableCell>
                    <TableCell>{game.attempts}</TableCell>
                    <TableCell>{game.mistakes}</TableCell>
                    <TableCell>{game.time}ms</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
