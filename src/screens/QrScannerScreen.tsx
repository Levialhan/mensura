import { useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

export default function QrScannerScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<{ data: string; type: string } | null>(null);

  const onScanned = (r: BarcodeScanningResult) => {
    if (result) return;
    setResult({ data: r.data, type: r.type });
  };

  const reset = () => setResult(null);
  const openUrl = () => {
    if (result) Linking.openURL(result.data).catch(() => {});
  };
  const share = () => {
    if (result) Share.share({ message: result.data });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="QR Scanner" onBack={goHome} dark />

      {!permission ? (
        <View style={styles.center} />
      ) : !permission.granted ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.instrumentMuted} />
          <Text style={styles.muted}>Camera permission is needed to scan codes.</Text>
          <Pressable style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.body}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />

          {!result && (
            <View style={styles.frameWrap}>
              <View style={styles.frame} />
              <Text style={styles.hint}>Point at a QR code</Text>
            </View>
          )}

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultType}>{result.type.toUpperCase()}</Text>
              <Text style={styles.resultData} numberOfLines={4}>
                {result.data}
              </Text>
              <View style={styles.actions}>
                <ActionBtn icon="open-in-new" label="Open" onPress={openUrl} />
                <ActionBtn icon="share-variant" label="Share" onPress={share} />
                <ActionBtn icon="qrcode-scan" label="Again" onPress={reset} />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
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
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  frameWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: colors.instrumentAccent,
    borderRadius: radius.lg,
  },
  hint: {
    color: colors.instrumentText,
    fontSize: font.sm,
    marginTop: spacing.lg,
  },
  resultCard: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxl,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  resultType: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultData: {
    fontSize: font.md,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  actionText: {
    color: colors.primary,
    fontSize: font.xs,
    fontWeight: '700',
  },
});
