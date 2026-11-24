import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, ToolId } from '../config/tools';
import type { ThemeMode } from '../hooks/useTheme';

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
  theme: ThemeMode;
  /** Tool ids the user has starred, shown at the top of Home. */
  favorites: ToolId[];
  /** Tool ids the user has hidden. */
  hiddenTools: ToolId[];
  /** Recently opened tools, most-recent first (max 8). */
  recents: ToolId[];
  /** Category display order on Home. */
  categoryOrder: Category[];
  /** Whether the first-run onboarding hint has been dismissed. */
  onboarded: boolean;
  navigate: (screen: Screen) => void;
  goHome: () => void;
  unlockPro: () => void;
  restorePro: () => void;
  toggleTheme: () => void;
  toggleFavorite: (id: ToolId) => void;
  toggleHidden: (id: ToolId) => void;
  recordRecent: (id: ToolId) => void;
  moveCategory: (id: Category, direction: -1 | 1) => void;
  setOnboarded: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  // Pro is unlocked automatically in development (Expo Go / dev builds) so the
  // whole toolkit can be reviewed without the paywall; production stays locked.
  isPro: __DEV__,
  theme: 'light',
  favorites: [],
  hiddenTools: [],
  recents: [],
  categoryOrder: ['measure', 'convert', 'sensors', 'everyday'],
  onboarded: false,

  navigate: (screen) => set({ screen }),
  goHome: () => set({ screen: 'home' }),

  // NOTE: Entitlement hooks. Today these are local-only so the paywall can be
  // wired end-to-end. When billing is added, point `unlockPro`/`restorePro`
  // at RevenueCat (react-native-purchases) and persist `isPro` to storage.
  unlockPro: () => set({ isPro: true, screen: 'home' }),
  restorePro: () => set({ isPro: true }),

  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

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

  moveCategory: (id, direction) =>
    set((s) => {
      const idx = s.categoryOrder.indexOf(id);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= s.categoryOrder.length) return s;
      const order = [...s.categoryOrder];
      [order[idx], order[target]] = [order[target], order[idx]];
      return { categoryOrder: order };
    }),

  setOnboarded: () => set({ onboarded: true }),
}));

const PREF_KEY = 'mensura-preferences';

// Rehydrate saved preferences on startup.
AsyncStorage.getItem(PREF_KEY)
  .then((raw) => {
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const strArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
    useAppStore.setState({
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      favorites: strArr(parsed.favorites) as ToolId[],
      hiddenTools: strArr(parsed.hiddenTools) as ToolId[],
      recents: strArr(parsed.recents) as ToolId[],
      categoryOrder: (strArr(parsed.categoryOrder) as Category[]).length
        ? (strArr(parsed.categoryOrder) as Category[])
        : ['measure', 'convert', 'sensors', 'everyday'],
      onboarded: parsed.onboarded === true,
    });
  })
  .catch(() => {});

// Persist preferences whenever they change.
let prev = JSON.stringify({
  theme: useAppStore.getState().theme,
  favorites: useAppStore.getState().favorites,
  hiddenTools: useAppStore.getState().hiddenTools,
  recents: useAppStore.getState().recents,
  categoryOrder: useAppStore.getState().categoryOrder,
  onboarded: useAppStore.getState().onboarded,
});
useAppStore.subscribe((state) => {
  const next = JSON.stringify({
    theme: state.theme,
    favorites: state.favorites,
    hiddenTools: state.hiddenTools,
    recents: state.recents,
    categoryOrder: state.categoryOrder,
    onboarded: state.onboarded,
  });
  if (next !== prev) {
    prev = next;
    AsyncStorage.setItem(PREF_KEY, next).catch(() => {});
  }
});
