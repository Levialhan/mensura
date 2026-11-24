import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { CATEGORIES, TOOLS, type Category } from '../config/tools';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const goHome = useAppStore((s) => s.goHome);
  const hiddenTools = useAppStore((s) => s.hiddenTools);
  const toggleHidden = useAppStore((s) => s.toggleHidden);
  const categoryOrder = useAppStore((s) => s.categoryOrder);
  const moveCategory = useAppStore((s) => s.moveCategory);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenHeader title="Settings" onBack={goHome} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name={isDark ? 'weather-night' : 'white-balance-sunny'} size={20} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowName}>Dark mode</Text>
              <Text style={styles.rowSub}>Switch between light and dark themes</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => useAppStore.getState().toggleTheme()}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Reorder sections */}
        <Text style={styles.sectionTitle}>Reorder sections</Text>
        <View style={styles.card}>
          {categoryOrder.map((catId: Category, i: number) => {
            const cat = CATEGORIES.find((c) => c.id === catId);
            if (!cat) return null;
            return (
              <View key={catId} style={[styles.row, i > 0 && styles.rowBorder]}>
                <View style={styles.rowIcon}>
                  <MaterialCommunityIcons name={cat.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{cat.label}</Text>
                </View>
                <Pressable
                  onPress={() => moveCategory(catId, -1)}
                  disabled={i === 0}
                  style={[styles.arrowBtn, i === 0 && styles.arrowBtnDisabled]}
                  hitSlop={6}
                >
                  <MaterialCommunityIcons name="chevron-up" size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  onPress={() => moveCategory(catId, 1)}
                  disabled={i === categoryOrder.length - 1}
                  style={[styles.arrowBtn, i === categoryOrder.length - 1 && styles.arrowBtnDisabled]}
                  hitSlop={6}
                >
                  <MaterialCommunityIcons name="chevron-down" size={22} color={colors.text} />
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Show / hide tools */}
        <Text style={styles.sectionTitle}>Show / hide tools</Text>
        <Text style={styles.hint}>
          Turn a tool off to hide it from the home screen. Star a tool on the home screen to pin
          it to Favorites.
        </Text>

        {CATEGORIES.map((cat) => {
          const tools = TOOLS.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <View key={cat.id} style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons name={cat.icon} size={16} color={colors.textMuted} />
                <Text style={styles.sectionTitleText}>{cat.label}</Text>
              </View>
              <View style={styles.card}>
                {tools.map((tool, i) => {
                  const visible = !hiddenTools.includes(tool.id);
                  return (
                    <View key={tool.id} style={[styles.row, i > 0 && styles.rowBorder]}>
                      <View style={styles.rowIcon}>
                        <MaterialCommunityIcons name={tool.icon} size={20} color={colors.primary} />
                      </View>
                      <View style={styles.rowText}>
                        <Text style={styles.rowName}>{tool.name}</Text>
                        <Text style={styles.rowSub} numberOfLines={1}>
                          {tool.subtitle}
                        </Text>
                      </View>
                      <Switch
                        value={visible}
                        onValueChange={() => toggleHidden(tool.id)}
                        trackColor={{ true: colors.primary, false: colors.border }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    content: { padding: spacing.lg, paddingBottom: spacing.xxl },
    sectionTitle: {
      fontSize: font.sm,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: spacing.sm,
      marginTop: spacing.lg,
    },
    hint: { color: colors.textMuted, fontSize: font.sm, lineHeight: 20, marginBottom: spacing.md },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1 },
    rowName: { fontSize: font.sm, fontWeight: '600', color: colors.text },
    rowSub: { fontSize: font.xs, color: colors.textMuted, marginTop: 1 },
    section: { marginBottom: spacing.lg },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    sectionTitleText: {
      fontSize: font.sm,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    arrowBtn: { padding: spacing.xs },
    arrowBtnDisabled: { opacity: 0.3 },
  });
