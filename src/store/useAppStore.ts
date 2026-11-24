import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ToolId } from '../config/tools';

/**
 * Root navigation + entitlement + user-preference state for Mensura.
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
  | 'calculator'
  | 'converter'
  | 'countdown'
  | 'tip'
  | 'stopwatch'
  | 'random'
  | 'ruler'
  | 'protractor'
  | 'magnifier'
  | 'flashlight'
  | 'qr'
  | 'altimeter'
  | 'pedometer'
  | 'speedometer'
  | 'sound'
  | 'settings'
  | 'pro';

interface AppState {
  screen: Screen;
  /** True once Pro is unlocked. Backed by a store flag for now. */
  isPro: boolean;
  /** Tool ids the user has starred, shown at the top of Home. */
  favorites: ToolId[];
  /** Tool ids the user has hidden. */
  hiddenTools: ToolId[];
  /** Recently opened tools, most-recent first (max 8). */
  recents: ToolId[];
  navigate: (screen: Screen) => void;
  goHome: () => void;
  unlockPro: () => void;
  restorePro: () => void;
  toggleFavorite: (id: ToolId) => void;
  toggleHidden: (id: ToolId) => void;
  recordRecent: (id: ToolId) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  // Pro is unlocked automatically in development (Expo Go / dev builds) so the
  // whole toolkit can be reviewed without the paywall; production stays locked.
  isPro: __DEV__,
  favorites: [],
  hiddenTools: [],
  recents: [],

  navigate: (screen) => set({ screen }),
  goHome: () => set({ screen: 'home' }),

  // NOTE: Entitlement hooks. Today these are local-only so the paywall can be
  // wired end-to-end. When billing is added, point `unlockPro`/`restorePro`
  // at RevenueCat (react-native-purchases) and persist `isPro` to storage.
  unlockPro: () => set({ isPro: true, screen: 'home' }),
  restorePro: () => set({ isPro: true }),

  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((x) => x !== id)
        : [...s.favorites, id],
    })),

  toggleHidden: (id) =>
    set((s) => ({
      hiddenTools: s.hiddenTools.includes(id)
        ? s.hiddenTools.filter((x) => x !== id)
        : [...s.hiddenTools, id],
    })),

  recordRecent: (id) =>
    set((s) => ({ recents: [id, ...s.recents.filter((x) => x !== id)].slice(0, 8) })),
}));

const PREF_KEY = 'mensura-preferences';

// Rehydrate saved preferences (favorites, hidden tools, recents) on startup.
AsyncStorage.getItem(PREF_KEY)
  .then((raw) => {
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      favorites?: unknown;
      hiddenTools?: unknown;
      recents?: unknown;
    };
    useAppStore.setState({
      favorites: Array.isArray(parsed.favorites) ? (parsed.favorites as ToolId[]) : [],
      hiddenTools: Array.isArray(parsed.hiddenTools) ? (parsed.hiddenTools as ToolId[]) : [],
      recents: Array.isArray(parsed.recents) ? (parsed.recents as ToolId[]) : [],
    });
  })
  .catch(() => {});

// Persist preferences whenever they change.
let prevFavorites = useAppStore.getState().favorites;
let prevHidden = useAppStore.getState().hiddenTools;
let prevRecents = useAppStore.getState().recents;
useAppStore.subscribe((state) => {
  if (
    state.favorites !== prevFavorites ||
    state.hiddenTools !== prevHidden ||
    state.recents !== prevRecents
  ) {
    prevFavorites = state.favorites;
    prevHidden = state.hiddenTools;
    prevRecents = state.recents;
    AsyncStorage.setItem(
      PREF_KEY,
      JSON.stringify({
        favorites: state.favorites,
        hiddenTools: state.hiddenTools,
        recents: state.recents,
      }),
    ).catch(() => {});
  }
});
