import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

const parseDate = (s: string): Date | null => {
  const d = new Date(s.trim());
  return isNaN(d.getTime()) ? null : d;
};

const fmtDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function DateCalculatorScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [days, setDays] = useState('');

  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  const diff = fromDate && toDate ? Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) : null;

  const plusDays = parseFloat(days);
  const resultDate = fromDate && !isNaN(plusDays) ? new Date(fromDate.getTime() + plusDays * 86400000) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Date Calculator" onBack={goHome} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Days between</Text>
        <View style={styles.row}>
          <TextInput value={from} onChangeText={setFrom} placeholder="Start (YYYY-MM-DD)" placeholderTextColor={colors.textMuted} style={styles.input} />
          <TextInput value={to} onChangeText={setTo} placeholder="End (YYYY-MM-DD)" placeholderTextColor={colors.textMuted} style={styles.input} />
        </View>
        {diff != null && <Text style={styles.result}>{Math.abs(diff)} days</Text>}

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Add / subtract days</Text>
        <View style={styles.row}>
          <TextInput value={from} onChangeText={setFrom} placeholder="Date (YYYY-MM-DD)" placeholderTextColor={colors.textMuted} style={styles.input} />
          <TextInput value={days} onChangeText={setDays} placeholder="± days" placeholderTextColor={colors.textMuted} keyboardType="numbers-and-punctuation" style={styles.input} />
        </View>
        {resultDate && <Text style={styles.result}>{fmtDate(resultDate)}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flexGrow: 1, padding: spacing.lg, paddingBottom: spacing.xl },
    label: { fontSize: font.sm, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.sm },
    input: {
      flex: 1,
      height: 48,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      fontSize: font.sm,
      color: colors.text,
    },
    result: { fontSize: font.xl, fontWeight: '800', color: colors.primary, marginTop: spacing.md, fontVariant: ['tabular-nums'] },
  });
