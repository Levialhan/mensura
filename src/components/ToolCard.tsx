import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Tool } from '../config/tools';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  tool: Tool;
  isPro: boolean;
  isFavorite: boolean;
  onPress: (tool: Tool) => void;
  onToggleFavorite: (tool: Tool) => void;
};

export default function ToolCard({ tool, isPro, isFavorite, onPress, onToggleFavorite }: Props) {
  const locked = tool.tier === 'pro' && !isPro;
  const iconColor = locked ? colors.pro : colors.primary;
  const iconBg = locked ? colors.proSoft : colors.primarySoft;

  return (
    <Pressable
      onPress={() => onPress(tool)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={tool.name}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={tool.icon} size={24} color={iconColor} />
        </View>
        <Pressable
          onPress={() => onToggleFavorite(tool)}
          hitSlop={10}
          style={styles.starBtn}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? `Unfavorite ${tool.name}` : `Favorite ${tool.name}`}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={isFavorite ? '#F59E0B' : colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={1}>
          {tool.name}
        </Text>
        {locked && (
          <View style={styles.proChip}>
            <MaterialCommunityIcons name="lock" size={10} color={colors.pro} />
            <Text style={styles.proChipText}>PRO</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle} numberOfLines={2}>
        {tool.subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 132,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtn: {
    padding: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: font.md,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  proChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.proSoft,
  },
  proChipText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: colors.pro,
  },
});
