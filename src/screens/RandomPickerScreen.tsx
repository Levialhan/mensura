import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

type Mode = 'dice' | 'coin' | 'wheel';

const WHEEL_OPTIONS = ['Yes', 'No', 'Maybe', 'Try again', 'Definitely', 'Ask later', 'Go for it', 'Not sure'];
const WHEEL_COLORS = ['#2563EB', '#0EA5E9', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

const WHEEL = 260;
const WX = WHEEL / 2;
const WY = WHEEL / 2;
const WR = WHEEL / 2 - 6;

// ---- Isometric die cube ----
const DIE_VIEW = 200;
const DX = 100;
const DY = 82;
const DS = 64;

const dieTop = { x: DX, y: DY - DS };
const dieRight = { x: DX + 0.866 * DS, y: DY - 0.5 * DS };
const dieLeft = { x: DX - 0.866 * DS, y: DY - 0.5 * DS };
const dieCenter = { x: DX, y: DY };
const dieBottom = { x: DX, y: DY + DS };
const dieBL = { x: DX - 0.866 * DS, y: DY + 0.5 * DS };
const dieBR = { x: DX + 0.866 * DS, y: DY + 0.5 * DS };

const dieP = (p: { x: number; y: number }) => `${p.x},${p.y}`;
const dieTopFace = `${dieP(dieTop)} ${dieP(dieRight)} ${dieP(dieCenter)} ${dieP(dieLeft)}`;
const dieLeftFace = `${dieP(dieLeft)} ${dieP(dieCenter)} ${dieP(dieBottom)} ${dieP(dieBL)}`;
const dieRightFace = `${dieP(dieRight)} ${dieP(dieCenter)} ${dieP(dieBottom)} ${dieP(dieBR)}`;

// Map a unit-square point onto the top face's rhombus.
function dieTopPoint(u: number, v: number) {
  return { x: DX + (u - v) * 0.866 * DS, y: DY - DS + (u + v) * 0.5 * DS };
}

const PIP_PATTERNS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.5], [0.72, 0.5], [0.28, 0.72], [0.72, 0.72]],
};

function DieCube({ value }: { value: number }) {
  return (
    <Svg width={DIE_VIEW} height={DIE_VIEW}>
      <Polygon points={dieTopFace} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={2} />
      <Polygon points={dieLeftFace} fill="#D7E3FC" stroke="#94A3B8" strokeWidth={2} />
      <Polygon points={dieRightFace} fill="#BFD3FA" stroke="#94A3B8" strokeWidth={2} />
      {PIP_PATTERNS[value].map(([u, v], i) => {
        const p = dieTopPoint(u, v);
        return <Circle key={i} cx={p.x} cy={p.y} r={5.5} fill="#0F172A" />;
      })}
    </Svg>
  );
}

const polar = (angleDeg: number, radius: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: WX + radius * Math.cos(a), y: WY + radius * Math.sin(a) };
};

function slicePath(i: number) {
  const a0 = -90 + i * 45;
  const a1 = a0 + 45;
  const p0 = polar(a0, WR);
  const p1 = polar(a1, WR);
  return `M ${WX} ${WY} L ${p0.x} ${p0.y} A ${WR} ${WR} 0 0 1 ${p1.x} ${p1.y} Z`;
}

export default function RandomPickerScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const [mode, setMode] = useState<Mode>('dice');
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [coin, setCoin] = useState<'heads' | 'tails' | null>(null);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const [rotation] = useState(() => new Animated.Value(0));
  const [coinAnim] = useState(() => new Animated.Value(0));
  const [diceAnim] = useState(() => new Animated.Value(0));

  const rotationVal = useRef(0);
  const spinning = useRef(false);
  const flipping = useRef(false);
  const rolling = useRef(false);

  const coinRotateX = coinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  const coinLift = coinAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -28, 0] });

  const diceLift = diceAnim.interpolate({ inputRange: [0, 0.4, 0.6, 1], outputRange: [0, -36, -36, 0] });
  const diceRotate = diceAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '20deg', '-20deg', '10deg', '0deg'],
  });
  const diceScale = diceAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.12, 1] });

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

    const id = setInterval(() => setDiceResult(Math.floor(Math.random() * 6) + 1), 90);
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
              <Animated.View
                style={{ transform: [{ translateY: diceLift }, { rotate: diceRotate }, { scale: diceScale }] }}
              >
                <DieCube value={diceResult ?? 1} />
              </Animated.View>
              <Text style={styles.resultLabel}>{diceResult != null ? `You rolled a ${diceResult}` : 'Roll the die'}</Text>
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
  resultLabel: { fontSize: font.lg, fontWeight: '700', color: colors.text },
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
