import RankedGame from "@/components/RankedGame";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import Container from "@/components/Container";
import { Preloaded } from "convex/react";
import { RecentRankedGames } from "@/components/RecentGames";

const Page = async () => {
  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.auth.loggedInUser, {}, { token }).catch(
    () => null
  );
  let preloadedRecentGames: Preloaded<
    typeof api.user.getRecentRankedGames
  > | null = null;

  if (user) {
    preloadedRecentGames = await preloadQuery(
      api.user.getRecentRankedGames,
      {},
      { token }
    ).catch(() => null);
  }

  return (
    // Start Ranked
    <div className="w-full h-full">
      <div className="w-full flex-center pt-8 md:pt-16">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Challenge other players
        </h1>
      </div>
      {user ? (
        <RankedGame />
      ) : (
        <Container>
          <p className="w-fit mx-auto">
            Log in to compete against other players on a first to guess
            challenge
          </p>
        </Container>
      )}
      {preloadedRecentGames && (
        <RecentRankedGames preloadedRecentGames={preloadedRecentGames} />
      )}
    </div>
  );
};
export default Page;
