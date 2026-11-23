This is an Expo/React Native mobile application (Mensura — a pocket measurement toolkit). Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

This app is on **Expo SDK 58** (React Native 0.88, React 19.3).

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

This app does **not** use Expo Router. There is no `src/app/` directory and `expo-router` is not a dependency.

- `src/store/useAppStore.ts` is the single state machine: the active screen (`home`, `level`, `converter`, `tip`, `stopwatch`, `pro`) and the `isPro` entitlement flag.
- `App.tsx` picks the visible screen with a `switch` on that store, wrapped in `SafeAreaProvider`.
- Screens live in `src/screens/`. Each screen sets its own `StatusBar` style (light on the dark instrument screens, dark elsewhere).
- New navigation state belongs in `useAppStore`, not a component's `useState`.

## Tool registry & Pro gating

- `src/config/tools.ts` is the source of truth for the tool list. Each tool has a `tier` (`free` | `pro`) and `status` (`ready` | `soon`).
- Pro tools render a lock and route to the paywall (`pro` screen). `soon` free tools show a "coming soon" alert.
- Entitlements live on `useAppStore.isPro`. `unlockPro` / `restorePro` are currently local-only stubs — wire them to RevenueCat (`react-native-purchases`) and persist to storage when billing is added.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
