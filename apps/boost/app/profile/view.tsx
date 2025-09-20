import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const gallery = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMh0vOT_pC7qsI2OpdrsbplnkW492zJINDOAkP3zr9Y6Is6ndVPZD4FulVG0IliJXu1WrmGQB6DqgKT05ImhLC35iSsT5w2lkunIYap1ev-Ew0ombbNegIhUDWcaTcNSYTu1JqB6oi7XbbtcBRuz8fNGNoZFSPxLwEKVrep9jUUKa9HV4ooxv3ZMujMRVGQKpmykZ21f1G5KbehhwtoePFai9-D1epRzzNkgqW2ku_l2kLPiZghEw_fJLYb7PP-3RdO0_f-0xtFr8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCF_Kt3_vvJ1NuqPywGa9h6CN1t7336NNnSko1U6DVudw2_H_Qsx90gzmavyapunFEF8r2-D9hijSMkMtA8J1WiFNcwfldBLmf0fWBarMaZQFD6-oJl3jDScuyOUtN7UcnKIPoQYicEJHQE9QUbxLUxDiv2wCf3utukx8PkeqASWJKCzyqQdH6svU9IUnkGW6f8-zesYQc_YsDWG1ueoqH3HOBRtDQSID6-PWqot8yTSsX_AL4oka8m-zdr1qzlSj5gXJgdFxxRjSU',
];

export default function CommunityProfileScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.navRow}>
        <BoostButton
          label="Back"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth={false}
          icon={<MaterialIcons name="arrow-back" size={18} color={palette.text} />}
        />
        <BoostButton
          label="More"
          onPress={() => {}}
          variant="secondary"
          fullWidth={false}
          icon={<MaterialIcons name="more-horiz" size={18} color={palette.text} />}
        />
      </View>

      <View style={styles.hero}>
        <View style={[styles.avatarWrapper, { borderColor: palette.primary }]}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7NzJt1-NmMyLbDh-J5dC0H2qhHzs5F8phMnyTcvzNtaBsw-BMt9XRxN-t7xe0Ke8puCO7SKLe0mmg4aPbAzgUkLvMvPCjGnzoNI39R2FhksyAe2mfpTUs2HPYBPXR4coiBMfQIcBzAD-HbFYf-F5fceq0UuY0AiX4lV3vVzMoYbAXNTfsNZbdF_QRMYGaZoQF_94ya-_06Qd0N5x1sKnGgsh9vpcp0khXEsiBkNs5EhORoiVnRNlTNGGtp3d7gWLQs3ICIvzbx-Q',
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={[styles.name, { color: palette.text }]}>Ms. Lin</Text>
        <Text style={[styles.handle, { color: palette.mutedText }]}>@ms.lin_official</Text>
        <Text style={[styles.bio, { color: palette.mutedText }]}>Fitness enthusiast & content creator. Sharing my journey to a healthier lifestyle. Let{'\''}s get moving together! 🚀</Text>
        <View style={styles.actionsRow}>
          <BoostButton label="Follow" onPress={() => {}} fullWidth={false} />
          <BoostButton label="Message" onPress={() => {}} fullWidth={false} variant="secondary" />
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: palette.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.text }]}>2.7K</Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.text }]}>1.2K</Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.text }]}>24</Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>Posts</Text>
        </View>
      </View>

      <View style={styles.gallery}>
        {gallery.map((item) => (
          <Image key={item} source={{ uri: item }} style={styles.galleryImage} />
        ))}
      </View>

      <View style={[styles.badgeCard, { backgroundColor: palette.surface }]}>
        <View>
          <Text style={[styles.badgeTitle, { color: palette.text }]}>Race Champion</Text>
          <Text style={[styles.badgeSubtitle, { color: palette.mutedText }]}>Top 1% in the last marathon</Text>
          <Text style={[styles.badgeLink, { color: palette.primary }]}>View results</Text>
        </View>
        <MaterialIcons name="emoji-events" size={64} color={palette.primary} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrapper: {
    width: 128,
    height: 128,
    borderRadius: Radii.pill,
    borderWidth: 3,
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Radii.pill,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  handle: {
    fontSize: 14,
  },
  bio: {
    textAlign: 'center',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: Radii.lg,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  gallery: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  galleryImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radii.lg,
  },
  badgeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: Radii.lg,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  badgeSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  badgeLink: {
    marginTop: 8,
    fontWeight: '600',
  },
});
