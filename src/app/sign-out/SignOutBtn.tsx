"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const SignOutBtn = () => {
  const { signOut } = useAuthActions();

  return <Button onClick={() => void signOut()}>Sign Out</Button>;
};
export default SignOutBtn;
