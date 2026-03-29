# Google Play Release Guide

This checklist is tailored to the current `Infinite Wordle` app in this repository.

## Before You Upload

- Confirm the support email in `src/constants/app-info.ts` is the one you want to publish.
- Replace the placeholder privacy policy URL in `src/constants/app-info.ts`.
- Replace the placeholder developer name in `src/constants/app-info.ts` if your store listing uses a personal or business name.
- Publish that privacy policy at a public HTTPS URL.
- Verify the Google Play developer account contact email matches the policy and store listing.
- Capture Android phone screenshots from a release build.
- Prepare a 1024 x 500 feature graphic for the Play listing.

## Suggested Store Listing

### App Name

`Infinite Wordle`

### Short Description

`Play endless five-letter word puzzles with local stats and hard mode.`

### Full Description

`Infinite Wordle is a fast, replayable word game built for players who want more than one puzzle per day.

Guess the hidden five-letter word in six tries. After every guess, tile colors show which letters are correct, present, or absent. When you finish a round, a fresh puzzle is ready right away.

Features:
- Endless puzzles with a large five-letter word list
- Standard mode and hard mode
- Local stat tracking for wins, streaks, and guess distribution
- Saved progress between sessions
- Clean portrait layout designed for quick play
- Offline-friendly gameplay with no account required

Infinite Wordle stores your current game, stats, and theme preference on your device so your progress can be restored when you come back.

If you enjoy word puzzles, daily guessing games, and quick brain-teaser sessions, Infinite Wordle gives you a simple way to keep playing without waiting for tomorrow's puzzle.`

### Category

`Game`

### Game Category

`Word`

### Contact Details

- Support email: use the real address from `src/constants/app-info.ts`
- Privacy policy: use the real public URL from `src/constants/app-info.ts`
- Developer name: match the name used in your privacy policy and Play listing

## Data Safety Draft

This is a draft based on the current codebase as of March 29, 2026. Re-check before submitting if the app changes.

- Data collected: `No`
- Data shared: `No`
- Account creation: `No`
- Required permissions for personal data: `None`
- App functionality that stores data only on device: current puzzle, stats, theme preference

Reasoning:
- The app currently persists local game state with AsyncStorage.
- The app does not currently include sign-in, analytics, ads, purchases, cloud sync, location, contacts, camera, or microphone access.

## Content Rating Draft

Suggested answers for the current build:

- Violence: `None`
- Fear: `None`
- Sexual content: `None`
- Gambling references: `None`
- Controlled substances: `None`
- User-generated content: `No`
- Online interaction: `No`
- Location sharing: `No`

Expected rating: likely suitable for a general audience.

## Play Console Checklist

1. Create the app in Play Console.
2. Choose `Game` as the app type.
3. Set pricing to `Free` unless you plan to charge for the app.
4. Add the default app language.
5. Add the store listing text from this file.
6. Upload the app icon and feature graphic.
7. Upload at least the required Android phone screenshots.
8. Add the support email.
9. Add the privacy policy URL.
10. Complete App content declarations.
11. Complete the Data safety form using the draft above, adjusted if anything changed.
12. Complete the content rating questionnaire.
13. Confirm ads declaration is `No` if you are not showing ads.
14. Confirm the app is not directed to children unless you intentionally want Families review.
15. Enroll in Play App Signing if prompted.
16. Upload the production AAB.
17. Roll out first to internal or closed testing.
18. Promote to production after testing and review are complete.

## New Personal Account Requirement

If your Google Play personal developer account was created after November 13, 2023, Google currently requires a closed test before production access. As of March 29, 2026, that generally means:

- At least 12 opted-in testers
- Continuous testing for 14 days

Check your Play Console account notices before planning the launch timeline.

## Build And Submit Commands

### Install Dependencies

```bash
npm install
```

### Log In To Expo

```bash
npx eas login
```

### Build A Production Android App Bundle

```bash
npm run build:android:production
```

### Submit The Latest Build To Internal Testing

```bash
npm run submit:android:internal
```

### Submit The Latest Build To Production

```bash
npm run submit:android:production
```

## Pre-Launch Test Checklist

- App launches cleanly from a fresh install
- Keyboard input works on a real Android device
- Haptics behave correctly on Android
- Theme toggle persists after closing the app
- Hard mode toggle works correctly
- Stats update correctly after wins and losses
- Privacy policy modal opens
- About and support modal opens
- Public privacy policy link opens correctly
- Web privacy page at `/privacy` loads correctly
- Support email action opens the mail app correctly
- No placeholder text remains in the UI or listing

## Recommended Release Notes For Version 1.0.0

`Infinite Wordle is now available on Android with endless five-letter puzzles, local stat tracking, hard mode, and saved progress between sessions.`

## Official References

- Target API requirement: https://support.google.com/googleplay/android-developer/answer/11926878
- User data and privacy policy requirements: https://support.google.com/googleplay/android-developer/answer/10144311
- Store listing guidance: https://support.google.com/googleplay/android-developer/answer/13393723
- Testing tracks: https://support.google.com/googleplay/android-developer/answer/9845334
- Expo Android build output: https://docs.expo.dev/build-reference/apk/
