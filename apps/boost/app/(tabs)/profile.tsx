import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const statCards = [
  { id: 'ring', type: 'ring' as const },
  { id: 'running', type: 'metric' as const, title: 'Running', value: '17', unit: 'KM' },
  { id: 'trophies', type: 'icon' as const, icon: 'emoji-events', value: '×3', color: '#FFD700' },
  { id: 'achievements', type: 'icon' as const, icon: 'military-tech', value: '×3', subtitle: 'Achievements' },
];

export default function ProfileTabScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.header}>
        <BoostButton
          label="Settings"
          onPress={() => router.push('/settings')}
          variant="secondary"
          icon={<MaterialIcons name="settings" size={18} color={palette.text} />}
          fullWidth={false}
        />
      </View>

      <View style={styles.profileSection}>
        <View style={[styles.avatarRing, { borderColor: palette.primary }]}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_gAgVttyZd6A3fC-8zEOOYYyrBg-k0eTRQ5a756-yHmoPRQFsDk1maQ5cQ1qwuUtUijm6l9E17pzVd-L5WojYiIwPcuNYGtxEuCBiiOajxCLQ64RHBKnRapFRppDVgFP55CW5E-6dpX_YWGxU5FqWK96s4rAgd8HuFcR8mLqa69qD90CWDzYEBq1PU-AQZLWnUIf0CH8OCd88xur90Pl3NSBmN96kamgmX503e_B7I1sIw8ZAETCwf_okjhVvKzfJpA5Zs2PfEEI',
            }}
            style={styles.avatar}
          />
          <Pressable
            onPress={() => router.push('/profile/view')}
            style={[styles.avatarButton, { backgroundColor: palette.primary }]}>
            <MaterialIcons name="photo-camera" size={20} color="#000000" />
          </Pressable>
        </View>
        <Text style={[styles.name, { color: palette.text }]}>Mr. Chen</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: palette.mutedText }]}>Followers</Text>
            <Text style={[styles.metaValue, { color: palette.primary }]}>2.7K</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: palette.mutedText }]}>Activity</Text>
            <Text style={[styles.metaValue, { color: palette.primary }]}>45</Text>
          </View>
        </View>
        <BoostButton label="Edit Profile" onPress={() => router.push('/profile/view')} />
      </View>

      <View style={styles.cardGrid}>
        {statCards.map((card) => {
          if (card.type === 'ring') {
            return (
              <View key={card.id} style={[styles.card, { backgroundColor: palette.surface }]}>
                <View style={styles.ringWrapper}>
                  <View style={[styles.outerRing, { borderColor: '#4338CA' }]}>
                    <View style={[styles.middleRing, { borderColor: '#FBBF24' }]}>
                      <View style={[styles.innerRing, { borderColor: palette.primary }]} />
                    </View>
                  </View>
                </View>
              </View>
            );
          }

          if (card.type === 'metric') {
            return (
              <View key={card.id} style={[styles.card, { backgroundColor: palette.surface }]}>
                <View style={styles.metricCard}>
                  <Text style={[styles.metricTitle, { color: palette.mutedText }]}>{card.title}</Text>
                  <Text style={[styles.metricValue, { color: palette.primary }]}>
                    {card.value}
                    <Text style={styles.metricUnit}>{` ${card.unit}`}</Text>
                  </Text>
                </View>
              </View>
            );
          }

          return (
            <View key={card.id} style={[styles.card, { backgroundColor: palette.surface }]}>
              <View style={styles.iconCard}>
                <MaterialIcons
                  name={card.icon as keyof typeof MaterialIcons.glyphMap}
                  size={48}
                  color={card.color ?? palette.primary}
                />
                <Text style={[styles.iconCardValue, { color: card.color ?? palette.primary }]}>{card.value}</Text>
                {card.subtitle ? (
                  <Text style={[styles.iconCardSubtitle, { color: palette.mutedText }]}>{card.subtitle}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <Link href="/profile/view" style={[styles.link, { color: palette.primary }]}>View public profile</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'flex-end',
  },
  profileSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarRing: {
    width: 136,
    height: 136,
    borderRadius: Radii.pill,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Radii.pill,
  },
  avatarButton: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    width: 44,
    height: 44,
    borderRadius: Radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '48%',
    borderRadius: Radii.lg,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  outerRing: {
    width: 96,
    height: 96,
    borderRadius: Radii.pill,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 72,
    height: 72,
    borderRadius: Radii.pill,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 48,
    height: 48,
    borderRadius: Radii.pill,
    borderWidth: 6,
  },
  metricCard: {
    alignItems: 'center',
    gap: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  iconCard: {
    alignItems: 'center',
    gap: 8,
  },
  iconCardValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  iconCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  link: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
