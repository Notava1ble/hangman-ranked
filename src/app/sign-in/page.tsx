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
import { useRouter } from "next/navigation";
import { credentialValidator } from "@/lib/validators";

type ErrorType = {
  email?: string[] | undefined;
  password?: string[] | undefined;
  name?: string[] | undefined;
};

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [fieldErrors, setFieldErrors] = useState<ErrorType>({});
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
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    setFieldErrors({});
                    setErrors(undefined);

                    if (formData.get("flow") === "signUp") {
                      const { error } = credentialValidator.safeParse(
                        Object.fromEntries(formData.entries())
                      );

                      if (error) {
                        setFieldErrors(error.flatten().fieldErrors);
                        return;
                      }
                    }

                    try {
                      await signIn("password", formData);
                      router.replace("/");
                    } catch (e: unknown) {
                      if (
                        (e as Error).message.includes("This username is taken")
                      ) {
                        setFieldErrors({ name: ["This username is taken"] });
                        return;
                      }
                      if (
                        (e as Error).message.includes(
                          "This username is not allowed"
                        )
                      ) {
                        setFieldErrors({
                          name: ["This username is not allowed"],
                        });
                        return;
                      }
                      if ((e as Error).message.includes("Invalid characters")) {
                        setFieldErrors({
                          name: [
                            "The username can only contain letters, numbers, and underscores. It must start with a letter",
                          ],
                        });
                        return;
                      }
                      const errorMessage =
                        step === "signUp"
                          ? "Failed to create account. Please check your information and try again."
                          : "Invalid email or password.";

                      setErrors(errorMessage);
                    }
                  }}
                >
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-describedby={errors ? "auth-error" : undefined}
                        required
                        autoFocus
                      />
                      {fieldErrors.email && (
                        <p
                          className="text-red-500 text-sm -mt-1.5"
                          role="alert"
                          aria-live="polite"
                        >
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    {step === "signUp" && (
                      <div className="grid gap-3">
                        <Label htmlFor="name">Username</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="username_example123"
                          aria-describedby={errors ? "auth-error" : undefined}
                          required
                        />
                        {fieldErrors.name && (
                          <p
                            className="text-red-500 text-sm -mt-1.5"
                            role="alert"
                            aria-live="polite"
                          >
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autoComplete={
                          step === "signUp"
                            ? "new-password"
                            : "current-password"
                        }
                        minLength={step === "signUp" ? 8 : undefined}
                        aria-describedby={errors ? "auth-error" : undefined}
                      />
                      {fieldErrors.password && (
                        <p
                          className="text-red-500 text-sm -mt-1.5"
                          role="alert"
                          aria-live="polite"
                        >
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>
                    <input name="flow" type="hidden" value={step} />
                    <Button type="submit" className="w-full">
                      {step === "signUp" ? "Sign up" : "Log in"}
                    </Button>
                    {errors && (
                      <p
                        id="auth-error"
                        className="text-red-500 -mt-4 mb-4 text-sm"
                        role="alert"
                        aria-live="polite"
                      >
                        {errors}
                      </p>
                    )}
                  </div>
                  <div className="text-center text-sm">
                    {step === "signUp"
                      ? `Already have an account? `
                      : `Don't have an account? `}
                    <Button
                      variant="link"
                      className="underline underline-offset-4"
                      onClick={() => {
                        setErrors(undefined);
                        setFieldErrors({});
                        setStep(step === "signIn" ? "signUp" : "signIn");
                      }}
                    >
                      {step === "signUp" ? "Log in instead" : "Sign up instead"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
