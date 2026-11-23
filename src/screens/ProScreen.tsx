import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

const FEATURES = [
  { icon: 'ruler', text: 'Unlock Ruler, Protractor & Flashlight' },
  { icon: 'qrcode-scan', text: 'QR & barcode scanner' },
  { icon: 'currency-usd', text: 'Advanced converter — currency & favorites' },
  { icon: 'file-export-outline', text: 'Save & export measurement history' },
  { icon: 'block-helper', text: 'Remove ads — forever' },
  { icon: 'palette-outline', text: 'Custom themes & accent colors' },
] as const;

export default function ProScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const unlockPro = useAppStore((s) => s.unlockPro);
  const restorePro = useAppStore((s) => s.restorePro);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient colors={['#1E2A47', '#0B1220']} style={styles.hero}>
        <Pressable onPress={goHome} hitSlop={12} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </Pressable>

        <View style={styles.crownWrap}>
          <MaterialCommunityIcons name="crown" size={36} color="#F5C542" />
        </View>
        <Text style={styles.heroTitle}>Mensura Pro</Text>
        <Text style={styles.heroSubtitle}>The complete pocket toolkit. One purchase, yours forever.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeContent}>
          <Text style={styles.sectionTitle}>Everything in Pro</Text>

          <View style={styles.featureList}>
            {FEATURES.map((f) => (
              <View key={f.text} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons name={f.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
                <MaterialCommunityIcons name="check" size={18} color={colors.success} />
              </View>
            ))}
          </View>

          <Pressable
            onPress={unlockPro}
            style={({ pressed }) => [styles.unlock, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="crown" size={20} color="#0B1220" />
            <Text style={styles.unlockText}>Unlock Pro — $4.99</Text>
          </Pressable>

          <Pressable onPress={restorePro} style={styles.restore} accessibilityRole="button">
            <Text style={styles.restoreText}>Restore purchases</Text>
          </Pressable>

          <Text style={styles.note}>
            One-time purchase. No subscription, no account, no tracking.
          </Text>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: spacing.xxl,
    right: spacing.lg,
    zIndex: 1,
  },
  crownWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(245,197,66,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: font.xxl,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#AEB9CF',
    fontSize: font.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  content: {
    flexGrow: 1,
  },
  safeContent: {
    flex: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: font.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  featureList: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    color: colors.text,
    fontSize: font.sm,
    fontWeight: '500',
  },
  unlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#F5C542',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  unlockText: {
    color: '#0B1220',
    fontSize: font.md,
    fontWeight: '800',
  },
  restore: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  restoreText: {
    color: colors.primary,
    fontSize: font.sm,
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: font.xs,
    marginTop: spacing.md,
  },
});
