"use client";

import { useMutation } from "convex/react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

const ProfileActionBtn = ({
  children,
  mutationApi,
  refresh = false,
  className,
  variant,
  size,
  ...props
}: {
  children: React.ReactNode;
  mutationApi: "edit" | "delete";
  refresh: boolean;
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) => {
  if (mutationApi !== "delete") throw new Error("Action not implemented");

  const action = useMutation(api.user.deleteUserAccount);
  const { signOut } = useAuthActions();

  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await action();
        await signOut();
        if (refresh) {
          router.replace("/");
        }
      }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Button>
  );
};
export default ProfileActionBtn;
