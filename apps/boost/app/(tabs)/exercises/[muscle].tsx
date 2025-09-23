import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getExercisesForMuscle, getMuscleById, type Exercise } from '@/constants/exercise-data';

export default function MuscleExercisesScreen() {
  const { muscle } = useLocalSearchParams<{ muscle: string }>();
  const palette = Colors[useColorScheme() ?? 'dark'];
  
  const selectedMuscle = getMuscleById(muscle);
  const exercises = getExercisesForMuscle(muscle);

  if (!selectedMuscle) {
    return (
      <Screen scrollable={false} contentStyle={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={palette.mutedText} />
          <Text style={[styles.errorText, { color: palette.mutedText }]}>
            Muscle group not found
          </Text>
        </View>
      </Screen>
    );
  }

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <Pressable
      style={[styles.exerciseCard, { backgroundColor: palette.surface }]}
      android_ripple={{ color: palette.primary + '20' }}
      onPress={() => {
        // Future: Navigate to exercise detail or start workout
        console.log('Selected exercise:', item.name);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.exerciseIcon, { backgroundColor: palette.primary + '20' }]}>
            <MaterialIcons 
              name="fitness-center" 
              size={24} 
              color={palette.primary} 
            />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: palette.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.exerciseDescription, { color: palette.mutedText }]}>
              {item.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.exerciseSpecs}>
          {item.sets && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <Text style={[styles.specText, { color: palette.primary }]}>
                {item.sets} sets
              </Text>
            </View>
          )}
          {item.reps && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <Text style={[styles.specText, { color: palette.primary }]}>
                {item.reps} reps
              </Text>
            </View>
          )}
          {item.duration && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <Text style={[styles.specText, { color: palette.primary }]}>
                {item.duration}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>
          {selectedMuscle.name} Exercises
        </Text>
        <Text style={[styles.subtitle, { color: palette.mutedText }]}>
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} available
        </Text>
      </View>
      
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
    marginBottom: 24,
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
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: Radii.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  exerciseSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  specText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
  },
});