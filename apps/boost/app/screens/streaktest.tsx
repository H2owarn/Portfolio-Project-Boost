import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { useStreak } from '@/contexts/StreakContext';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { playPreloaded, playSound } from '@/utils/sound';

export default function StreakTestScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const { streak, updateStreak, resetStreak, refreshStreak, setStreakValue } = useStreak();

  useEffect(() => {
    refreshStreak();
  }, []);

  const handleSignOut = async () => {
    try {
      await playPreloaded('click');
    } catch {
      await playSound(require('@/assets/sound/tap.wav'));
    }

    await supabase.auth.signOut();
    router.replace('/onboarding/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.title, { color: palette.text }]}>🔥 Streak System Test</Text>

      <View style={styles.card}>
        <Text style={[styles.label, { color: palette.text }]}>Current Streak:</Text>
        <Text style={[styles.value, { color: palette.tint }]}>{streak} days</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Increment Streak" onPress={updateStreak} />
        <Button title="Reset Streak" color="red" onPress={resetStreak} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Refresh Streak (Reload)" onPress={refreshStreak} />
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Set Streak = 5 (Test)" onPress={() => setStreakValue(5)} />
      </View>

      {/* 👇 Subtle sign-out at the bottom */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={palette.mutedText} />
          <Text style={[styles.signOutText, { color: palette.mutedText }]}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
    width: '80%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonGroup: {
    gap: 10,
    width: '70%',
  },
  signOutContainer: {
    marginTop: 50,
    alignItems: 'center',
    width: '80%',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
