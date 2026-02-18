# Hangman Ranked

A modern, real-time web implementation of Hangman with solo and ranked multiplayer modes, built with Next.js and Convex. Players can play casual solo games or compete in ranked head-to-head matches with an Elo-based rating system.

## Features

- Solo play: quick single-player Hangman.
- Ranked matches: pair with other players via matchmaking, play a word in real-time, and gain/lose Elo rating based on match results.
- Scheduler-backed timeouts: inactive matches are handled server-side via Convex scheduled functions.
- Leaderboards & stats: per-user statistics, recent games, and global ranking queries.
- Curated word list: the game uses a cleaned, pre-generated word list for consistent play experience.

## Tech Stack

- Frontend: Next.js 16 + React 19 (app router), TypeScript, Tailwind CSS
- Backend: Convex (serverless DB + functions + scheduler) with `convex` types and generated API
- Auth: `@convex-dev/auth` for session management and user tables

## How Ranked Mode Works (summary)

- Players enter matchmaking; the server pairs two waiting users and selects a word from the curated list.
- Each player takes alternating guesses; server stores guesses, mistakes, attempts and timestamps.
- Games are completed when a player guesses all unique letters or reaches a mistake limit (6). Elo rating is updated on completion.
- Server-side scheduled tasks handle stale matches and timeouts to ensure matches progress or clean up.

## Getting Started (developer)

Requirements

- Node.js (recommended 18+)
- pnpm or npm

Install

```bash
pnpm install
```

Local development (Next.js)

```bash
pnpm run dev
```

Convex development

1. Install and configure the Convex CLI and your Convex project per Convex docs.
2. Ensure Convex environment variables (project URL / keys) are available locally as required by your Convex setup.
3. Deploy or run local Convex functions if testing backend logic:

```bash
convex dev
```

## Customization & Data

The game uses a curated word list located at `convex/data/allWords.ts`. This list is pre-filtered for appropriate word lengths and content to ensure a good gameplay experience. You can modify this list to add or remove words as desired, but be mindful of maintaining a balanced and fair selection for players.

## Contributing

Feel free to fork the repository and submit pull requests for improvements, bug fixes, or new features. Contributions are welcome!

## Tests & Validation

There are no automated tests included in the repository in favor of development speed and simplicity.

## Issues

For questions or help, open an issue in this repository.
