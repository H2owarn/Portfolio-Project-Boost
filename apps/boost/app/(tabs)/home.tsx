import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { Colors, Radii, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const USER = {
  name: 'IAN',
  level: 1,
  xp: 40,
  xpRequired: 100,
  avatar: 'https://via.placeholder.com/80',
  quests: ['👑', '🦴', '💎', '🌚', '⭐'],
  friends: [
    { id: '1', name: 'Bailey Dupont', level: 99, avatar: 'https://via.placeholder.com/60' },
    { id: '2', name: 'Pedro Fernandes', level: 50, avatar: 'https://via.placeholder.com/60' },
  ],
};

export default function HomeScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <ScrollView
      contentInset={{ top: 45 }}
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      <View style={[styles.header, { backgroundColor: palette.surface }]}
      >
        <Image source={{ uri: USER.avatar }} style={styles.avatar} />
        <View style={styles.headerCopy}>
          <Text style={[styles.userName, { color: palette.text }]}>{USER.name}</Text>
          <Text style={[styles.userLevel, { color: palette.mutedText }]}>Level {USER.level}</Text>
          <Progress.Bar
            progress={USER.xp / USER.xpRequired}
            width={220}
            height={12}
            color={palette.primary}
            unfilledColor={palette.primary + '20'}
            borderWidth={1}
            borderColor={palette.borderColor}
            style={styles.progressBar}
          />
          <Text style={[styles.xpText, { color: palette.mutedText }]}
          >
            {USER.xp}/{USER.xpRequired} XP
          </Text>
        </View>
      </View>

      <View style={[styles.questSection, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Quest Board</Text>
          <Pressable
            onPress={() => console.log('See all quests')}
            android_ripple={{ color: palette.primary + '20' }}
          >
            <Text style={[styles.seeAll, { color: palette.primary }]}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.questGrid}>
          {USER.quests.map((emoji, idx) => (
            <View key={idx} style={[styles.hexagon, { backgroundColor: palette.primary + '15' }]}>
              <Text style={styles.questEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={[styles.quickStartBtn, { backgroundColor: palette.primary }]}
          android_ripple={{ color: palette.secondary + '20' }}
          onPress={() => console.log('Quick start quest')}
        >
          <Text style={[styles.quickStartText, { color: palette.secondary }]}>Quick Start</Text>
        </Pressable>
      </View>

      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Recommended Allies</Text>
          <Pressable
            onPress={() => console.log('See all friends')}
            android_ripple={{ color: palette.primary + '20' }}
          >
            <Text style={[styles.seeAll, { color: palette.primary }]}>See All ▾</Text>
          </Pressable>
        </View>
        {USER.friends.map((friend) => (
          <View key={friend.id} style={[styles.recommendCard, { backgroundColor: palette.surfaceElevated }]}
          >
            <Image source={{ uri: friend.avatar }} style={styles.recommendAvatar} />
            <View style={styles.recommendInfo}>
              <Text style={[styles.recommendName, { color: palette.text }]}>{friend.name}</Text>
              <Text style={[styles.recommendLevel, { color: palette.mutedText }]}>Level {friend.level}</Text>
            </View>
            <Text style={[styles.arrow, { color: palette.primary }]}>➡️</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: Radii.lg,
    ...Shadow.card,
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222',
  },
  progressBar: {
    marginTop: 6,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpText: {
    fontSize: 12,
  },
  questSection: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 18,
    ...Shadow.card,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 14,
    ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  questGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  hexagon: {
    width: 90,
    height: 90,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questEmoji: {
    fontSize: 28,
  },
  quickStartBtn: {
    borderRadius: Radii.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  quickStartText: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    padding: 12,
    gap: 12,
  },
  recommendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#111',
  },
  recommendInfo: {
    flex: 1,
    gap: 4,
  },
  recommendName: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendLevel: {
    fontSize: 13,
  },
  arrow: {
    fontSize: 18,
  },
});
