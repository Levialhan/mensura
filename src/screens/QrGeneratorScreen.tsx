import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import ScreenHeader from '../components/ScreenHeader';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function QrGeneratorScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="QR Generator" onBack={goHome} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter text or URL"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <View style={styles.qrCard}>
          {text.trim() ? (
            <QRCode value={text.trim()} size={220} backgroundColor="#FFFFFF" color="#000000" />
          ) : (
            <Text style={styles.hint}>Type something to generate a scannable QR code</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    body: { flexGrow: 1, padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
    input: {
      minHeight: 64,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      fontSize: font.md,
      color: colors.text,
      textAlignVertical: 'top',
    },
    qrCard: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      minHeight: 280,
    },
    hint: { color: colors.textMuted, fontSize: font.sm, textAlign: 'center' },
  });
