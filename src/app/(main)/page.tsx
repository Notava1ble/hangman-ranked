import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import UserStats from "./UserStats";
import RecentSoloGames from "@/components/RecentSoloGames";

const Page = async () => {
  // const [previousGameStats, setPreviousGameStats] = useState<{
  //   isCompleted: boolean;
  //   isWon: boolean;
  //   score: number;
  //   attempts: number;
  //   mistakes: number;
  //   timeTaken?: number;
  // } | null>(null);

  // const { signOut } = useAuthActions();

  // const user = useQuery(api.auth.loggedInUser);
  // const displayWord = useQuery(api.game.getDisplayWord);
  // const guesses = useQuery(api.game.getGuesses);

  // const makeGuess = useMutation(api.game.makeGuess);
  // const startNewGame = useMutation(api.game.createGame);

  // const handleGuess = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const guessInput = event.currentTarget.elements.namedItem(
  //     "guess"
  //   ) as HTMLInputElement;
  //   const guess = guessInput.value.trim().toLowerCase();
  //   if (guess) {
  //     try {
  //       const stats = await makeGuess({ guess });
  //       guessInput.value = "";
  //       if (stats) {
  //         setPreviousGameStats({
  //           isCompleted: stats.isCompleted,
  //           isWon: stats.isWon,
  //           score: stats.score,
  //           attempts: stats.attempts,
  //           mistakes: stats.mistakes,
  //           timeTaken: stats.timeTaken,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error making guess:", error);
  //     }
  //   }
  // };
  // const handleNewGame = async () => {
  //   try {
  //     await startNewGame();
  //   } catch (error) {
  //     console.error("Error starting new game:", error);
  //   }
  // };

  const token = await convexAuthNextjsToken();

  const user = await fetchQuery(api.auth.loggedInUser, {}, { token });

  const preloadedStats = await preloadQuery(
    api.user.getUserStats,
    {},
    { token }
  ).catch(() => null);

  const preloadedRecentGames = await preloadQuery(
    api.user.getRecentSoloGames,
    {},
    { token }
  ).catch(() => null);

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
