import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppHeader() {
  // Example values
  const streak = 112;
  const xp = 12716;
  const maxXp = 20000;
  const stamina = 6;
  const maxStamina = 10;

  const xpWidth = `${(xp / maxXp) * 100}%`;
  const staminaWidth = `${(stamina / maxStamina) * 100}%`;

  return (
    <View style={[styles.header, { backgroundColor: '#1c1d2cff' }]}>
      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <Ionicons name="flame" size={20} color="orange" />
            <Text style={styles.statValue}>{streak}</Text>
          </View>
          <Text style={styles.statLabel}>Streak</Text>
        </View>

        {/* XP Bar with number */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <Ionicons name="star" size={20} color="gold" />
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBarFill, { width: xpWidth }]} />
              <Text style={styles.barText}>{xp}/{maxXp}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>XP</Text>
        </View>

        {/* Stamina Bar */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <MaterialCommunityIcons name="lightning-bolt-circle" size={20} color="#7ee926ff" />
            <View style={styles.staminaBarContainer}>
              <View style={[styles.staminaBarFill, { width: staminaWidth }]} />
              <Text style={styles.barText}>{stamina}/{maxStamina}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Stamina</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 10,
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
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
  },
  staminaBarContainer: {
    width: 60,
    height: 12,
    backgroundColor: '#ada6a6ff',
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  staminaBarFill: {
    height: '100%',
    backgroundColor: '#7ee926ff',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  xpBarContainer: {
    width: 80,
    height: 12,
    backgroundColor: '#ada6a6ff',
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: 'gold',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  barText: {
    color: '#000000ff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
  },
});
