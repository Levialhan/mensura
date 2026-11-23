import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

export default function MagnifierScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);

  const changeZoom = (delta: number) => {
    setZoom((z) => Math.max(0, Math.min(1, Math.round((z + delta) * 100) / 100)));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Magnifier" onBack={goHome} dark />

      {!permission ? (
        <View style={styles.center} />
      ) : !permission.granted ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="magnify-plus" size={48} color={colors.instrumentMuted} />
          <Text style={styles.muted}>Camera permission is needed to magnify.</Text>
          <Pressable style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.body}>
          <CameraView style={styles.camera} facing="back" zoom={zoom} />

          <View style={styles.controls}>
            <Pressable style={styles.ctrl} onPress={() => changeZoom(-0.2)}>
              <MaterialCommunityIcons name="minus" size={24} color="#FFFFFF" />
            </Pressable>
            <View style={styles.zoomBadge}>
              <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
            </View>
            <Pressable style={styles.ctrl} onPress={() => changeZoom(0.2)}>
              <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.hint}>Use + / − to zoom in and read small text</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.instrumentBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  muted: { color: colors.instrumentMuted, fontSize: font.sm, textAlign: 'center' },
  primaryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.sm },
  body: { flex: 1 },
  camera: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  controls: {
    position: 'absolute',
    bottom: spacing.xxl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: 'rgba(11,18,32,0.6)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  ctrl: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.instrumentPanel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBadge: { minWidth: 60, alignItems: 'center' },
  zoomText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.md },
  hint: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    color: colors.instrumentMuted,
    fontSize: font.xs,
  },
});
