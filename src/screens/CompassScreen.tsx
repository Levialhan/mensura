import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Magnetometer } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, spacing } from '../theme';

const DIAL = 280;
const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export default function CompassScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);

  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const ok = await Magnetometer.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      Magnetometer.setUpdateInterval(100);
      sub = Magnetometer.addListener((d) => {
        let deg = (Math.atan2(d.y, d.x) * 180) / Math.PI;
        if (deg < 0) deg += 360;
        setHeading(deg);
      });
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const cardinal = CARDINALS[Math.round(heading / 45) % 8];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Compass" onBack={goHome} dark />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!available ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="compass-off-outline" size={40} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Compass sensor is not available.</Text>
          </View>
        ) : (
          <>
            <View style={styles.dial}>
              <Text style={[styles.cardinal, styles.cardinalN]}>N</Text>
              <Text style={[styles.cardinal, styles.cardinalE]}>E</Text>
              <Text style={[styles.cardinal, styles.cardinalS]}>S</Text>
              <Text style={[styles.cardinal, styles.cardinalW]}>W</Text>

              <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]}>
                <View style={styles.needleNorth} />
                <View style={styles.needleSouth} />
              </View>
              <View style={styles.pivot} />
            </View>

            <Text style={styles.heading}>{Math.round(heading)}°</Text>
            <Text style={styles.cardinalLabel}>{cardinal}</Text>
            <Text style={styles.hint}>Hold flat for an accurate reading</Text>
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
  },
  dial: {
    width: DIAL,
    height: DIAL,
    borderRadius: DIAL / 2,
    backgroundColor: colors.instrumentPanel,
    borderWidth: 2,
    borderColor: colors.instrumentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinal: {
    position: 'absolute',
    color: colors.instrumentMuted,
    fontSize: font.md,
    fontWeight: '800',
  },
  cardinalN: { top: 12, left: 0, right: 0, textAlign: 'center' },
  cardinalS: { bottom: 12, left: 0, right: 0, textAlign: 'center' },
  cardinalE: { right: 12, top: DIAL / 2 - 11 },
  cardinalW: { left: 12, top: DIAL / 2 - 11 },
  needle: {
    position: 'absolute',
    width: 6,
    height: DIAL - 64,
    borderRadius: 3,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  needleNorth: {
    flex: 1,
    backgroundColor: '#F87171',
  },
  needleSouth: {
    flex: 1,
    backgroundColor: colors.instrumentMuted,
  },
  pivot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.instrumentText,
  },
  heading: {
    color: colors.instrumentText,
    fontSize: 56,
    fontWeight: '800',
    marginTop: spacing.xl,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  cardinalLabel: {
    color: colors.instrumentAccent,
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: 2,
  },
  hint: {
    color: colors.instrumentMuted,
    fontSize: font.xs,
    marginTop: spacing.sm,
  },
});
