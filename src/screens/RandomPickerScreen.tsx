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

const DIE_SIZE = 150;

// ---- Column-major 4x4 matrices (React Native `matrix` transform convention) ----
type Matrix = number[];

const rad = (d: number) => (d * Math.PI) / 180;

function matMul(a: Matrix, b: Matrix): Matrix {
  const r = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let row = 0; row < 4; row++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + row] * b[c * 4 + k];
      r[c * 4 + row] = s;
    }
  }
  return r;
}

const rotateX = (deg: number): Matrix => {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};

const rotateY = (deg: number): Matrix => {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};

const translateZ = (d: number): Matrix => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, d, 1];

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
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [coin, setCoin] = useState<'heads' | 'tails' | null>(null);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Animated values (state so they're stable across renders)
  const [rotation] = useState(() => new Animated.Value(0));
  const [coinAnim] = useState(() => new Animated.Value(0));
  const [diceAnim] = useState(() => new Animated.Value(0));

  const rotationVal = useRef(0);
  const spinning = useRef(false);
  const flipping = useRef(false);
  const rolling = useRef(false);

  // Coin: rotateX so the coin flips top-over-bottom (a real toss).
  const coinRotateX = coinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  const coinLift = coinAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -28, 0] });

  // Dice: tumbling cube.
  const diceRotateX = diceAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });
  const diceRotateY = diceAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });
  const diceRotateZ = diceAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const rollDice = () => {
    if (rolling.current) return;
    rolling.current = true;
    const finalResult = Math.floor(Math.random() * 6) + 1;

    diceAnim.setValue(0);
    Animated.timing(diceAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start(() => {
      rolling.current = false;
      setDiceResult(finalResult);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    });

    // Cycle the result label while it rolls.
    const id = setInterval(() => setDiceResult(Math.floor(Math.random() * 6) + 1), 100);
    setTimeout(() => clearInterval(id), 850);
  };

  const flipCoin = () => {
    if (flipping.current) return;
    flipping.current = true;
    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';

    coinAnim.setValue(0);
    Animated.timing(coinAnim, { toValue: 1, duration: 1100, useNativeDriver: true }).start(() => {
      flipping.current = false;
      setCoin(result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    });

    let side: 'heads' | 'tails' = 'heads';
    const id = setInterval(() => {
      side = side === 'heads' ? 'tails' : 'heads';
      setCoin(side);
    }, 183);
    setTimeout(() => clearInterval(id), 1100);
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
              <View style={styles.cubeScene}>
                <Animated.View
                  style={{
                    width: DIE_SIZE,
                    height: DIE_SIZE,
                    transform: [
                      { perspective: 700 },
                      { rotateX: diceRotateX },
                      { rotateY: diceRotateY },
                      { rotateZ: diceRotateZ },
                    ],
                  }}
                >
                  <Cube />
                </Animated.View>
              </View>
              <Text style={styles.resultLabel}>{diceResult != null ? diceResult : 'Roll the die'}</Text>
              <Pressable style={styles.primaryBtn} onPress={rollDice}>
                <MaterialCommunityIcons name="dice-5" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Roll</Text>
              </Pressable>
            </>
          )}

          {mode === 'coin' && (
            <>
              <Animated.View
                style={{ transform: [{ perspective: 1000 }, { rotateX: coinRotateX }, { translateY: coinLift }] }}
              >
                <Coin face={coin} />
              </Animated.View>
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

function Pips({ value }: { value: number }) {
  return (
    <View style={styles.face}>
      {DIE_GRID[value].map((on, i) => (
        <View key={i} style={styles.pipCell}>
          {on && <View style={styles.pip} />}
        </View>
      ))}
    </View>
  );
}

function Cube() {
  const half = DIE_SIZE / 2;
  const faces: { value: number; matrix: Matrix }[] = [
    { value: 1, matrix: translateZ(half) },
    { value: 6, matrix: matMul(rotateY(180), translateZ(half)) },
    { value: 3, matrix: matMul(rotateY(90), translateZ(half)) },
    { value: 4, matrix: matMul(rotateY(-90), translateZ(half)) },
    { value: 5, matrix: matMul(rotateX(90), translateZ(half)) },
    { value: 2, matrix: matMul(rotateX(-90), translateZ(half)) },
  ];
  return (
    <>
      {faces.map((f) => (
        <View
          key={f.value}
          style={[styles.cubeFace, { width: DIE_SIZE, height: DIE_SIZE, transform: [{ matrix: f.matrix }] }]}
        >
          <Pips value={f.value} />
        </View>
      ))}
    </>
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
  cubeScene: { width: DIE_SIZE, height: DIE_SIZE },
  cubeFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
  },
  face: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  pipCell: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.text,
  },
  resultLabel: { fontSize: font.xl, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
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
