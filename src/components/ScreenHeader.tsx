import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, font, spacing } from '../theme';

type Props = {
  title: string;
  onBack: () => void;
  right?: ReactNode;
  /** Use the light instrument theme (for dark screens). */
  dark?: boolean;
};

export default function ScreenHeader({ title, onBack, right, dark }: Props) {
  const fg = dark ? colors.instrumentText : colors.text;
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color={fg} />
      </Pressable>
      <Text style={[styles.title, { color: fg }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    flex: 1,
    fontSize: font.lg,
    fontWeight: '700',
  },
  right: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
});
