// app/exercises/ExercisesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MUSCLE_GROUPS } from "@/utils/muscle-group";;

type Exercise = {
  id: number;
  name: string;
  primary_muscles: string[];
}


export default function ExercisesScreen() {
  const params = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

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
    .map((id: string) => id.split('-')[0].toLowerCase());

  // Expand selections: if it's a group key, expand, otherwise keep the muscle itself
  const expandedMuscles = selectedNames.flatMap(name => {
    if (MUSCLE_GROUPS[name]) {
      return MUSCLE_GROUPS[name].map(m => m.toLowerCase());  // expand group → muscles
    }
    return [name]; // keep single muscle
  });

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);

      // Fetch exercises from Supabase
      const { data, error } = await supabase
        .from('exercises')
        .select('id, name, primary_muscles, secondary_muscles');

      if (error) {
        console.error('Error fetching exercises:', error);
        setExercises([]);
        setLoading(false);
        return;
      }

      // Filter by expanded group muscles
      const filtered = data.filter((ex: Exercise) =>
        ex.primary_muscles?.some(m => expandedMuscles.includes(m.toLowerCase()))
      );

      setExercises(filtered);
      setLoading(false);
    };

    fetchExercises();
  }, [params.selectedMuscles]);

  const renderExercise = ({ item }: { item: Exercise }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.muscles}>
        {item.primary_muscles}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Exercises</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : exercises.length === 0 ? (
        <Text>No exercises found for the selected muscles.</Text>
      ) : (
        <FlatList
          data={exercises}
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
