import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LightSensor } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, spacing } from '../theme';

export default function LightMeterScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [lux, setLux] = useState<number | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const ok = await LightSensor.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;
      LightSensor.setUpdateInterval(200);
      sub = LightSensor.addListener(({ illuminance }) => setLux(illuminance));
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const level = lux == null ? 0 : Math.min(1, Math.max(0, Math.log10(Math.max(1, lux)) / 5));
  const label =
    lux == null
      ? '—'
      : lux < 10
        ? 'Dark'
        : lux < 100
          ? 'Dim'
          : lux < 1000
            ? 'Indoor'
            : lux < 10000
              ? 'Bright'
              : 'Very bright';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Light Meter" onBack={goHome} dark />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!available ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="white-balance-sunny" size={48} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Light sensor is not available on this device.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.lux}>{lux == null ? '—' : Math.round(lux)}</Text>
            <Text style={styles.unit}>lux</Text>
            <Text style={styles.qualitative}>{label}</Text>
            <View style={styles.meter}>
              <View style={[styles.meterFill, { width: `${level * 100}%` }]} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.instrumentBg },
  body: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  center: { alignItems: 'center', gap: spacing.md },
  muted: { color: colors.instrumentMuted, fontSize: font.sm, textAlign: 'center' },
  lux: { color: colors.instrumentText, fontSize: 88, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  unit: { color: colors.instrumentMuted, fontSize: font.sm, textTransform: 'uppercase', letterSpacing: 2 },
  qualitative: { color: colors.instrumentAccent, fontSize: font.lg, fontWeight: '700', marginTop: spacing.md },
  meter: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.instrumentPanel,
    overflow: 'hidden',
    marginTop: spacing.xxl,
  },
  meterFill: { height: '100%', backgroundColor: colors.instrumentAccent },
});
