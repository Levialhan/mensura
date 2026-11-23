import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

type Unit = 'kmh' | 'mph';

export default function SpeedometerScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [speed, setSpeed] = useState(0); // m/s
  const [unit, setUnit] = useState<Unit>('kmh');
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      setPermission(status === 'granted');
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (loc) => setSpeed(loc.coords.speed ?? 0),
      );
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const display = unit === 'kmh' ? speed * 3.6 : speed * 2.23694;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Speedometer"
        onBack={goHome}
        dark
        right={
          <Pressable
            style={styles.unitBtn}
            onPress={() => setUnit((u) => (u === 'kmh' ? 'mph' : 'kmh'))}
          >
            <Text style={styles.unitBtnText}>{unit === 'kmh' ? 'km/h' : 'mph'}</Text>
          </Pressable>
        }
      />

      <View style={styles.body}>
        {permission === false ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="map-marker-off" size={48} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Location permission is needed for speed.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.speed}>{Math.round(display)}</Text>
            <Text style={styles.label}>{unit === 'kmh' ? 'km/h' : 'mph'}</Text>
            <Text style={styles.hint}>Start moving to see your speed</Text>
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
  unitBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.instrumentPanel,
  },
  unitBtnText: { color: colors.instrumentText, fontWeight: '700', fontSize: font.xs },
  speed: { color: colors.instrumentText, fontSize: 120, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -4 },
  label: { color: colors.instrumentAccent, fontSize: font.lg, fontWeight: '700', letterSpacing: 2 },
  hint: { color: colors.instrumentMuted, fontSize: font.xs, marginTop: spacing.md },
});
