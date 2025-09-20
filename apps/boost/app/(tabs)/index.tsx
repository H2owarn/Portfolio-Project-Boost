import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const stories = [
  {
    id: 'create',
    label: 'Add',
    borderColor: '#4B5563',
    icon: 'add',
  },
  {
    id: 'live',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAh3q22kaWutr_sayY-Y3qyLx7IiqcRWD8ZaMt3lfcA7V5AbJWU9VnQ2nfL1tz9WUXGx_OGSci-841O9yQyZA3SrJ46Zj9eu0bECp-8xvjs6RnzdP0GmYu6RVoNhEhE8UOz2Yhk2D-kquA32rdiXJ6hJSuGOwLPn0SAaIoZaMniHKP4GV9rkZq3XqASlzq8EZmfzoA44B4AsGoAsfkYnP3YHfhQ_3NJdLi1PkpDpU0GehVvjlBliBBaTjzHWnKfLyZcimIV-UMy9s8',
    badge: 'Live',
    badgeColor: '#ef4444',
  },
  {
    id: 'sun',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnj_ulgqKsVnL9VvJBJdEUSJG8O_wqgnA4pE0S5fPAga0lJ4zvDtQavTxVnumoocLYVJmqAX3vJNRuhve6YNjC4aKHz6UGIUZNa9TQWQpsjfpa7Sb44FVel-g-k5Asn7xMSWrpyO2UtbTuw9jr1N85l1XZR-qpUGWbcWz93zWBbdw6ddBjnOqCxDrdZ9e2uwViRvVXNNMONckXl-5agNc_5A6ZRdxb4Z7JBZ1rahWp5OJYMK9LLPZdFfgWWr_EmcK-RvX7Zl2arb4',
    borderColor: 'primary',
  },
  {
    id: 'bw',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7P3pFKfh8zFh86QfuV_i5sA123dmyd7zlLVUhki55DeRV7rfWjsnI0C2Qz9HWL5f0vi1Pls4YMNV5nXn3cVsZIMJiqcqA-NrvrPEA5cH2edxK2RZOz6QWpBgnLk1nN1jO58D1FskNRKrGQ2LdtUuyG2sjzz4RJTNmjRFafbBSHiZmap5RW5Nykai7ot4QpD2-pisElP7qudqQGU93Ur0yUG4KwFCHq4HDcTeePgGwfRQLzTXkG57YmNsJYkzgZ1dpdt2TXP7L81A',
  },
  {
    id: 'smile',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByzBmXgkx84zUdoatmhpQn6MRqnXPAOpOsdwsm8BCtYtxN5Te5GtcAezMNXF3anktjUU4nUhV4jDX0xF1kVfdr6IEl-TmS_zUipgmPE9Y7b6BwOcliNeXsUT7MDX7V27wH9uvzCiaqD3qOK0uva3kPtBGAQEOgK-R359etgaAWW0nUpOccbTdt7xCSl4zKj42bMUqcMxv4rJZkolZBCS-jbNfmNChKj7WcpEeaS1Rz6xXviXtXJqYrYFvDBXX-xAcNo466Ax0NnVg',
  },
  {
    id: 'mint',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBl3sUne3M3cB8SQJYidRM4QR2FRNPfbtPhA_PKDIbjeEWuoevUvXtmo9Zpoobwjcp-xiB1c220zkLvUHDli_WRRRbjtVVMpxL4No5ZDB5tICyc4AlAj5WiXWnfT4inj7YWBHVjRxjaE6raEFHK3K0O6zsg71Y7V37Ri0PwRIS1rw4xQC_mYRiebf7y2atZLz6rtF_smLUIEm2Atsi0RU7YdD0fry6fq9xzLw1GcFDtZ1xQ5SHpe3vb0B7usYEzQPbYuGUtUMgkT1Q',
  },
];

const dailyCards = [
  {
    id: 'abs',
    title: '10 Sets',
    subtitle: 'Build ABS',
    progress: 0.75,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUI_GRocDW4znZUZuVmMrUpMoxSdqEDIQSkunlkJqNu3MLPcFNC2BUBR913StwKfeEE7gy4Kx-WRYUFv5-0Kfbyib8jVVgbA-bkYry6TeKNkYJ_hJ7CjhAOD0YjXxHL3l3rVk-cU7QDjzwv6ZiNoonpBr9ecKIOo5em6m_sdt160C0GmcLqNhOkdIcNhh0wOXZzopMQy98hEyTs7AnoyKirCvFK1c1mFQTWjZvWHb4HeooqT1uw0Qqxg6FV_gpQF6t1kZO9RCu49c',
  },
  {
    id: 'burn',
    title: '30 mins',
    subtitle: 'Fat Burn',
    progress: 0.35,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUI_GRocDW4znZUZuVmMrUpMoxSdqEDIQSkunlkJqNu3MLPcFNC2BUBR913StwKfeEE7gy4Kx-WRYUFv5-0Kfbyib8jVVgbA-bkYry6TeKNkYJ_hJ7CjhAOD0YjXxHL3l3rVk-cU7QDjzwv6ZiNoonpBr9ecKIOo5em6m_sdt160C0GmcLqNhOkdIcNhh0wOXZzopMQy98hEyTs7AnoyKirCvFK1c1mFQTWjZvWHb4HeooqT1uw0Qqxg6FV_gpQF6t1kZO9RCu49c',
  },
];

const moreChallenges = [
  { id: 'battle', icon: 'fitness-center', name: 'Battle Rope', duration: '5 mins' },
  { id: 'yoga', icon: 'self-improvement', name: 'Yoga', duration: '10 mins' },
  { id: 'cycle', icon: 'directions-bike', name: 'Cycling', duration: '30 mins' },
  { id: 'meditate', icon: 'spa', name: 'Meditation', duration: '15 mins' },
];

export default function ChallengeTabScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Challenge</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyRow}>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyItem}>
            {story.id === 'create' ? (
              <View style={[styles.storyAvatarAdd, { borderColor: story.borderColor }]}>
                <MaterialIcons name="add" size={28} color="#9CA3AF" />
              </View>
            ) : (
              <View
                style={[
                  styles.storyAvatarWrapper,
                  story.borderColor
                    ? {
                        borderColor:
                          story.borderColor === 'primary' ? palette.primary : (story.borderColor as string),
                      }
                    : null,
                ]}>
                <Image source={{ uri: story.image }} style={styles.storyAvatar} />
                {story.badge ? (
                  <View style={[styles.badge, { backgroundColor: story.badgeColor }]}>
                    <Text style={styles.badgeLabel}>{story.badge}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Daily Tasks</Text>
      </View>
      <View style={styles.dailyRow}>
        {dailyCards.map((card) => (
          <View key={card.id} style={styles.dailyCard}>
            <Image source={{ uri: card.image }} style={styles.dailyBackground} />
            <View style={styles.dailyOverlay} />
            <View style={styles.dailyContent}>
              <Text style={styles.dailyTitle}>{card.title}</Text>
              <Text style={styles.dailySubtitle}>{card.subtitle}</Text>
            </View>
            <View style={styles.dailyProgressWrapper}>
              <View style={styles.dailyProgressTrack}>
                <View
                  style={[styles.dailyProgressFill, { width: `${card.progress * 100}%`, backgroundColor: palette.primary }]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>More Challenges</Text>
      </View>
      <View style={styles.timeline}>
        <View style={styles.timelineLine} />
        <View style={styles.timelineContent}>
          {moreChallenges.map((item) => (
            <View key={item.id} style={[styles.challengeRow, { backgroundColor: palette.surface }]}>
              <View style={[styles.challengeDot, { backgroundColor: palette.background }]}>
                <View style={[styles.challengeDotInner, { backgroundColor: palette.primary }]} />
              </View>
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color={palette.primary} />
              <Text style={[styles.challengeName, { color: palette.text }]}>{item.name}</Text>
              <MaterialIcons name="schedule" size={16} color={palette.mutedText} />
              <Text style={[styles.challengeDuration, { color: palette.mutedText }]}>{item.duration}</Text>
            </View>
          ))}
        </View>
      </View>

      <BoostButton
        label="Start Workout"
        onPress={() => router.push('/workout/overview')}
        icon={<MaterialIcons name="play-arrow" size={22} color="#000000" />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  storyRow: {
    gap: 16,
    paddingRight: 24,
  },
  storyItem: {
    alignItems: 'center',
  },
  storyAvatarAdd: {
    width: 64,
    height: 64,
    borderRadius: Radii.pill,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: Radii.pill,
    borderWidth: 2,
    borderColor: '#1F2937',
    overflow: 'hidden',
    position: 'relative',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: 4,
    borderRadius: Radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  dailyRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dailyCard: {
    flex: 1,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
  },
  dailyBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  dailyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  dailyContent: {
    position: 'absolute',
    left: 16,
    bottom: 48,
    gap: 4,
  },
  dailyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  dailySubtitle: {
    color: '#d1d5db',
    fontSize: 14,
  },
  dailyProgressWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  dailyProgressTrack: {
    width: 48,
    height: 48,
    borderRadius: Radii.pill,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radii.pill,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 16,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 3,
    width: 1,
    backgroundColor: '#1F2937',
  },
  timelineContent: {
    gap: 12,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: Radii.lg,
  },
  challengeDot: {
    position: 'absolute',
    left: -17,
    width: 20,
    height: 20,
    borderRadius: Radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeDotInner: {
    width: 10,
    height: 10,
    borderRadius: Radii.pill,
  },
  challengeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  challengeDuration: {
    fontSize: 13,
  },
});
