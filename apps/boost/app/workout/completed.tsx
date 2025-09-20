import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WorkoutCompletedScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.trophyWrapper}>
        <View style={[styles.trophyGlow, { backgroundColor: 'rgba(125, 248, 67, 0.35)' }]} />
        <MaterialIcons name="emoji-events" size={120} color={palette.primary} />
      </View>
      <Text style={[styles.name, { color: palette.text }]}>Ms. Chen</Text>
      <Text style={[styles.congrats, { color: palette.text }]}>Congratulations</Text>
      <BoostButton label="Show Results" onPress={() => router.push('/workout/overview')} />
      <BoostButton
        label="Return to Home"
        variant="ghost"
        onPress={() => router.replace('/(tabs)')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  trophyWrapper: {
    width: 220,
    height: 220,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(125,248,67,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyGlow: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: Radii.pill,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
  },
  congrats: {
    fontSize: 22,
    fontWeight: '600',
  },
});
