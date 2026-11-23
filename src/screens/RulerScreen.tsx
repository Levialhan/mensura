import { Fragment, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

const DEFAULT_PX_PER_CM = 37.8; // ~96 dpi on-screen
const CARD_CM = 8.56; // bank card width (85.6 mm)

type Unit = 'cm' | 'in';

interface Tick {
  x: number;
  kind: 'major' | 'medium' | 'minor';
  label?: string;
}

function buildTicks(unit: Unit, pxPerCm: number, width: number): Tick[] {
  const ticks: Tick[] = [];
  if (unit === 'cm') {
    const minor = pxPerCm / 10;
    const count = Math.floor(width / minor) + 1;
    for (let i = 0; i < count; i++) {
      const major = i % 10 === 0;
      const medium = !major && i % 5 === 0;
      ticks.push({
        x: i * minor,
        kind: major ? 'major' : medium ? 'medium' : 'minor',
        label: major ? String(i / 10) : undefined,
      });
    }
  } else {
    const pxPerInch = pxPerCm * 2.54;
    const minor = pxPerInch / 8;
    const count = Math.floor(width / minor) + 1;
    for (let i = 0; i < count; i++) {
      const major = i % 8 === 0;
      const medium = !major && i % 4 === 0;
      ticks.push({
        x: i * minor,
        kind: major ? 'major' : medium ? 'medium' : 'minor',
        label: major ? String(i / 8) : undefined,
      });
    }
  }
  return ticks;
}

export default function RulerScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { width } = useWindowDimensions();
  const [unit, setUnit] = useState<Unit>('cm');
  const [pxPerCm, setPxPerCm] = useState(DEFAULT_PX_PER_CM);
  const [calibrating, setCalibrating] = useState(false);

  const ticks = buildTicks(unit, pxPerCm, width);
  const contentWidth = Math.max(width, (ticks[ticks.length - 1]?.x ?? 0) + spacing.xl);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader
        title="Ruler"
        onBack={goHome}
        right={
          <Pressable onPress={() => setUnit((u) => (u === 'cm' ? 'in' : 'cm'))} style={styles.unitBtn}>
            <Text style={styles.unitBtnText}>{unit === 'cm' ? 'cm' : 'in'}</Text>
          </Pressable>
        }
      />

      <View style={styles.body}>
        <View style={styles.rulerWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: width }}>
            <View style={[styles.ruler, { width: contentWidth }]}>
              {ticks.map((t, i) => (
                <Fragment key={i}>
                  <View
                    style={[
                      styles.tick,
                      {
                        left: t.x,
                        height: t.kind === 'major' ? 44 : t.kind === 'medium' ? 30 : 18,
                        width: t.kind === 'major' ? 2 : 1,
                        backgroundColor: t.kind === 'major' ? colors.text : colors.textMuted,
                      },
                    ]}
                  />
                  {t.label != null && <Text style={[styles.tickLabel, { left: t.x - 18 }]}>{t.label}</Text>}
                </Fragment>
              ))}
            </View>
          </ScrollView>
        </View>

        <Text style={styles.scale}>{pxPerCm.toFixed(1)} px / cm</Text>

        <View style={styles.controls}>
          <Pressable style={styles.zoomBtn} onPress={() => setPxPerCm((v) => Math.max(12, v - 6))}>
            <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
          </Pressable>
          <Pressable style={styles.zoomBtn} onPress={() => setPxPerCm((v) => Math.min(200, v + 6))}>
            <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
          </Pressable>
        </View>

        <Pressable style={styles.calBtn} onPress={() => setCalibrating(true)}>
          <MaterialCommunityIcons name="credit-card-outline" size={18} color={colors.primary} />
          <Text style={styles.calBtnText}>Calibrate with a card</Text>
        </Pressable>
      </View>

      {calibrating && (
        <CalibrateCard
          pxPerCm={pxPerCm}
          onDone={(v) => {
            setPxPerCm(v);
            setCalibrating(false);
          }}
          onCancel={() => setCalibrating(false)}
        />
      )}
    </SafeAreaView>
  );
}

function CalibrateCard({
  pxPerCm,
  onDone,
  onCancel,
}: {
  pxPerCm: number;
  onDone: (pxPerCm: number) => void;
  onCancel: () => void;
}) {
  const [pos, setPosState] = useState(160);
  const posRef = useRef(160);
  const startRef = useRef(160);
  const startPageXRef = useRef(0);
  const stripWRef = useRef(320);

  const setPos = (v: number) => {
    posRef.current = v;
    setPosState(v);
  };

  const mm = (pos / pxPerCm) * 10;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calibrate</Text>
        <Text style={styles.cardHint}>
          Place a bank card (85.6 mm wide) on screen with its left edge on the line, then drag the
          marker to the card&apos;s right edge.
        </Text>

        <View
          style={styles.strip}
          onLayout={(e) => {
            stripWRef.current = e.nativeEvent.layout.width;
          }}
        >
          <View style={styles.anchorLine} />
          <View style={[styles.cardGuide, { width: pxPerCm * CARD_CM }]} />
          <View
            style={[styles.handle, { left: pos - 16 }]}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => {
              startRef.current = posRef.current;
              startPageXRef.current = e.nativeEvent.pageX;
            }}
            onResponderMove={(e) => {
              const dx = e.nativeEvent.pageX - startPageXRef.current;
              const next = Math.min(stripWRef.current - 4, Math.max(4, startRef.current + dx));
              setPos(next);
            }}
          >
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.measure}>{mm.toFixed(1)} mm</Text>

        <View style={styles.cardActions}>
          <Pressable onPress={onCancel} style={styles.cardCancel}>
            <Text style={styles.cardCancelText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={() => onDone(pos / CARD_CM)} style={styles.cardDone}>
            <Text style={styles.cardDoneText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  unitBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  unitBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: font.sm,
    textTransform: 'uppercase',
  },
  rulerWrap: {
    marginTop: spacing.xl,
    height: 90,
    justifyContent: 'flex-end',
  },
  ruler: {
    position: 'relative',
    height: 90,
  },
  tick: {
    position: 'absolute',
    bottom: 0,
  },
  tickLabel: {
    position: 'absolute',
    bottom: 52,
    width: 36,
    textAlign: 'center',
    fontSize: font.xs,
    color: colors.textMuted,
  },
  scale: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: font.xs,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  zoomBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  calBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: font.sm,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,18,32,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: '800',
    color: colors.text,
  },
  cardHint: {
    fontSize: font.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  strip: {
    height: 64,
    marginTop: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  anchorLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.danger,
  },
  cardGuide: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    backgroundColor: 'rgba(52,211,153,0.25)',
    borderRadius: 4,
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 32,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measure: {
    textAlign: 'center',
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    fontVariant: ['tabular-nums'],
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cardCancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCancelText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: font.sm,
  },
  cardDone: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  cardDoneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: font.sm,
  },
});
