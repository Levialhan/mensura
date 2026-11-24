import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

export default function MirrorScreen() {
  const insets = useSafeAreaInsets();
  const goHome = useAppStore((s) => s.goHome);
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScreenHeader title="Mirror" onBack={goHome} dark />
      {!permission ? (
        <View style={styles.center} />
      ) : !permission.granted ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="mirror" size={48} color={colors.instrumentMuted} />
          <Text style={styles.muted}>Camera permission is needed for the mirror.</Text>
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Allow camera</Text>
          </Pressable>
        </View>
      ) : (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.instrumentBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  muted: { color: colors.instrumentMuted, fontSize: font.sm, textAlign: 'center' },
  btn: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primary },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.sm },
});
