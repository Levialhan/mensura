import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

const LEVEL_THRESHOLD = 0.6; // degrees within which we call it "level"
const BULLSEYE_MAX = 15; // degrees that pin the bubble to the edge
const BULLSEYE_SIZE = 230; // px
const BUBBLE_SIZE = 38; // px

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function LevelScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);

  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [available, setAvailable] = useState(true);
  const [zeroRoll, setZeroRoll] = useState(0);
  const [zeroPitch, setZeroPitch] = useState(0);
  const leveledRef = useRef(false);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const ok = await DeviceMotion.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      DeviceMotion.setUpdateInterval(50);
      sub = DeviceMotion.addListener((d) => {
        const a = d.accelerationIncludingGravity;
        if (!a) return;
        // Roll = left/right tilt, Pitch = front/back tilt, both 0° when flat.
        const r = (Math.atan2(a.x, Math.hypot(a.y, a.z)) * 180) / Math.PI;
        const p = (Math.atan2(a.y, Math.hypot(a.x, a.z)) * 180) / Math.PI;
        setRoll(r);
        setPitch(p);
      });
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const roll0 = roll - zeroRoll;
  const pitch0 = pitch - zeroPitch;
  const leveled = Math.abs(roll0) < LEVEL_THRESHOLD && Math.abs(pitch0) < LEVEL_THRESHOLD;

  useEffect(() => {
    if (leveled && !leveledRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    leveledRef.current = leveled;
  }, [leveled]);

  const travel = BULLSEYE_SIZE / 2 - BUBBLE_SIZE / 2 - 14;
  // Bubble floats toward the higher side. Sign is chosen to read naturally;
  // flip the multiplication below if it feels inverted on a real device.
  const bx = clamp(roll0 / BULLSEYE_MAX, -1, 1) * travel;
  const by = clamp(pitch0 / BULLSEYE_MAX, -1, 1) * travel;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Level" onBack={goHome} dark />

      {!available ? (
        <View style={styles.unavailable}>
          <MaterialCommunityIcons name="motion-sensor-off" size={40} color={colors.instrumentMuted} />
          <Text style={styles.unavailableText}>Motion sensor is not available on this device.</Text>
        </View>
      ) : (
        <View style={styles.body}>
          {/* Bullseye */}
          <View style={styles.bullseye}>
            <View style={styles.ringOuter} />
            <View style={styles.ringInner} />
            <View style={styles.crossH} />
            <View style={styles.crossV} />
            <View style={styles.centerDot} />
            <View style={styles.bubbleWrap}>
              <View style={[styles.bubble, { marginLeft: bx, marginTop: by }]} />
            </View>
          </View>

          {/* Status pill */}
          <View style={[styles.pill, leveled && styles.pillLevel]}>
            <MaterialCommunityIcons
              name={leveled ? 'check-circle' : 'circle-slice-8'}
              size={16}
              color={leveled ? colors.instrumentAccent : colors.instrumentMuted}
            />
            <Text style={[styles.pillText, leveled && { color: colors.instrumentAccent }]}>
              {leveled ? 'LEVEL' : `${Math.max(Math.abs(roll0), Math.abs(pitch0)).toFixed(1)}°`}
            </Text>
          </View>

          {/* Readouts */}
          <View style={styles.readouts}>
            <Readout label="Left · Right" value={roll0} />
            <Readout label="Front · Back" value={pitch0} />
          </View>

          {/* Calibration */}
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={() => { setZeroRoll(roll); setZeroPitch(pitch); }}>
              <MaterialCommunityIcons name="target" size={18} color={colors.instrumentText} />
              <Text style={styles.buttonText}>Zero</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => { setZeroRoll(0); setZeroPitch(0); }}>
              <MaterialCommunityIcons name="restore" size={18} color={colors.instrumentText} />
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function Readout({ label, value }: { label: string; value: number }) {
  const centered = Math.abs(value) < LEVEL_THRESHOLD;
  return (
    <View style={styles.readout}>
      <Text style={styles.readoutLabel}>{label}</Text>
      <Text style={[styles.readoutValue, centered && { color: colors.instrumentAccent }]}>
        {value >= 0 ? '+' : ''}
        {value.toFixed(1)}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.instrumentBg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  unavailableText: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
    textAlign: 'center',
  },
  bullseye: {
    width: BULLSEYE_SIZE,
    height: BULLSEYE_SIZE,
    borderRadius: BULLSEYE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: BULLSEYE_SIZE,
    height: BULLSEYE_SIZE,
    borderRadius: BULLSEYE_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.instrumentMuted,
  },
  ringInner: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.instrumentMuted,
  },
  crossH: {
    position: 'absolute',
    width: 26,
    height: 1,
    backgroundColor: colors.instrumentMuted,
  },
  crossV: {
    position: 'absolute',
    width: 1,
    height: 26,
    backgroundColor: colors.instrumentMuted,
  },
  centerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.instrumentMuted,
  },
  bubbleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BULLSEYE_SIZE,
    height: BULLSEYE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: colors.instrumentAccent,
    shadowColor: colors.instrumentAccent,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.instrumentPanel,
  },
  pillLevel: {
    backgroundColor: 'rgba(52,211,153,0.12)',
  },
  pillText: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  readouts: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  readout: {
    alignItems: 'center',
    gap: 4,
  },
  readoutLabel: {
    color: colors.instrumentMuted,
    fontSize: font.xs,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  readoutValue: {
    color: colors.instrumentText,
    fontSize: font.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.instrumentPanel,
  },
  buttonText: {
    color: colors.instrumentText,
    fontSize: font.sm,
    fontWeight: '600',
  },
});
