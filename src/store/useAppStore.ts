import { create } from 'zustand';

/**
 * Root navigation + entitlement state for Mensura.
 *
 * This app is intentionally flat (a home grid of tools that drill into a
 * single screen), so a single `screen` field is enough — no navigation
 * library required. Keeping navigation here (rather than in component
 * `useState`) means overlays like the paywall can be shown from anywhere.
 */

export type Screen =
  | 'home'
  | 'level'
  | 'compass'
  | 'converter'
  | 'tip'
  | 'stopwatch'
  | 'ruler'
  | 'protractor'
  | 'flashlight'
  | 'qr'
  | 'altimeter'
  | 'pro';

interface AppState {
  screen: Screen;
  /** True once Pro is unlocked. Backed by a store flag for now. */
  isPro: boolean;
  navigate: (screen: Screen) => void;
  goHome: () => void;
  unlockPro: () => void;
  restorePro: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  isPro: false,

  navigate: (screen) => set({ screen }),
  goHome: () => set({ screen: 'home' }),

  // NOTE: Entitlement hooks. Today these are local-only so the paywall can be
  // wired end-to-end. When billing is added, point `unlockPro`/`restorePro`
  // at RevenueCat (react-native-purchases) and persist `isPro` to storage.
  unlockPro: () => set({ isPro: true, screen: 'home' }),
  restorePro: () => set({ isPro: true }),
}));
