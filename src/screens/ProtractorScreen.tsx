import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { font, radius, spacing, type ThemeColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const toRad = (d: number) => (d * Math.PI) / 180;

export default function ProtractorScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const { width } = useWindowDimensions();
  const size = Math.min(width - spacing.xl * 2, 380);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;

  const [angleDeg, setAngleDeg] = useState(0);

  const handleMove = (lx: number, ly: number) => {
    const dx = lx - cx;
    const dy = ly - cy;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    setAngleDeg(deg);
  };

  const rad = toRad(angleDeg);
  const handleX = cx + r * Math.cos(rad);
  const handleY = cy + r * Math.sin(rad);
  const smallAngle = angleDeg <= 180 ? angleDeg : 360 - angleDeg;

  const arcR = r * 0.6;
  const largeArc = rad > Math.PI ? 1 : 0;
  const arcD = `M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 1 ${cx + arcR * Math.cos(rad)} ${cy + arcR * Math.sin(rad)}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Protractor" onBack={goHome} />

      <View style={styles.body}>
        <View
          style={[styles.canvas, { width: size, height: size }]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY)}
          onResponderMove={(e) => handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY)}
        >
          <Svg width={size} height={size}>
            {Array.from({ length: 36 }, (_, i) => {
              const a = toRad(i * 10);
              return (
                <Line
                  key={i}
                  x1={cx + (r - 8) * Math.cos(a)}
                  y1={cy + (r - 8) * Math.sin(a)}
                  x2={cx + r * Math.cos(a)}
                  y2={cy + r * Math.sin(a)}
                  stroke={colors.border}
                  strokeWidth={(i * 10) % 90 === 0 ? 2 : 1}
                />
              );
            })}
            <Line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={colors.text} strokeWidth={2} />
            <Line x1={cx} y1={cy} x2={handleX} y2={handleY} stroke={colors.primary} strokeWidth={2} />
            <Path d={arcD} stroke={colors.primary} strokeWidth={2} fill="none" />
            <Circle cx={cx} cy={cy} r={4} fill={colors.text} />
          </Svg>

          <View style={[styles.handle, { left: handleX - 18, top: handleY - 18 }]}>
            <View style={styles.handleDot} />
          </View>
        </View>

        <Text style={styles.angle}>{smallAngle.toFixed(1)}°</Text>
        <Text style={styles.angleLabel}>Drag anywhere on the circle to measure</Text>

        <Pressable style={styles.resetBtn} onPress={() => setAngleDeg(0)}>
          <MaterialCommunityIcons name="restore" size={16} color={colors.textMuted} />
          <Text style={styles.resetText}>Reset to 0°</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  canvas: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  angle: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  angleLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    color: colors.textMuted,
    fontSize: font.xs,
    fontWeight: '600',
  },
});
