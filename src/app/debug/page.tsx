import ActionButton from "./button";
import Link from "next/link";

const throwServerError = async () => {
  "use server";
  throw new Error("This is a server-side error for testing purposes.");
};

export default function DebugPage() {
  return (
    <main className="mx-auto w-3/4 pt-10 prose max-w-3/4">
      <h3 className="text-destructive">
        Warning: This page is for debugging purposes only.{" "}
        <Link href="/">Go back</Link> if you don&apos;t know what you&apos;re
        doing. Everything you do here will be at your own risk
      </h3>
      <section>
        <h4>
          Click the button below to intentionally throw a server side error.
        </h4>
        <ActionButton func={throwServerError} />
      </section>
      <section>
        <h4>
          Click the button below to intentionally throw a client side error.
        </h4>
        <ActionButton />
      </section>
    </main>
  );
}
