import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

type Mode = 'steady' | 'strobe';

export default function FlashlightScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<Mode>('steady');
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!active || mode !== 'strobe') return;
    const id = setInterval(() => setBlink((v) => !v), 120);
    return () => clearInterval(id);
  }, [active, mode]);

  const torchOn = active && (mode === 'steady' || blink);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Flashlight" onBack={goHome} dark />

      {!permission ? (
        <View style={styles.center} />
      ) : !permission.granted ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="flashlight-off" size={48} color={colors.instrumentMuted} />
          <Text style={styles.muted}>Camera permission is needed to use the torch.</Text>
          <Pressable style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.body}>
          <CameraView style={styles.camera} facing="back" enableTorch={torchOn} />
          <View style={styles.scrim} />

          <Pressable
            style={[styles.torchBtn, active && styles.torchBtnOn]}
            onPress={() => setActive((v) => !v)}
          >
            <MaterialCommunityIcons
              name={active ? 'flashlight' : 'flashlight-off'}
              size={56}
              color={active ? '#0B1220' : '#FFFFFF'}
            />
          </Pressable>
          <Text style={styles.state}>{active ? 'ON' : 'OFF'}</Text>

          <View style={styles.modes}>
            <Pressable
              style={[styles.modeChip, mode === 'steady' && styles.modeChipActive]}
              onPress={() => setMode('steady')}
            >
              <Text style={[styles.modeText, mode === 'steady' && styles.modeTextActive]}>Steady</Text>
            </Pressable>
            <Pressable
              style={[styles.modeChip, mode === 'strobe' && styles.modeChipActive]}
              onPress={() => setMode('strobe')}
            >
              <Text style={[styles.modeText, mode === 'strobe' && styles.modeTextActive]}>Strobe</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.instrumentBg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  muted: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
    textAlign: 'center',
  },
  primaryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: font.sm,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,18,32,0.72)',
  },
  torchBtn: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.instrumentPanel,
    borderWidth: 2,
    borderColor: colors.instrumentMuted,
  },
  torchBtnOn: {
    backgroundColor: '#FDE68A',
    borderColor: '#FDE68A',
  },
  state: {
    color: colors.instrumentText,
    fontSize: font.lg,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  modes: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  modeChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.instrumentPanel,
    borderWidth: 1,
    borderColor: colors.instrumentMuted,
  },
  modeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeText: {
    color: colors.instrumentMuted,
    fontSize: font.sm,
    fontWeight: '700',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
});
