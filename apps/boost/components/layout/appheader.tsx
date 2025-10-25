import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useXp } from '@/contexts/Xpcontext';
import { useStamina } from '@/contexts/Staminacontext';
import { useStreak } from '@/contexts/StreakContext';

export default function HeaderBar() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const { xp, level, minExp, maxExp } = useXp();
  const { stamina: currentStamina, maxStamina } = useStamina();
  const { streak } = useStreak();

  const progress = maxExp > minExp ? Math.round(((xp - minExp) / (maxExp - minExp)) * 100) : 0;
  const staminaWidth = Math.floor((currentStamina / maxStamina) * 100);

  return (
    <View style={[styles.header, { backgroundColor: palette.surface }]}>
      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <MaterialIcons name="local-fire-department" size={20} color={palette.warning} />
            <Text style={[styles.statValue, { color: palette.text }]}>{streak}</Text>
          </View>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>Streak</Text>
        </View>

        {/* XP Bar */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <Ionicons name="star" size={20} color={palette.warning} />
            <View style={[styles.xpBarContainer, { backgroundColor: palette.borderColorAlt }]}>
              <View style={[styles.xpBarFill, { width: `${progress}%`, backgroundColor: palette.primary }]} />
              <Text style={[styles.barText, { color: palette.text }]}>{xp}/{maxExp}</Text>
            </View>
          </View>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>XP</Text>
        </View>

        {/* Stamina */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <MaterialCommunityIcons name="lightning-bolt-circle" size={20} color={palette.primary} />
            <View style={[styles.staminaBarContainer, { backgroundColor: palette.borderColorAlt }]}>
              <View style={[styles.staminaBarFill, { width: `${staminaWidth}%`, backgroundColor: palette.primary }]} />
              <Text style={[styles.barText, { color: palette.text }]}>{currentStamina}/{maxStamina}</Text>
            </View>
          </View>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>Stamina</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  iconValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
  },
  staminaBarContainer: {
    width: 60,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  staminaBarFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  xpBarContainer: {
    width: 80,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  xpBarFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  barText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
  },
});
