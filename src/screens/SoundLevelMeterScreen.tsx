import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

export default function SoundLevelMeterScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const recorder = useAudioRecorder({ ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true });
  const state = useAudioRecorderState(recorder, 100);
  const [active, setActive] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);

  const start = async () => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setPermission(false);
      return;
    }
    setPermission(true);
    await recorder.prepareToRecordAsync();
    recorder.record();
    setActive(true);
  };

  const stop = async () => {
    await recorder.stop();
    setActive(false);
  };

  const db = state.metering ?? 0;
  const level = Math.max(0, Math.min(1, (db + 60) / 60));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Sound Meter" onBack={goHome} dark />

      <View style={styles.body}>
        {permission === false ? (
          <View style={styles.center}>
            <MaterialCommunityIcons name="microphone-off" size={48} color={colors.instrumentMuted} />
            <Text style={styles.muted}>Microphone permission is needed.</Text>
            <Pressable style={styles.primaryBtn} onPress={start}>
              <Text style={styles.primaryBtnText}>Allow microphone</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.db}>{active ? `${Math.round(db)} dB` : '— dB'}</Text>

            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${level * 100}%` }]} />
            </View>

            <Pressable style={[styles.micBtn, active && styles.micBtnActive]} onPress={active ? stop : start}>
              <MaterialCommunityIcons name={active ? 'stop' : 'microphone'} size={40} color="#FFFFFF" />
            </Pressable>

            <Text style={styles.hint}>{active ? 'Listening…' : 'Tap to measure'}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.instrumentBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  center: { alignItems: 'center', gap: spacing.md },
  muted: { color: colors.instrumentMuted, fontSize: font.sm, textAlign: 'center' },
  primaryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.sm },
  db: { color: colors.instrumentText, fontSize: 72, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  meterTrack: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.instrumentPanel,
    overflow: 'hidden',
  },
  meterFill: { height: '100%', backgroundColor: colors.instrumentAccent },
  micBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.instrumentPanel,
    borderWidth: 2,
    borderColor: colors.instrumentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: colors.danger, borderColor: colors.danger },
  hint: { color: colors.instrumentMuted, fontSize: font.xs },
});
