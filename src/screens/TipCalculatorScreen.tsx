import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

const PRESETS = [10, 15, 18, 20, 25];

const money = (n: number) => `$${n.toFixed(2)}`;

export default function TipCalculatorScreen() {
  const goHome = useAppStore((s) => s.goHome);

  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState(1);

  const parsedBill = parseFloat(bill.replace(',', '.')) || 0;
  const tip = (parsedBill * tipPct) / 100;
  const total = parsedBill + tip;
  const perPerson = people > 0 ? total / people : total;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Tip Split" onBack={goHome} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bill */}
        <View style={styles.card}>
          <Text style={styles.label}>Bill amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              value={bill}
              onChangeText={setBill}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
        </View>

        {/* Tip */}
        <View style={styles.card}>
          <Text style={styles.label}>Tip</Text>
          <View style={styles.presetRow}>
            {PRESETS.map((p) => {
              const active = p === tipPct;
              return (
                <Pressable key={p} onPress={() => setTipPct(p)} style={[styles.preset, active && styles.presetActive]}>
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>{p}%</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Custom</Text>
            <Stepper value={tipPct} onChange={setTipPct} min={0} max={100} suffix="%" />
          </View>
        </View>

        {/* People */}
        <View style={styles.card}>
          <Text style={styles.label}>Split between</Text>
          <Stepper value={people} onChange={setPeople} min={1} max={99} suffix="" />
        </View>

        {/* Results */}
        <View style={styles.resultCard}>
          <ResultRow label="Tip" value={money(tip)} />
          <View style={styles.divider} />
          <ResultRow label="Total" value={money(total)} strong />
          {people > 1 && (
            <>
              <View style={styles.divider} />
              <ResultRow label={`Per person (${people})`} value={money(perPerson)} accent />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value - 1))}>
        <MaterialCommunityIcons name="minus" size={18} color={colors.primary} />
      </Pressable>
      <Text style={styles.stepValue}>
        {value}
        {suffix}
      </Text>
      <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value + 1))}>
        <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

function ResultRow({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text
        style={[
          styles.resultValue,
          strong && styles.resultValueStrong,
          accent && { color: colors.primary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  label: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currency: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    flex: 1,
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preset: {
    flexGrow: 1,
    minWidth: 52,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: font.sm,
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  stepperLabel: {
    fontSize: font.sm,
    color: colors.text,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    minWidth: 56,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  resultCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: font.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  resultValueStrong: {
    fontSize: font.xl,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
