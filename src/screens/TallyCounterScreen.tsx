import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function TallyCounterScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [count, setCount] = useState(0);
  const lastTap = useRef(0);

  const increment = () => {
    setCount((c) => c + 1);
    const now = Date.now();
    if (now - lastTap.current > 60) {
      lastTap.current = now;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Tally Counter" onBack={goHome} />
      <View style={styles.body}>
        <Text style={styles.count}>{count}</Text>
        <Pressable style={({ pressed }) => [styles.tapZone, pressed && styles.tapZonePressed]} onPress={increment}>
          <MaterialCommunityIcons name="plus" size={64} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.reset} onPress={() => setCount(0)}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.xl },
    count: { fontSize: 96, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'], letterSpacing: -2 },
    tapZone: { width: 180, height: 180, borderRadius: 90, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    tapZonePressed: { opacity: 0.8 },
    reset: { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
    resetText: { color: colors.textMuted, fontWeight: '700', fontSize: font.sm },
  });
