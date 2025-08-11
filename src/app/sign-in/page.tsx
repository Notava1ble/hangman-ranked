"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SignInBtn from "./SignInBtn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import LinkBtn from "@/components/LinkBtn";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [errors, setErrors] = useState<string | undefined>(undefined);

  const router = useRouter();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Hangman Ranked
        </a> */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome</CardTitle>
              <CardDescription>
                Login with your Google or Github account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);

                  try {
                    await signIn("password", formData);
                    router.push("/");
                  } catch (e) {
                    console.log(e, typeof e);

                    if (e instanceof Error) {
                      setErrors(e.message);
                    } else {
                      setErrors(String(e));
                    }
                  }
                }}
              >
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <SignInBtn provider="Google" />
                    <SignInBtn provider="GitHub" />
                  </div>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                      />
                    </div>
                    <input name="flow" type="hidden" value={step} />
                    <Button type="submit" className="w-full">
                      {step === "signUp" ? "Sign up" : "Log in"}
                    </Button>
                    {errors && <p className="text-red-500">{errors}</p>}
                  </div>
                  <div className="text-center text-sm">
                    {step === "signUp"
                      ? `Already have an account? `
                      : `Don't have an account? `}
                    <LinkBtn
                      variant="link"
                      href="#"
                      className="underline underline-offset-4"
                      onClick={() => {
                        setStep(step === "signIn" ? "signUp" : "signIn");
                      }}
                    >
                      {step === "signUp" ? "Log in instead" : "Sign up instead"}
                    </LinkBtn>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
