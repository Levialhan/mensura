import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function RandomNumberScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    const a = parseInt(min, 10);
    const b = parseInt(max, 10);
    const lo = isNaN(a) ? 0 : Math.min(a, isNaN(b) ? a : b);
    const hi = isNaN(b) ? (isNaN(a) ? 0 : a) : Math.max(isNaN(a) ? b : a, b);
    setResult(Math.floor(Math.random() * (hi - lo + 1)) + lo);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Random Number" onBack={goHome} />
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Min</Text>
            <TextInput value={min} onChangeText={setMin} keyboardType="number-pad" style={styles.input} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Max</Text>
            <TextInput value={max} onChangeText={setMax} keyboardType="number-pad" style={styles.input} />
          </View>
        </View>
        <Pressable style={styles.btn} onPress={generate}>
          <Text style={styles.btnText}>Generate</Text>
        </Pressable>
        {result != null && <Text style={styles.result}>{result}</Text>}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flex: 1, padding: spacing.lg, gap: spacing.lg },
    row: { flexDirection: 'row', gap: spacing.md },
    field: { flex: 1 },
    label: { fontSize: font.sm, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: spacing.sm },
    input: {
      height: 56,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      fontSize: font.lg,
      color: colors.text,
      fontVariant: ['tabular-nums'],
    },
    btn: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md },
    btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.md },
    result: { fontSize: 72, fontWeight: '800', color: colors.primary, textAlign: 'center', marginTop: spacing.xl, fontVariant: ['tabular-nums'] },
  });
