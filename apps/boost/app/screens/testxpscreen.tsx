import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import HeaderBar from '@/components/layout/appheader';
import { useXp } from '@/contexts/Xpcontext';
import { useStamina } from '@/contexts/Staminacontext';

export default function XpTestScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const { xp, level, addXp } = useXp();
  const { stamina, maxStamina, spendStamina } = useStamina();
  const [loading, setLoading] = useState(false);

  const handleAddXp = async () => {
    try {
      setLoading(true);
      await addXp(50);
      Alert.alert('XP Added!', `You now have ${xp + 50} XP`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSpendStamina = async () => {
    try {
      setLoading(true);
      if (stamina <= 0) {
        Alert.alert('Not enough stamina', 'You have no stamina left!');
        return;
      }
      await spendStamina(10);
      Alert.alert('Stamina Spent!', `Remaining: ${stamina - 10 < 0 ? 0 : stamina - 10}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar />

      <Text style={[styles.title, { color: palette.text }]}>XP System Test</Text>
      <Text style={[styles.xpDisplay, { color: palette.primary }]}>
        Current XP: {xp} (Level: {level})
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: palette.primary }]}
        onPress={handleAddXp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Add +50 XP</Text>
      </TouchableOpacity>

      <Text style={[styles.staminaDisplay, { color: palette.primary }]}>
        Current Stamina: {stamina}/{maxStamina}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#7ee926' }]}
        onPress={handleSpendStamina}
        disabled={loading || stamina <= 0}
      >
        <Text style={styles.buttonText}>Spend 10 Stamina</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  xpDisplay: {
    fontSize: 18,
    marginVertical: 10,
  },
  staminaDisplay: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
