import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hangman Ranked",
  description: "A hangman game with a leaderboard and ranked system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased mb-20 r md:mb-0`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Analytics />
          <Script
            defer
            data-domain="hangman-ranked.vercel.app"
            src="https://plausible.io/js/script.tagged-events.js"
          />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
