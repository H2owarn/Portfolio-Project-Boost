import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WorkoutInProgressScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.topBar}>
        <BoostButton
          label="Back"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth={false}
          icon={<MaterialIcons name="arrow-back-ios" size={18} color={palette.text} />}
        />
        <View style={[styles.timerChip, { backgroundColor: palette.surface }]}>
          <MaterialIcons name="timer" size={18} color={palette.primary} />
          <Text style={[styles.timerText, { color: palette.text }]}>01:30</Text>
        </View>
      </View>

      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmixIwLOb3PHBna_tCMIKPma0dEgGube5ZWcAewPdkjzW-9dTKEtwOYm9kWiYhONkHQxM8wIt1ItjMxEqfnNTD-72YTDeDHFX26z796FiFIc6Yf35ram7XvYdFkrfOhr7LQlVizIq3od30e8WnQvAyOlgKKVCiclPJ3Ht9LdLrwPxobLJPRhcFN0hUelZbpsw0j-Qx1K35b1V83aJxcwkpzNJUM4ndaFQKwsZObbcMcWr1ZIwkWV1-YGu-kD6-4OhZD8S815rXwKJL',
        }}
        style={styles.hero}
      />

      <Text style={[styles.exerciseTitle, { color: palette.text }]}>Crunches</Text>

      <View style={[styles.counterWrapper, { borderColor: palette.primary }]}>
        <Text style={[styles.counterValue, { color: palette.text }]}>32X</Text>
        <BoostButton
          label="Complete"
          onPress={() => router.push('/workout/completed')}
          fullWidth={false}
          icon={<MaterialIcons name="check" size={22} color="#000000" />}
        />
      </View>

      <View style={[styles.nextCard, { backgroundColor: palette.surface }]}>
        <View style={styles.nextInfo}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL6HGu_YhQBD2JLzOleyE5ujJKYQ5DqxhfQPR0H3660uOPGaRLTFBG8SAgwZ96W2ipYZiUzN1ZbbCJrmpXbL0nRI9oHyT0rTXp9aAaXFaNo18MtaQIOHCDulGc2ZCbIe4z6F_dNE3O5HouDpwz9xGRaRHSWzzXOldF9goLvjmRUD2QTHHCgAt8HrNqVr7yuIP2OyPtsY9kwRV7iqbxB1ZoE2MwIZoQf0HrivZfxkUoJNJ_Whf2QnVGYccoVKvNECVWMC4y6VB6qh9J',
            }}
            style={styles.nextImage}
          />
          <View>
            <Text style={[styles.nextLabel, { color: palette.mutedText }]}>Next Step:</Text>
            <Text style={[styles.nextTitle, { color: palette.text }]}>Side Plank</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={palette.mutedText} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  timerText: {
    fontWeight: '600',
  },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: Radii.lg,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  counterWrapper: {
    borderWidth: 2,
    borderRadius: Radii.lg,
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 32,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  nextCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radii.lg,
    padding: 16,
  },
  nextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  nextImage: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
  },
  nextLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nextTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
