"use client";

import Link from "next/link";
import LinkBtn from "./LinkBtn";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowRight } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";

const Navbar = () => {
  const { signOut } = useAuthActions();

  const user = useQuery(api.auth.loggedInUser);

  return (
    <header className="sticky top-0 pt-6 px-4 pb-6 w-full bg-card/40 backdrop-blur-md border-b-1 z-100">
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex items-center gap-16">
          <h1 className="text-3xl font-mono font-medium">
            <Link href="#">Hangman Ranked</Link>
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
    </header>
  );
};
export default Navbar;
