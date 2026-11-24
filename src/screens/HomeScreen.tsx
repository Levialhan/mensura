import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, TOOLS, type Tool } from '../config/tools';
import { useAppStore } from '../store/useAppStore';
import ToolCard from '../components/ToolCard';
import { colors, font, radius, spacing } from '../theme';

export default function HomeScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const isPro = useAppStore((s) => s.isPro);
  const favorites = useAppStore((s) => s.favorites);
  const hiddenTools = useAppStore((s) => s.hiddenTools);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const handleToggleFavorite = (tool: Tool) => toggleFavorite(tool.id);

  const handlePress = (tool: Tool) => {
    if (tool.tier === 'pro' && !isPro) {
      navigate('pro');
      return;
    }
    if (tool.status !== 'ready' || !tool.screen) {
      Alert.alert('Coming soon', `${tool.name} is on its way.`);
      return;
    }
    navigate(tool.screen);
  };

  const visible = TOOLS.filter((t) => !hiddenTools.includes(t.id));
  const favoriteTools = visible.filter((t) => favorites.includes(t.id));
  const rest = visible.filter((t) => !favorites.includes(t.id));
  const sections = CATEGORIES.map((c) => ({
    category: c,
    tools: rest.filter((t) => t.category === c.id),
  })).filter((s) => s.tools.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Mensura</Text>
            <Text style={styles.subtitle}>Your pocket measurement toolkit</Text>
          </View>
          <Pressable
            onPress={() => navigate('settings')}
            style={styles.settingsBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        {!isPro && <ProBanner onPress={() => navigate('pro')} />}

        {favoriteTools.length > 0 && (
          <View style={styles.section}>
            <SectionTitle icon="star" label="Favorites" />
            <ToolGrid tools={favoriteTools} isPro={isPro} favorites={favorites} onPress={handlePress} onToggleFavorite={handleToggleFavorite} />
          </View>
        )}

        {sections.map((s) => (
          <View key={s.category.id} style={styles.section}>
            <SectionTitle icon={s.category.icon} label={s.category.label} />
            <ToolGrid tools={s.tools} isPro={isPro} favorites={favorites} onPress={handlePress} onToggleFavorite={handleToggleFavorite} />
          </View>
        ))}

        {visible.length === 0 && (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="tray-remove" size={36} color={colors.textMuted} />
            <Text style={styles.emptyText}>All tools are hidden.{'\n'}Open settings to show them again.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>Offline · Private · No account</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={styles.sectionTitle}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.sectionTitleText}>{label}</Text>
    </View>
  );
}

function ToolGrid({
  tools,
  isPro,
  favorites,
  onPress,
  onToggleFavorite,
}: {
  tools: Tool[];
  isPro: boolean;
  favorites: string[];
  onPress: (tool: Tool) => void;
  onToggleFavorite: (tool: Tool) => void;
}) {
  return (
    <View style={styles.grid}>
      {tools.map((tool) => (
        <View key={tool.id} style={styles.cell}>
          <ToolCard
            tool={tool}
            isPro={isPro}
            isFavorite={favorites.includes(tool.id)}
            onPress={onPress}
            onToggleFavorite={onToggleFavorite}
          />
        </View>
      ))}
    </View>
  );
}

function ProBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
      <LinearGradient
        colors={['#1E2A47', '#0B1220']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerIcon}>
          <MaterialCommunityIcons name="crown" size={22} color="#F5C542" />
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Unlock Mensura Pro</Text>
          <Text style={styles.bannerSubtitle}>All tools · no ads · export history</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#F5C542" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1 },
  title: { fontSize: font.xxl, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: font.sm, color: colors.textMuted, marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  bannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(245,197,66,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: font.md },
  bannerSubtitle: { color: '#AEB9CF', fontSize: font.xs, marginTop: 1 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitleText: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  cell: { width: '50%', padding: spacing.xs },
  emptyWrap: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: font.sm, textAlign: 'center', lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  footerText: { color: colors.textMuted, fontSize: font.xs },
});
