import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Tool } from '../config/tools';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  tool: Tool;
  onPress: (tool: Tool) => void;
};

export default function ToolCard({ tool, onPress }: Props) {
  const locked = tool.tier === 'pro';
  const soon = tool.status === 'soon';
  const iconColor = locked ? colors.pro : colors.primary;
  const iconBg = locked ? colors.proSoft : colors.primarySoft;

  return (
    <Pressable
      onPress={() => onPress(tool)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={tool.name}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={tool.icon} size={26} color={iconColor} />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {tool.name}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {tool.subtitle}
      </Text>

      {locked && (
        <View style={[styles.badge, styles.badgePro]}>
          <MaterialCommunityIcons name="lock" size={11} color={colors.pro} />
          <Text style={[styles.badgeText, { color: colors.pro }]}>PRO</Text>
        </View>
      )}
      {!locked && soon && (
        <View style={[styles.badge, styles.badgeSoon]}>
          <Text style={styles.badgeText}>SOON</Text>
        </View>
      )}
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
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: font.md,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgePro: {
    backgroundColor: colors.proSoft,
  },
  badgeSoon: {
    backgroundColor: colors.border,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
});
