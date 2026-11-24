import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Barometer } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

// Standard-atmosphere altitude (m) from a pressure ratio.
const altitudeFromPressure = (p: number, p0: number) =>
  44330 * (1 - Math.pow(p / p0, 1 / 5.255));

export default function AltimeterScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [pressure, setPressure] = useState(0);
  const [available, setAvailable] = useState(true);
  const [refPressure, setRefPressure] = useState<number | null>(null);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const ok = await Barometer.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      Barometer.setUpdateInterval(500);
      sub = Barometer.addListener(({ pressure: p }) => {
        setPressure(p);
        setRefPressure((r) => r ?? p);
      });
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const altitude = refPressure != null ? altitudeFromPressure(pressure, refPressure) : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Altimeter" onBack={goHome} dark />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!available ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="gauge-empty" size={48} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Barometer is not available on this device.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.altitude}>
              {altitude >= 0 ? '+' : ''}
              {altitude.toFixed(1)} m
            </Text>
            <Text style={styles.altitudeLabel}>relative altitude</Text>

            <View style={styles.pressureCard}>
              <Text style={styles.pressure}>{pressure.toFixed(1)}</Text>
              <Text style={styles.pressureLabel}>hPa</Text>
            </View>

            <Pressable style={styles.zeroBtn} onPress={() => setRefPressure(pressure)}>
              <MaterialCommunityIcons name="target" size={18} color={colors.instrumentText} />
              <Text style={styles.zeroText}>Zero at current height</Text>
            </Pressable>

            <Text style={styles.note}>
              Reads relative altitude change — zero it at a known height for best results.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.instrumentBg,
  },
  body: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  muted: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
    textAlign: 'center',
  },
  altitude: {
    color: colors.instrumentText,
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  altitudeLabel: {
    color: colors.instrumentMuted,
    fontSize: font.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  pressureCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.instrumentPanel,
  },
  pressure: {
    color: colors.instrumentText,
    fontSize: font.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  pressureLabel: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
  },
  zeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.instrumentPanel,
  },
  zeroText: {
    color: colors.instrumentText,
    fontSize: font.sm,
    fontWeight: '600',
  },
  note: {
    color: colors.instrumentMuted,
    fontSize: font.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 280,
  },
});
