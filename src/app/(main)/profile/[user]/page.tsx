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
    { token: await convexAuthNextjsToken() }
  ).catch(() => {
    redirect("/not-found");
  });

  const { recentGames } = userInfo;

  return (
    <div className="w-full h-full mb-32">
      <Container className="relative">
        <div className="flex gap-4">
          <Avatar className="size-18 rounded-lg">
            <AvatarImage src={userInfo.image} />
            <AvatarFallback />
          </Avatar>
          <div className="space-y-2">
            <div>
              {/* Temporary rank. Color text based or rank */}
              <h1 className="font-semibold text-4xl">{userInfo.name}</h1>
              <p className="text-xl">
                <span className="text-green-800">
                  {/* Add the rank image (diamond is placeholder) */}
                  💎 {getRankFromElo(userInfo.elo)} [{userInfo.elo}]
                </span>{" "}
                <span>#{userInfo.rank}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p>Account created: {formatLastSeen(userInfo.accountCreated)}</p>
          <p>Last seen: {formatLastSeen(userInfo.userStats.lastSeen)}</p>
          {userInfo.personalScoreRecord && (
            <p>Personal best: {userInfo.personalScoreRecord}</p>
          )}
          {userInfo.isSelf && <Link href="/stats">Go to stats</Link>}
        </div>
        {userInfo.isSelf && (
          <div className="flex-center gap-2 absolute top-4 right-4">
            <Button variant="outline">
              <Edit /> Edit
            </Button>
            <ProfileActionBtn
              variant="destructive"
              mutationApi="delete"
              refresh={true}
            >
              <Trash /> Delete
            </ProfileActionBtn>
          </div>
        )}
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
