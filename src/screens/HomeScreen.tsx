import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TOOLS, type Tool } from '../config/tools';
import { useAppStore } from '../store/useAppStore';
import ToolCard from '../components/ToolCard';
import { colors, font, radius, spacing } from '../theme';

export default function HomeScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const isPro = useAppStore((s) => s.isPro);

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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mensura</Text>
          <Text style={styles.subtitle}>Your pocket measurement toolkit</Text>
        </View>

        {!isPro && <ProBanner onPress={() => navigate('pro')} />}

        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <View key={tool.id} style={styles.cell}>
              <ToolCard tool={tool} isPro={isPro} onPress={handlePress} />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>Offline · Private · No account</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: font.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(245,197,66,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: font.md,
  },
  bannerSubtitle: {
    color: '#AEB9CF',
    fontSize: font.xs,
    marginTop: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: font.xs,
  },
});
