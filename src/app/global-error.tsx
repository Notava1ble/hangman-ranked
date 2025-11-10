"use client";

import NextError from "next/error";
import GlobalErrorClient from "@/components/GlobalErrorClient";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        {/* Render a client component to capture the exception in-browser, but keep
            the top-level error file a Server Component to avoid SSR/HMR runtime
            mismatch issues. */}
        <GlobalErrorClient error={error} />

        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
