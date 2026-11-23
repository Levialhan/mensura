import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { CATEGORIES, convert, formatNumber, type Unit } from '../tools/units';
import { colors, font, radius, spacing } from '../theme';

export default function UnitConverterScreen() {
  const goHome = useAppStore((s) => s.goHome);

  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [value, setValue] = useState('1');
  const [fromId, setFromId] = useState(CATEGORIES[0].units[0].id);
  const [toId, setToId] = useState(CATEGORIES[0].units[1].id);

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const fromUnit = category.units.find((u) => u.id === fromId) ?? category.units[0];
  const toUnit = category.units.find((u) => u.id === toId) ?? category.units[1];

  const result = useMemo(() => {
    const parsed = parseFloat(value.replace(',', '.'));
    if (!Number.isFinite(parsed)) return '';
    return formatNumber(convert(parsed, fromUnit, toUnit));
  }, [value, fromUnit, toUnit]);

  const selectCategory = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat) return;
    setCategoryId(id);
    setFromId(cat.units[0].id);
    setToId(cat.units[1].id);
  };

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Converter" onBack={goHome} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map((c) => {
            const active = c.id === categoryId;
            return (
              <Pressable
                key={c.id}
                onPress={() => selectCategory(c.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* From */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>From</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            style={styles.input}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
          <UnitRow units={category.units} selectedId={fromId} onSelect={setFromId} />
        </View>

        {/* Swap */}
        <View style={styles.swapWrap}>
          <Pressable onPress={swap} style={styles.swapBtn} accessibilityRole="button" accessibilityLabel="Swap units">
            <MaterialCommunityIcons name="swap-vertical" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* To */}
        <View style={styles.block}>
          <Text style={styles.blockLabel}>To</Text>
          <Text style={styles.result}>{result || '—'}</Text>
          <Text style={styles.resultUnit}>{toUnit.symbol}</Text>
          <UnitRow units={category.units} selectedId={toId} onSelect={setToId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnitRow({
  units,
  selectedId,
  onSelect,
}: {
  units: Unit[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitRow}>
      {units.map((u) => {
        const active = u.id === selectedId;
        return (
          <Pressable key={u.id} onPress={() => onSelect(u.id)} style={[styles.unitChip, active && styles.unitChipActive]}>
            <Text style={[styles.unitChipText, active && styles.unitChipTextActive]}>{u.symbol}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
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
  },
  catRow: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: font.sm,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  block: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  blockLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  result: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.primary,
    paddingVertical: spacing.sm,
  },
  resultUnit: {
    fontSize: font.sm,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  swapWrap: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitRow: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  unitChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  unitChipText: {
    color: colors.textMuted,
    fontSize: font.sm,
    fontWeight: '600',
  },
  unitChipTextActive: {
    color: colors.primary,
  },
});
