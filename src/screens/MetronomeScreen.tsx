import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function MetronomeScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const player = useAudioPlayer(require('../../assets/click.wav'));
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const tapTimes = useRef<number[]>([]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      player.seekTo(0);
      player.play();
    }, 60000 / bpm);
    return () => clearInterval(id);
  }, [playing, bpm, player]);

  const adjust = (delta: number) => setBpm((b) => Math.min(300, Math.max(20, b + delta)));

  const tapTempo = () => {
    const now = Date.now();
    tapTimes.current = [...tapTimes.current, now].slice(-5);
    if (tapTimes.current.length >= 2) {
      const span = tapTimes.current[tapTimes.current.length - 1] - tapTimes.current[0];
      const count = tapTimes.current.length - 1;
      const avg = span / count;
      if (avg > 0) setBpm(Math.round(Math.min(300, Math.max(20, 60000 / avg))));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Metronome" onBack={goHome} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.bpm}>{bpm}</Text>
        <Text style={styles.unit}>BPM</Text>

        <View style={styles.controls}>
          <Pressable style={styles.step} onPress={() => adjust(-1)}>
            <MaterialCommunityIcons name="minus" size={28} color={colors.text} />
          </Pressable>
          <Pressable style={styles.play} onPress={() => setPlaying((p) => !p)}>
            <MaterialCommunityIcons name={playing ? 'stop' : 'play'} size={40} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.step} onPress={() => adjust(1)}>
            <MaterialCommunityIcons name="plus" size={28} color={colors.text} />
          </Pressable>
        </View>

        <Pressable style={styles.tap} onPress={tapTempo}>
          <Text style={styles.tapText}>Tap tempo</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
    bpm: { fontSize: 96, fontWeight: '800', color: colors.primary, fontVariant: ['tabular-nums'], letterSpacing: -2 },
    unit: { color: colors.textMuted, fontSize: font.sm, textTransform: 'uppercase', letterSpacing: 2, marginBottom: spacing.xl },
    controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
    step: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    play: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    tap: { marginTop: spacing.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
    tapText: { color: colors.textMuted, fontWeight: '700', fontSize: font.sm },
  });
