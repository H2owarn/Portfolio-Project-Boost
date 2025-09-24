import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MUSCLES, type Muscle } from '@/constants/exercise-data';

export default function ExercisesScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  const handleMusclePress = (muscle: Muscle) => {
    router.push(`/(tabs)/exercises/${muscle.id}` as const);
  };

  const renderMuscleCard = ({ item }: { item: Muscle }) => (
    <Pressable
      style={[styles.muscleCard, { backgroundColor: palette.surface }]}
      onPress={() => handleMusclePress(item)}
      android_ripple={{ color: palette.primary + '20' }}
    >
      <View style={[styles.cardIcon, { backgroundColor: palette.primary + '20' }]}>
        <MaterialIcons 
          name={item.icon as any} 
          size={32} 
          color={palette.primary} 
        />
      </View>
      <Text style={[styles.cardTitle, { color: palette.text }]}>
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>
          Choose Muscle Group
        </Text>
        <Text style={[styles.subtitle, { color: palette.mutedText }]}>
          Select a muscle group to see exercises
        </Text>
      </View>
      
      <FlatList
        data={MUSCLES}
        renderItem={renderMuscleCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  muscleCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 20,
    borderRadius: Radii.lg,
    alignItems: 'center',
    gap: 12,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
