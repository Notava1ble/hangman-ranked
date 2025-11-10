"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalErrorClient({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    try {
      Sentry.captureException(error);
    } catch (e) {
      // swallow to avoid throwing from the error UI
      // eslint-disable-next-line no-console
      console.error("Failed to capture exception in GlobalErrorClient", e);
    }
  }, [error]);

  return null;
}
