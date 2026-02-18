import Container from "@/components/Container";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { formatLastSeen, getEloProgression, getRankFromElo } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  RankedGamesGraph,
  RecentRankedGamesTable,
} from "@/components/RecentGames";
import Link from "next/link";
import ProfileActionBtn from "@/components/ProfileActionBtn";

const Page = async ({ params }: { params: Promise<{ user: string }> }) => {
  const { user } = await params;

  const userInfo = await fetchQuery(
    api.user.getUserProfile,
    {
      userName: user,
    },
    { token: await convexAuthNextjsToken() },
  ).catch(() => {
    redirect("/not-found");
  });

  const { recentGames } = userInfo;

  return (
    <div className="w-full h-full mb-32">
      <Container className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <Avatar className="size-16 rounded-lg sm:size-18">
              <AvatarImage src={userInfo.image} />
              <AvatarFallback />
            </Avatar>
            <div className="space-y-2">
              <div>
                <h1 className="font-semibold text-3xl leading-tight break-all sm:text-4xl">
                  {userInfo.name}
                </h1>
                <p className="text-lg sm:text-xl">
                  <span className="text-green-800">
                    {/* Add the rank image (diamond is placeholder) */}
                    💎 {getRankFromElo(userInfo.elo)} [{userInfo.elo}]
                  </span>{" "}
                  <span>#{userInfo.rank}</span>
                </p>
              </div>
            </div>
          </div>

          {userInfo.isSelf && (
            <div className="flex gap-2 sm:justify-end sm:self-start">
              <Button variant="outline" size="sm">
                <Edit /> Edit
              </Button>
              <ProfileActionBtn
                variant="destructive"
                mutationApi="delete"
                refresh={true}
                size="sm"
              >
                <Trash /> Delete
              </ProfileActionBtn>
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-1 text-sm sm:text-base">
          <p>Account created: {formatLastSeen(userInfo.accountCreated)}</p>
          <p>Last seen: {formatLastSeen(userInfo.userStats.lastSeen)}</p>
          {userInfo.personalScoreRecord && (
            <p>Personal best: {userInfo.personalScoreRecord}</p>
          )}
          {userInfo.isSelf && (
            <Link
              href="/stats"
              className="text-primary underline-offset-4 hover:underline"
            >
              Go to stats
            </Link>
          )}
        </div>
      </Container>
      {recentGames.length > 3 && (
        <RankedGamesGraph eloProgression={getEloProgression(recentGames)} />
      )}
      <RecentRankedGamesTable
        recentGames={recentGames}
        tableTitle={`${userInfo.name}'s recent games`}
        paginate={true}
        limit={6}
      />
    </div>
  );
};
export default Page;
