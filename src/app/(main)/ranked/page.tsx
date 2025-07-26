import RankedGame from "@/components/RankedGame";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import Container from "@/components/Container";

const Page = async () => {
  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.auth.loggedInUser, {}, { token }).catch(
    () => null
  );
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
    </div>
  );
};
export default Page;
