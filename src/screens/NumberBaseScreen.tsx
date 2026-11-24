import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

const BASES = [
  { id: 16, label: 'Hex' },
  { id: 10, label: 'Dec' },
  { id: 8, label: 'Oct' },
  { id: 2, label: 'Bin' },
] as const;

const BASE_FILTER: Record<number, RegExp> = {
  16: /[^0-9a-fA-F]/g,
  10: /[^0-9]/g,
  8: /[^0-7]/g,
  2: /[^01]/g,
};

const toBase = (n: number, b: number) => n.toString(b).toUpperCase();

export default function NumberBaseScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const [input, setInput] = useState('');
  const [base, setBase] = useState<number>(10);

  const selectBase = (b: number) => {
    setBase(b);
    setInput((prev) => prev.replace(BASE_FILTER[b], ''));
  };

  const trimmed = input.trim();
  const value = trimmed ? parseInt(trimmed, base) : null;
  const valid = value != null && !isNaN(value);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Number Base" onBack={goHome} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.segment}>
          {BASES.map((b) => (
            <Pressable key={b.id} style={[styles.segmentBtn, base === b.id && styles.segmentActive]} onPress={() => selectBase(b.id)}>
              <Text style={[styles.segmentText, base === b.id && styles.segmentActiveText]}>{b.label}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          value={input}
          onChangeText={(text) => setInput(text.replace(BASE_FILTER[base], ''))}
          placeholder={base === 16 ? 'e.g. FF' : base === 2 ? 'e.g. 1010' : 'Number'}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        {valid && value != null ? (
          <View style={styles.results}>
            <Row label="Hex" value={toBase(value, 16)} styles={styles} />
            <Row label="Dec" value={toBase(value, 10)} styles={styles} />
            <Row label="Oct" value={toBase(value, 8)} styles={styles} />
            <Row label="Bin" value={toBase(value, 2)} styles={styles} />
          </View>
        ) : (
          <Text style={styles.hint}>Enter a number to convert</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, styles }: { label: string; value: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flexGrow: 1, padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
    segment: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 4 },
    segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm },
    segmentActive: { backgroundColor: colors.primary },
    segmentText: { color: colors.textMuted, fontWeight: '700', fontSize: font.sm },
    segmentActiveText: { color: '#FFFFFF' },
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
    results: { gap: spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    rowLabel: { color: colors.textMuted, fontWeight: '700', fontSize: font.sm, width: 44 },
    rowValue: { color: colors.text, fontSize: font.md, fontVariant: ['tabular-nums'], flex: 1, textAlign: 'right' },
    hint: { color: colors.textMuted, fontSize: font.sm, textAlign: 'center' },
  });
