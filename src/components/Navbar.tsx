"use client";

import Link from "next/link";
import LinkBtn from "./LinkBtn";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowRight, Home, Sword, Trophy } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { signOut } = useAuthActions();
  const isMobile = useIsMobile();

  const user = useQuery(api.auth.loggedInUser);

  if (isMobile) {
    return (
      <>
        <nav className="sticky top-0 py-6 px-4 w-full bg-card/40 backdrop-blur-md border-b-1 z-100">
          <div className="w-full h-full flex justify-between items-center">
            <h1 className="text-xl sm:text-xl font-mono font-medium">
              <Link href="/">Hangman Ranked</Link>
            </h1>
            <div className="flex items-center gap-4">
              <Authenticated>
                <Button onClick={() => void signOut()} variant="link">
                  Sign Out
                </Button>
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback />
                </Avatar>
              </Authenticated>
              <Unauthenticated>
                <Button variant="default" asChild>
                  <Link href="/sign-in">
                    Log In <ArrowRight />
                  </Link>
                </Button>
              </Unauthenticated>
            </div>
          </div>
        </nav>
        <nav className="fixed bottom-0 py-4 px-4 w-full bg-white/40 backdrop-blur-md border-t-1 rounded-t-md z-100">
          <div className="flex justify-around items-center">
            <Link href="/">
              <Home />
            </Link>
            <Link href="/ranked">
              <Sword />
            </Link>
            <Link href="/leaderboard">
              <Trophy />
            </Link>
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav className="sticky top-0 py-6 px-4 w-full bg-card/40 backdrop-blur-md border-b-1 z-100">
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex items-center gap-16">
          <h1 className="text-xl lg:text-3xl md:text-2xl sm:text-xl font-mono font-medium">
            <Link href="/">Hangman Ranked</Link>
          </h1>
          <div className="flex items-center gap-4">
            <LinkBtn href="/ranked" variant="link" size="sm">
              Ranked
            </LinkBtn>
            <LinkBtn href="/leaderboard" variant="link" size="sm">
              Leaderboard
            </LinkBtn>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Authenticated>
            <Button onClick={() => void signOut()} variant="link">
              Sign Out
            </Button>
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback />
            </Avatar>
          </Authenticated>
          <Unauthenticated>
            <Button variant="default" asChild>
              <Link href="/sign-in">
                Log In <ArrowRight />
              </Link>
            </Button>
          </Unauthenticated>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
