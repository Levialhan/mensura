import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

const num = (s: string) => parseFloat(s.replace(',', '.'));

export default function PercentageScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const [val, setVal] = useState('');
  const [pct, setPct] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const pctOf = num(val) && num(pct) != null ? (num(val) * num(pct)) / 100 : null;
  const change = num(from) && num(to) != null && num(from) !== 0 ? ((num(to) - num(from)) / Math.abs(num(from))) * 100 : null;
  const sale = num(price) && num(discount) != null ? num(price) * (1 - num(discount) / 100) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Percentage" onBack={goHome} />
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>What is X% of Y?</Text>
          <View style={styles.row}>
            <TextInput value={pct} onChangeText={setPct} placeholder="%" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
            <Text style={styles.sep}>of</Text>
            <TextInput value={val} onChangeText={setVal} placeholder="value" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
          </View>
          {pctOf != null && <Text style={styles.result}>{pctOf.toLocaleString(undefined, { maximumFractionDigits: 4 })}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Percentage change</Text>
          <View style={styles.row}>
            <TextInput value={from} onChangeText={setFrom} placeholder="from" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
            <Text style={styles.sep}>→</Text>
            <TextInput value={to} onChangeText={setTo} placeholder="to" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
          </View>
          {change != null && <Text style={styles.result}>{change.toFixed(2)}%</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Sale price</Text>
          <View style={styles.row}>
            <TextInput value={price} onChangeText={setPrice} placeholder="price" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
            <Text style={styles.sep}>−</Text>
            <TextInput value={discount} onChangeText={setDiscount} placeholder="%" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" style={styles.input} />
          </View>
          {sale != null && <Text style={styles.result}>{sale.toFixed(2)}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flex: 1, padding: spacing.lg, gap: spacing.lg },
    card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
    label: { fontSize: font.sm, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    input: {
      flex: 1,
      height: 44,
      backgroundColor: colors.bg,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      fontSize: font.sm,
      color: colors.text,
    },
    sep: { color: colors.textMuted, fontSize: font.sm },
    result: { fontSize: font.xl, fontWeight: '800', color: colors.primary, marginTop: spacing.md, fontVariant: ['tabular-nums'] },
  });
