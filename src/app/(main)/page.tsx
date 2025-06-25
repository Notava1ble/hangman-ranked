import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import UserStats from "./UserStats";
import RecentSoloGames from "@/components/RecentSoloGames";
import { Preloaded } from "convex/react";

const Page = async () => {
  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.auth.loggedInUser, {}, { token });

  let preloadedStats: Preloaded<typeof api.user.getUserStats> | null = null;
  let preloadedRecentGames: Preloaded<
    typeof api.user.getRecentSoloGames
  > | null = null;

  if (user) {
    preloadedStats = await preloadQuery(api.user.getUserStats, {}, { token });
    preloadedRecentGames = await preloadQuery(
      api.user.getRecentSoloGames,
      {},
      { token }
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex-center pt-16">
        <h1 className="text-4xl font-semibold">
          Hello there {user ? user.name : "Player"}
        </h1>
      </div>
      {preloadedStats && <UserStats preloadedStats={preloadedStats} />}
      {preloadedRecentGames && (
        <RecentSoloGames preloadedRecentGames={preloadedRecentGames} />
      )}
    </div>
  );
};
export default Page;
