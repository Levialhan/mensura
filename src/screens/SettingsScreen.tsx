import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { CATEGORIES, TOOLS } from '../config/tools';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, spacing } from '../theme';

export default function SettingsScreen() {
  const goHome = useAppStore((s) => s.goHome);
  const hiddenTools = useAppStore((s) => s.hiddenTools);
  const toggleHidden = useAppStore((s) => s.toggleHidden);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScreenHeader title="Settings" onBack={goHome} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          Turn a tool off to hide it from the home screen. Star a tool on the home screen to pin it
          to Favorites.
        </Text>

        {CATEGORIES.map((cat) => {
          const tools = TOOLS.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <View key={cat.id} style={styles.section}>
              <View style={styles.sectionTitle}>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hint: { color: colors.textMuted, fontSize: font.sm, lineHeight: 20, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sectionTitleText: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
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
});
