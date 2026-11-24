import * as Haptics from 'expo-haptics';

// Haptics.impactAsync is unavailable on Android in some Expo Go builds (it
// throws "not available"). The vibrator-backed notificationAsync and
// selectionAsync work everywhere, so we route through those.

/** A clear "success" buzz (double pulse) — for level-reached, dice/coin landed, etc. */
export function successHaptic(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
    Haptics.selectionAsync().catch(() => {});
  });
}

/** A light tap tick — for button presses and counters. */
export function tapHaptic(): void {
  Haptics.selectionAsync().catch(() => {});
}
