import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, spacing } from '../theme';

const STEP_M = 0.762; // average stride length

export default function PedometerScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [steps, setSteps] = useState(0);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const ok = await Pedometer.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;
      sub = Pedometer.watchStepCount((r) => setSteps(r.steps));
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const distanceKm = (steps * STEP_M) / 1000;
  const calories = Math.round(steps * 0.04);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Pedometer" onBack={goHome} dark />

      <View style={styles.body}>
        {available === false ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="shoe-print" size={48} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Step counting is not available on this device.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.steps}>{steps}</Text>
            <Text style={styles.label}>steps</Text>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{distanceKm.toFixed(2)} km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{calories} kcal</Text>
                <Text style={styles.statLabel}>Est. calories</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.instrumentBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  center: { alignItems: 'center', gap: spacing.md },
  muted: { color: colors.instrumentMuted, fontSize: font.sm, textAlign: 'center' },
  steps: { color: colors.instrumentText, fontSize: 88, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  label: { color: colors.instrumentMuted, fontSize: font.sm, textTransform: 'uppercase', letterSpacing: 2 },
  stats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xxl },
  stat: { alignItems: 'center', gap: spacing.xs },
  statValue: { color: colors.instrumentAccent, fontSize: font.xl, fontWeight: '700', fontVariant: ['tabular-nums'] },
  statLabel: { color: colors.instrumentMuted, fontSize: font.xs },
});
