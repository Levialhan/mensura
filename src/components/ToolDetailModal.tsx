import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Tool } from '../config/tools';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

type Props = {
  tool: Tool | null;
  isFavorite: boolean;
  isHidden: boolean;
  onClose: () => void;
  onOpen: (tool: Tool) => void;
  onToggleFavorite: (tool: Tool) => void;
  onToggleHidden: (tool: Tool) => void;
};

export default function ToolDetailModal({
  tool,
  isFavorite,
  isHidden,
  onClose,
  onOpen,
  onToggleFavorite,
  onToggleHidden,
}: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal visible={tool != null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {tool && (
            <>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name={tool.icon} size={30} color={colors.primary} />
              </View>
              <Text style={styles.name}>{tool.name}</Text>
              <View style={[styles.tierChip, tool.tier === 'pro' && styles.tierChipPro]}>
                <Text style={[styles.tierText, tool.tier === 'pro' && styles.tierTextPro]}>
                  {tool.tier === 'pro' ? 'PRO' : 'FREE'}
                </Text>
              </View>
              <Text style={styles.description}>{tool.description}</Text>

              <View style={styles.actions}>
                <Pressable style={styles.primaryBtn} onPress={() => { onOpen(tool); onClose(); }}>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Open</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={() => onToggleFavorite(tool)}>
                  <MaterialCommunityIcons
                    name={isFavorite ? 'star-off' : 'star-outline'}
                    size={20}
                    color={isFavorite ? '#F59E0B' : colors.text}
                  />
                </Pressable>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => {
                    onToggleHidden(tool);
                    onClose();
                  }}
                >
                  <MaterialCommunityIcons
                    name={isHidden ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    sheet: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.xl,
      alignItems: 'center',
    },
    iconWrap: {
      width: 60,
      height: 60,
      borderRadius: 18,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    name: { fontSize: font.lg, fontWeight: '800', color: colors.text },
    tierChip: {
      marginTop: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.pill,
      backgroundColor: colors.border,
    },
    tierChipPro: { backgroundColor: colors.proSoft },
    tierText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6, color: colors.textMuted },
    tierTextPro: { color: colors.pro },
    description: {
      fontSize: font.sm,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: spacing.md,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.sm },
    actionBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
