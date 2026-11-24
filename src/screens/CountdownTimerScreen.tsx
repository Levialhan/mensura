import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { font, radius, spacing, type ThemeColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const PRESETS = [1, 3, 5, 10];
const pad = (n: number) => String(n).padStart(2, '0');

export default function CountdownTimerScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [remaining, setRemaining] = useState(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const remainingRef = useRef(5 * 60 * 1000);

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remainingRef.current;
    const id = setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      remainingRef.current = left;
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        setRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${pad(m)}:${pad(s)}`;
  };

  const setPreset = (min: number) => {
    setRunning(false);
    const ms = min * 60 * 1000;
    remainingRef.current = ms;
    setRemaining(ms);
  };

  const adjust = (deltaMs: number) => {
    const next = Math.max(0, Math.min(99 * 60 * 1000, remainingRef.current + deltaMs));
    remainingRef.current = next;
    setRemaining(next);
  };

  const done = remaining <= 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Countdown" onBack={goHome} />

      <View style={styles.body}>
        <Text style={[styles.time, done && styles.timeDone]}>{fmt(remaining)}</Text>

        <View style={styles.presets}>
          {PRESETS.map((m) => (
            <Pressable key={m} style={styles.preset} onPress={() => setPreset(m)}>
              <Text style={styles.presetText}>{m}m</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.adjust}>
          <Pressable style={styles.adjustBtn} onPress={() => adjust(-30000)}>
            <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
            <Text style={styles.adjustLabel}>30s</Text>
          </Pressable>
          <Pressable style={styles.adjustBtn} onPress={() => adjust(30000)}>
            <Text style={styles.adjustLabel}>30s</Text>
            <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.ctrl} onPress={() => setPreset(5)}>
            <MaterialCommunityIcons name="refresh" size={22} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.ctrl, styles.ctrlPrimary]}
            onPress={() => {
              if (remaining <= 0) remainingRef.current = 5 * 60 * 1000;
              setRunning((r) => !r);
            }}
          >
            <MaterialCommunityIcons
              name={running ? 'pause' : 'play'}
              size={28}
              color="#FFFFFF"
            />
          </Pressable>
          <Pressable style={styles.ctrl} onPress={() => setPreset(5)}>
            <MaterialCommunityIcons name="stop" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.xl },
  time: {
    fontSize: 88,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  timeDone: { color: colors.success },
  presets: { flexDirection: 'row', gap: spacing.sm },
  preset: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetText: { color: colors.text, fontWeight: '700', fontSize: font.sm },
  adjust: { flexDirection: 'row', gap: spacing.lg },
  adjustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  adjustLabel: { color: colors.primary, fontWeight: '600', fontSize: font.xs },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  ctrl: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctrlPrimary: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
