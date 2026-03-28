# Infinite Wordle

An Expo-based Wordle app with endless rounds, local stat tracking, hard mode, and a much larger five-letter dictionary than the starter project.

## What It Does

- Plays classic six-guess Wordle rounds with a five-letter target word.
- Keeps serving new answers without repeating them until the local answer deck is exhausted.
- Supports `Standard` and `Hard` mode.
- Persists the current game, theme preference, streaks, and guess distribution with AsyncStorage.
- Works across iOS, Android, and web through Expo.

## Tech Stack

- Expo 55
- React 19
- React Native 0.83
- Expo Router
- TypeScript

## Project Structure

```text
src/
  app/                App routes and main screen
  components/         UI building blocks for the board, keyboard, modals, and stats
  constants/          Theme tokens and word lists
  hooks/              Theme and platform helpers
  lib/                Wordle rules and persistence helpers
  providers/          Theme preference context
  types/              Shared game types
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the Expo dev server:

```bash
npm run start
```

3. Launch your preferred target:

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

- `npm run start` starts Expo.
- `npm run android` opens the Android target.
- `npm run ios` opens the iOS target.
- `npm run web` runs the web build locally.
- `npm run lint` runs Expo linting.
- `npm run build:web` exports the static web app to `dist/`.
- `npm run build:web:pages` exports the app with the GitHub Pages base path.
- `npm run reset-project` restores the base Expo starter layout.

## GitHub Pages Hosting

This repo is set up to deploy to GitHub Pages with GitHub Actions.

1. Push the repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to the `main` branch, or run the `Deploy GitHub Pages` workflow manually.

For this repository name, the site is exported with the `/Infinite-Wordle/` base path so assets and routes work correctly on Pages project URLs.

## Gameplay Notes

- Guesses are sanitized to five alphabetic characters.
- Hard mode requires confirmed letters and locked positions to be reused correctly.
- Finished rounds show an inline replay action and a result modal.
- Stats update only when a round is won or lost.

## Data Storage

The app stores its local state under the AsyncStorage key `infinite-wordle-state-v1`.

## Word List

The game now uses a significantly expanded five-letter word list in [src/constants/word-list.ts](/home/dj/Projects/Infinite-Wordle/src/constants/word-list.ts), which improves both answer variety and guess validation coverage.
