// app/exercises/ExercisesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Sample exercises database
const exercisesDB = [
  { id: 1, name: "Crunches", muscles: ["Abs"] },
  { id: 2, name: "Bench Press", muscles: ["Chest", "Shoulders"] },
  { id: 3, name: "Pull Ups", muscles: ["Back", "Biceps"] },
  { id: 4, name: "Squats", muscles: ["Legs"] },
  { id: 5, name: "Shoulder Press", muscles: ["Shoulders"] },
];

export default function ExercisesScreen() {
  const params = useLocalSearchParams();

  // Parse selectedMuscles safely
  let selectedMuscles: { [page: number]: string[] } = {};
  try {
    if (params.selectedMuscles) {
      selectedMuscles = typeof params.selectedMuscles === 'string'
        ? JSON.parse(params.selectedMuscles)
        : params.selectedMuscles;
    }
  } catch (err) {
    console.warn('Failed to parse selectedMuscles:', err);
    selectedMuscles = {};
  }

  // Flatten selections and extract muscle names (before the '-' in uniqueId)
  const selectedNames = Object.values(selectedMuscles)
    .flat()
    .map((id: string) => id.split('-')[0]);

  // Filter exercises that target selected muscles
  const recommendedExercises = exercisesDB.filter(exercise =>
    exercise.muscles.some(muscle => selectedNames.includes(muscle))
  );

  const renderExercise = ({ item }: { item: typeof exercisesDB[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.muscles}>
        Targets: {item.muscles.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Exercises</Text>
      {recommendedExercises.length === 0 ? (
        <Text>No exercises found for the selected muscles.</Text>
      ) : (
        <FlatList
          data={recommendedExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExercise}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  muscles: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
