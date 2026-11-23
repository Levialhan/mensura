import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Polygon } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

type Mode = 'dice' | 'coin' | 'wheel';

const WHEEL_OPTIONS = ['Yes', 'No', 'Maybe', 'Try again', 'Definitely', 'Ask later', 'Go for it', 'Not sure'];
const WHEEL_COLORS = ['#2563EB', '#0EA5E9', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

const WHEEL = 260;
const CX = WHEEL / 2;
const CY = WHEEL / 2;
const R = WHEEL / 2 - 6;

const polar = (angleDeg: number, radius: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
};

function slicePath(i: number) {
  const a0 = -90 + i * 45;
  const a1 = a0 + 45;
  const p0 = polar(a0, R);
  const p1 = polar(a1, R);
  return `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y} Z`;
}

export default function RandomPickerScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const [mode, setMode] = useState<Mode>('dice');
  const [dice, setDice] = useState(1);
  const [coin, setCoin] = useState<'heads' | 'tails' | null>(null);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const [rotation] = useState(() => new Animated.Value(0));
  const rotationVal = useRef(0);
  const spinning = useRef(false);

  const rollDice = () => {
    setDice(Math.floor(Math.random() * 6) + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const flipCoin = () => {
    setCoin(Math.random() < 0.5 ? 'heads' : 'tails');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const spinWheel = () => {
    if (spinning.current) return;
    spinning.current = true;
    setWheelResult(null);
    const i = Math.floor(Math.random() * WHEEL_OPTIONS.length);
    const targetMod = 337.5 - i * 45;
    const current = ((rotationVal.current % 360) + 360) % 360;
    const delta = ((targetMod - current + 360) % 360) + 5 * 360;
    const target = rotationVal.current + delta;
    rotationVal.current = target;
    Animated.timing(rotation, { toValue: target, duration: 2600, useNativeDriver: true }).start(() => {
      spinning.current = false;
      setWheelResult(WHEEL_OPTIONS[i]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Random" onBack={goHome} />

      <View style={styles.body}>
        <View style={styles.tabs}>
          {(['dice', 'coin', 'wheel'] as Mode[]).map((m) => (
            <Pressable key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => setMode(m)}>
              <MaterialCommunityIcons
                name={m === 'dice' ? 'dice-5' : m === 'coin' ? 'circle-multiple' : 'chart-pie'}
                size={18}
                color={mode === m ? '#FFFFFF' : colors.text}
              />
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === 'dice' ? 'Dice' : m === 'coin' ? 'Coin' : 'Wheel'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stage}>
          {mode === 'dice' && (
            <>
              <Die value={dice} />
              <Pressable style={styles.primaryBtn} onPress={rollDice}>
                <MaterialCommunityIcons name="dice-5" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Roll</Text>
              </Pressable>
            </>
          )}

          {mode === 'coin' && (
            <>
              <Coin face={coin} />
              <Pressable style={styles.primaryBtn} onPress={flipCoin}>
                <MaterialCommunityIcons name="circle-multiple" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Flip</Text>
              </Pressable>
            </>
          )}

          {mode === 'wheel' && (
            <>
              <View style={styles.wheelWrap}>
                <Animated.View style={{ transform: [{ rotate: rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }] }}>
                  <Svg width={WHEEL} height={WHEEL}>
                    {WHEEL_OPTIONS.map((_, i) => (
                      <Path key={i} d={slicePath(i)} fill={WHEEL_COLORS[i]} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Svg>
                </Animated.View>
                <View style={styles.pointer}>
                  <Svg width={24} height={24}>
                    <Polygon points="12,20 4,4 20,4" fill="#FFFFFF" />
                  </Svg>
                </View>
              </View>
              <Text style={styles.wheelResult}>{wheelResult ?? 'Tap to spin'}</Text>
              <Pressable style={styles.primaryBtn} onPress={spinWheel}>
                <MaterialCommunityIcons name="chart-pie" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Spin</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const DIE_GRID: Record<number, boolean[]> = {
  1: [false, false, false, false, true, false, false, false, false],
  2: [true, false, false, false, false, false, false, false, true],
  3: [true, false, false, false, true, false, false, false, true],
  4: [true, false, true, false, false, false, true, false, true],
  5: [true, false, true, false, true, false, true, false, true],
  6: [true, false, true, true, false, true, true, false, true],
};

function Die({ value }: { value: number }) {
  return (
    <View style={styles.die}>
      {DIE_GRID[value].map((on, i) => (
        <View key={i} style={styles.dieCell}>
          {on && <View style={styles.dot} />}
        </View>
      ))}
    </View>
  );
}

function Coin({ face }: { face: 'heads' | 'tails' | null }) {
  return (
    <View style={styles.coin}>
      <Text style={styles.coinText}>{face === null ? '?' : face === 'heads' ? 'H' : 'T'}</Text>
      <Text style={styles.coinLabel}>{face === null ? 'Flip the coin' : face === 'heads' ? 'Heads' : 'Tails'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: spacing.lg, alignItems: 'center' },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.text, fontWeight: '700', fontSize: font.sm },
  tabTextActive: { color: '#FFFFFF' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  die: {
    width: 160,
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
  },
  dieCell: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.text,
  },
  coin: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FBBF24',
    borderWidth: 6,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: { fontSize: 64, fontWeight: '800', color: '#78350F' },
  coinLabel: { color: colors.textMuted, fontSize: font.xs, marginTop: spacing.xs },
  wheelWrap: { width: WHEEL, height: WHEEL, alignItems: 'center', justifyContent: 'center' },
  pointer: { position: 'absolute', top: -14 },
  wheelResult: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.md },
});
