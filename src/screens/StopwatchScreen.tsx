import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

interface Lap {
  id: number;
  total: number;
  split: number;
}

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor(ms / 1000) % 60;
  const t = Math.floor(ms / 100) % 10;
  return `${pad(m)}:${pad(s)}.${t}`;
};

export default function StopwatchScreen() {
  const goHome = useAppStore((s) => s.goHome);

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startRef = useRef(0);
  const accRef = useRef(0);
  const lapCountRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - accRef.current;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 33);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (running) {
      accRef.current = Date.now() - startRef.current;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const lap = () => {
    if (!running) return;
    const total = Date.now() - startRef.current;
    const prev = laps[0]?.total ?? 0;
    const split = total - prev;
    lapCountRef.current += 1;
    setLaps((l) => [{ id: lapCountRef.current, total, split }, ...l]);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    accRef.current = 0;
    lapCountRef.current = 0;
    setLaps([]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Stopwatch" onBack={goHome} />

      <View style={styles.body}>
        <Text style={styles.time}>{fmt(elapsed)}</Text>

        <View style={styles.controls}>
          <ControlButton label="Reset" icon="refresh" onPress={reset} disabled={elapsed === 0 && !running} />
          <ControlButton
            label={running ? 'Stop' : 'Start'}
            icon={running ? 'pause' : 'play'}
            onPress={toggle}
            primary={!running}
          />
          <ControlButton label="Lap" icon="flag-outline" onPress={lap} disabled={!running} />
        </View>

        <FlatList
          data={laps}
          keyExtractor={(item) => String(item.id)}
          style={styles.lapList}
          contentContainerStyle={laps.length === 0 && styles.lapListEmpty}
          ListEmptyComponent={<Text style={styles.empty}>No laps yet — tap Lap while running.</Text>}
          renderItem={({ item }) => (
            <View style={styles.lapRow}>
              <Text style={styles.lapNum}>Lap {item.id}</Text>
              <Text style={styles.lapSplit}>+{fmt(item.split)}</Text>
              <Text style={styles.lapTotal}>{fmt(item.total)}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function ControlButton({
  label,
  icon,
  onPress,
  disabled,
  primary,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.ctrl,
        primary && styles.ctrlPrimary,
        disabled && styles.ctrlDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={primary ? '#FFFFFF' : colors.text} />
      <Text style={[styles.ctrlText, primary && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  time: {
    fontSize: font.hero,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.xxl,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  ctrl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctrlPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ctrlDisabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
  ctrlText: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.text,
  },
  lapList: {
    flex: 1,
  },
  lapListEmpty: {
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: font.sm,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lapNum: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
    fontSize: font.sm,
  },
  lapSplit: {
    color: colors.textMuted,
    fontSize: font.sm,
    marginRight: spacing.lg,
    fontVariant: ['tabular-nums'],
  },
  lapTotal: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: font.sm,
    fontVariant: ['tabular-nums'],
  },
});
