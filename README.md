# Mensura

A private, offline **pocket measurement toolkit** for Android & iOS — built with Expo (SDK 58) and React Native. No account, no backend, no tracking; every tool works offline and all readings stay on-device.

## Tools

**Free:** Level · Compass · Calculator · Unit Converter · Countdown · Tip Split · Stopwatch · Random

**Pro (one-time unlock):** Ruler · Protractor · Magnifier · Flashlight · QR Scanner · Altimeter · Pedometer · Speedometer · Sound Meter

## Development

```bash
npm install
npx expo start          # dev server (press `a` for Android)
npx tsc --noEmit        # typecheck
npx eslint .            # lint
npx expo-doctor         # dependency / config health
```

> Note: this repo uses `npm` (no `bun.lock`). `npx expo lint` currently has a version-check bug in this setup — run `npx eslint .` directly.

## Architecture

- **No router.** `src/store/useAppStore.ts` is the single state machine (`screen` + `isPro`). `App.tsx` switches on it.
- **Tool registry** in `src/config/tools.ts` drives the home grid and Pro gating (`tier: free | pro`).
- **Pro paywall** in `src/screens/ProScreen.tsx`; `unlockPro` / `restorePro` are local stubs to wire to RevenueCat later.
- **Screens** live in `src/screens/`; **design tokens** in `src/theme.ts`.
- **Icon/splash** are generated from one SVG by `node scripts/generate-assets.mjs`.

## Building & submitting (EAS)

```bash
npx eas-cli build --platform android --profile production   # AAB for Play Store
npx eas-cli build --platform android --profile preview      # APK for direct install
npx eas-cli submit --platform android                       # upload to Play Console
```

`eas.json` has three profiles: `development` (dev client), `preview` (internal APK), `production` (release AAB).

## Play Store launch checklist

1. ✅ App code complete (10 tools) — typecheck, lint, expo-doctor clean
2. ✅ EAS project linked: `@glacyte/mensura`
3. ✅ Custom icon + splash (`assets/`)
4. ✅ Store listing copy (`store/listing.md`)
5. ✅ Privacy policy (`store/privacy-policy.md` + hostable `store/privacy-policy.html`)
6. ⬜ Build AAB (running) and download from EAS
7. ✅ **Create app** in [Play Console](https://play.google.com/console) with package `com.mensura.toolkit`
8. ⬜ **Host** the privacy policy and paste its URL
9. ⬜ Upload AAB → **Internal testing** track → add testers → roll out
10. ⬜ Complete **store listing** (screenshots, icon, content rating, data-safety form: "no data collected")
11. ⬜ (Optional) Wire **RevenueCat** for real Pro purchases before public release
