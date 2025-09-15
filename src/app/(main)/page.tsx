import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import UserStats from "./UserStats";
import { RecentSoloGames } from "@/components/RecentGames";
import { Preloaded } from "convex/react";
import SoloGame from "@/components/SoloGame";
import ClientSoloGame from "@/components/ClientSoloGame";
import ClientAuthGate from "./ClientAuthGate";

const Page = async () => {
  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.auth.loggedInUser, {}, { token });

  let preloadedStats: Preloaded<typeof api.user.getUserStats> | null = null;
  let preloadedRecentGames: Preloaded<
    typeof api.user.getRecentSoloGames
  > | null = null;

  if (user) {
    preloadedStats = await preloadQuery(
      api.user.getUserStats,
      {},
      { token }
    ).catch(() => null);
    preloadedRecentGames = await preloadQuery(
      api.user.getRecentSoloGames,
      {},
      { token }
    ).catch(() => null);
  }
  return (
    <div className="w-full h-full">
      <div className="w-full flex-center pt-8 md:pt-16">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Hello there {user ? user.name : "Player"}
        </h1>
      </div>
      <ClientAuthGate fallback={<ClientSoloGame />}>
        {preloadedStats && <UserStats preloadedStats={preloadedStats} />}
        {user ? <SoloGame /> : <ClientSoloGame />}
        {preloadedRecentGames && (
          <RecentSoloGames preloadedRecentGames={preloadedRecentGames} />
        )}
      </ClientAuthGate>
    </div>
  );
};
export default Page;
