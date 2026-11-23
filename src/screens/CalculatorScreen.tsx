import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

type KeyType = 'digit' | 'op' | 'equals' | 'clear' | 'negate' | 'percent' | 'decimal';

const KEYS: { label: string; type: KeyType; wide?: boolean }[] = [
  { label: 'C', type: 'clear' }, { label: '±', type: 'negate' }, { label: '%', type: 'percent' }, { label: '÷', type: 'op' },
  { label: '7', type: 'digit' }, { label: '8', type: 'digit' }, { label: '9', type: 'digit' }, { label: '×', type: 'op' },
  { label: '4', type: 'digit' }, { label: '5', type: 'digit' }, { label: '6', type: 'digit' }, { label: '−', type: 'op' },
  { label: '1', type: 'digit' }, { label: '2', type: 'digit' }, { label: '3', type: 'digit' }, { label: '+', type: 'op' },
  { label: '0', type: 'digit', wide: true }, { label: '.', type: 'decimal' }, { label: '=', type: 'equals' },
];

function compute(a: number, b: number, o: string): number {
  switch (o) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

const fmt = (n: number) => String(parseFloat(n.toPrecision(12)));

export default function CalculatorScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const [display, setDisplay] = useState('0');
  const [accum, setAccum] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const press = (label: string, type: KeyType) => {
    if (type === 'clear') {
      setDisplay('0'); setAccum(null); setOp(null); setFresh(true); return;
    }
    if (type === 'digit') {
      setDisplay((d) => (fresh || d === '0' ? label : d + label));
      setFresh(false); return;
    }
    if (type === 'decimal') {
      setDisplay((d) => (fresh ? '0.' : d.includes('.') ? d : d + '.'));
      setFresh(false); return;
    }
    if (type === 'negate') {
      setDisplay((d) => (d.startsWith('-') ? d.slice(1) : d === '0' ? d : '-' + d));
      return;
    }
    if (type === 'percent') {
      setDisplay((d) => String(parseFloat(d) / 100));
      return;
    }

    const value = parseFloat(display);
    if (type === 'equals') {
      if (op != null && accum != null) {
        const result = compute(accum, value, op);
        setDisplay(Number.isFinite(result) ? fmt(result) : 'Error');
        setAccum(null); setOp(null); setFresh(true);
      }
      return;
    }

    // operator
    if (op != null && accum != null) {
      const result = compute(accum, value, op);
      if (Number.isFinite(result)) {
        setAccum(result);
        setDisplay(fmt(result));
      } else {
        setDisplay('Error'); setAccum(null); setOp(null); setFresh(true); return;
      }
    } else {
      setAccum(value);
    }
    setOp(label);
    setFresh(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Calculator" onBack={goHome} />
      <View style={styles.body}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
        <View style={styles.grid}>
          {KEYS.map((k) => (
            <Pressable
              key={k.label}
              style={[
                styles.key,
                k.wide && styles.keyWide,
                k.type === 'op' && styles.keyOp,
                k.type === 'equals' && styles.keyEquals,
              ]}
              onPress={() => press(k.label, k.type)}
            >
              <Text style={[styles.keyText, (k.type === 'op' || k.type === 'equals') && styles.keyTextAccent]}>
                {k.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: spacing.lg, justifyContent: 'flex-end' },
  display: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    fontVariant: ['tabular-nums'],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  key: {
    width: '25%',
    padding: spacing.xs,
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  keyWide: { width: '50%' },
  keyOp: { backgroundColor: colors.primarySoft },
  keyEquals: { backgroundColor: colors.primary },
  keyText: { fontSize: font.xl, fontWeight: '700', color: colors.text },
  keyTextAccent: { color: colors.primary },
});
