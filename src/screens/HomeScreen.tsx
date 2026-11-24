import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { CATEGORIES, TOOLS, type Tool } from '../config/tools';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import ToolCard from '../components/ToolCard';
import ToolDetailModal from '../components/ToolDetailModal';
import { font, radius, spacing, type ThemeColors } from '../theme';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const navigate = useAppStore((s) => s.navigate);
  const isPro = useAppStore((s) => s.isPro);
  const favorites = useAppStore((s) => s.favorites);
  const hiddenTools = useAppStore((s) => s.hiddenTools);
  const recents = useAppStore((s) => s.recents);
  const categoryOrder = useAppStore((s) => s.categoryOrder);
  const onboarded = useAppStore((s) => s.onboarded);
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleHidden = useAppStore((s) => s.toggleHidden);
  const recordRecent = useAppStore((s) => s.recordRecent);

  const [search, setSearch] = useState('');
  const [detailTool, setDetailTool] = useState<Tool | null>(null);

  const handleToggleFavorite = (tool: Tool) => {
    toggleFavorite(tool.id);
    Haptics.selectionAsync().catch(() => {});
  };
  const handleToggleHidden = (tool: Tool) => toggleHidden(tool.id);

  const handlePress = (tool: Tool) => {
    if (tool.tier === 'pro' && !isPro) {
      navigate('pro');
      return;
    }
    if (tool.status !== 'ready' || !tool.screen) {
      Alert.alert('Coming soon', `${tool.name} is on its way.`);
      return;
    }
    recordRecent(tool.id);
    Haptics.selectionAsync().catch(() => {});
    navigate(tool.screen);
  };

  const query = search.trim().toLowerCase();
  const visible = TOOLS.filter((t) => !hiddenTools.includes(t.id));
  const searched = query
    ? visible.filter(
        (t) => t.name.toLowerCase().includes(query) || t.subtitle.toLowerCase().includes(query),
      )
    : null;

  const favoriteTools = visible.filter((t) => favorites.includes(t.id));
  const recentTools = recents
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is Tool => !!t && !hiddenTools.includes(t.id) && !favorites.includes(t.id))
    .slice(0, 4);
  const rest = visible.filter(
    (t) => !favorites.includes(t.id) && !recentTools.some((r) => r.id === t.id),
  );
  const sections = categoryOrder
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((c): c is (typeof CATEGORIES)[number] => !!c)
    .map((c) => ({ category: c, tools: rest.filter((t) => t.category === c.id) }))
    .filter((s) => s.tools.length > 0);

  const gridProps = {
    isPro,
    favorites,
    onPress: handlePress,
    onLongPress: (t: Tool) => setDetailTool(t),
    onToggleFavorite: handleToggleFavorite,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tools"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {!isPro && <ProBanner colors={colors} onPress={() => navigate('pro')} />}

        {searched ? (
          searched.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle colors={colors} icon="magnify" label={`Results (${searched.length})`} />
              <ToolGrid tools={searched} {...gridProps} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="magnify-close" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>No tools match “{search.trim()}”.</Text>
            </View>
          )
        ) : (
          <>
            {favoriteTools.length > 0 && (
              <View style={styles.section}>
                <SectionTitle colors={colors} icon="star" label="Favorites" />
                <ToolGrid tools={favoriteTools} {...gridProps} />
              </View>
            )}

            {recentTools.length > 0 && (
              <View style={styles.section}>
                <SectionTitle colors={colors} icon="history" label="Recent" />
                <ToolGrid tools={recentTools} {...gridProps} />
              </View>
            )}

            {sections.map((s) => (
              <View key={s.category.id} style={styles.section}>
                <SectionTitle colors={colors} icon={s.category.icon} label={s.category.label} />
                <ToolGrid tools={s.tools} {...gridProps} />
              </View>
            ))}

            {visible.length === 0 && (
              <View style={styles.emptyWrap}>
                <MaterialCommunityIcons name="tray-remove" size={36} color={colors.textMuted} />
                <Text style={styles.emptyText}>
                  All tools are hidden.{'\n'}Open settings to show them again.
                </Text>
              </View>
            )}
          </>
        )}

        <View style={styles.footer}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>Offline · Private · No account</Text>
        </View>
      </ScrollView>

      {!onboarded && <OnboardingModal colors={colors} onDone={setOnboarded} />}
      <ToolDetailModal
        tool={detailTool}
        isFavorite={detailTool ? favorites.includes(detailTool.id) : false}
        isHidden={detailTool ? hiddenTools.includes(detailTool.id) : false}
        onClose={() => setDetailTool(null)}
        onOpen={handlePress}
        onToggleFavorite={handleToggleFavorite}
        onToggleHidden={handleToggleHidden}
      />
    </SafeAreaView>
  );
}

function OnboardingModal({ colors, onDone }: { colors: ThemeColors; onDone: () => void }) {
  const styles = createStyles(colors);
  const tips = [
    { icon: 'gesture-tap', text: 'Tap a tool to open it' },
    { icon: 'star-outline', text: 'Star a tool to pin it to Favorites' },
    { icon: 'gesture-tap-hold', text: 'Long-press a tool for details & shortcuts' },
    { icon: 'cog-outline', text: 'Open settings to hide tools or switch themes' },
  ];
  return (
    <Modal transparent animationType="fade">
      <View style={styles.onboardBackdrop}>
        <View style={styles.onboardCard}>
          <Text style={styles.onboardTitle}>Welcome to Mensura</Text>
          <Text style={styles.onboardSubtitle}>17 handy tools — offline and private.</Text>
          {tips.map((t, i) => (
            <View key={i} style={styles.tipRow}>
              <MaterialCommunityIcons name={t.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={22} color={colors.primary} />
              <Text style={styles.tipText}>{t.text}</Text>
            </View>
          ))}
          <Pressable style={styles.onboardBtn} onPress={onDone}>
            <Text style={styles.onboardBtnText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function SectionTitle({ colors, icon, label }: { colors: ThemeColors; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  const styles = createStyles(colors);
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
  onLongPress,
  onToggleFavorite,
}: {
  tools: Tool[];
  isPro: boolean;
  favorites: string[];
  onPress: (tool: Tool) => void;
  onLongPress: (tool: Tool) => void;
  onToggleFavorite: (tool: Tool) => void;
}) {
  return (
    <View style={gridStyles.grid}>
      {tools.map((tool) => (
        <View key={tool.id} style={gridStyles.cell}>
          <ToolCard
            tool={tool}
            isPro={isPro}
            isFavorite={favorites.includes(tool.id)}
            onPress={onPress}
            onLongPress={onLongPress}
            onToggleFavorite={onToggleFavorite}
          />
        </View>
      ))}
    </View>
  );
}

function ProBanner({ colors, onPress }: { colors: ThemeColors; onPress: () => void }) {
  const styles = createStyles(colors);
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

const gridStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  cell: { width: '50%', padding: spacing.xs },
});

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    content: { padding: spacing.lg, paddingBottom: spacing.xxl },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
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
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      height: 44,
      marginBottom: spacing.lg,
    },
    searchInput: { flex: 1, fontSize: font.sm, color: colors.text, padding: 0 },
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
    onboardBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    onboardCard: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.xl,
    },
    onboardTitle: { fontSize: font.lg, fontWeight: '800', color: colors.text },
    onboardSubtitle: { fontSize: font.sm, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
    tipRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
    tipText: { fontSize: font.sm, color: colors.text, flex: 1 },
    onboardBtn: {
      marginTop: spacing.lg,
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    onboardBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: font.sm },
  });
