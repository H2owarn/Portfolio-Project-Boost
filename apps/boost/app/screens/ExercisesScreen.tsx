import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const exercisesDB = [
  { id: 1, name: "Crunches", muscles: ["Abs"] },
  { id: 2, name: "Bench Press", muscles: ["Chest", "Shoulders"] },
  { id: 3, name: "Pull Ups", muscles: ["Back", "Biceps"] },
  { id: 4, name: "Squats", muscles: ["Legs"] },
  { id: 5, name: "Shoulder Press", muscles: ["Shoulders"] },
];

export default function ExercisesScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<{ [id: number]: boolean }>({});


  let selectedMuscles: { [page: number]: string[] } = {};
  try {
    if (params.selectedMuscles) {
      selectedMuscles =
        typeof params.selectedMuscles === 'string'
          ? JSON.parse(params.selectedMuscles)
          : params.selectedMuscles;
    }
  } catch (err) {
    console.warn('Failed to parse selectedMuscles:', err);
    selectedMuscles = {};
  }


  const selectedNames = Object.values(selectedMuscles)
    .flat()
    .map((id: string) => id.split('-')[0]);


  const recommendedExercises = exercisesDB.filter(ex =>
    ex.muscles.some(muscle => selectedNames.includes(muscle))
  );

  const toggleExercise = (id: number) => {
    setSelectedExercises(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContinue = () => {
    const selected = recommendedExercises
      .filter(ex => selectedExercises[ex.id])
      .map(ex => ex.name);

    router.push({
      pathname: '/screens/workout',
      params: { selectedExercises: JSON.stringify(selected) },
    });
  };

  const renderItem = ({ item }: { item: typeof exercisesDB[0] }) => {
    const isSelected = selectedExercises[item.id];
    return (
      <TouchableOpacity
        style={[styles.exerciseItem, isSelected && styles.selectedItem]}
        onPress={() => toggleExercise(item.id)}
      >
        <View style={styles.row}>
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isSelected ? '#37d137' : '#aaa'}
          />
          <View style={styles.textWrapper}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.placeholder}>Targets: {item.muscles.join(', ')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Recommended Exercises</Text>

      <FlatList
        data={recommendedExercises}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={[
          styles.mainButton,
          { opacity: Object.values(selectedExercises).some(Boolean) ? 1 : 0.6 },
        ]}
        disabled={!Object.values(selectedExercises).some(Boolean)}
        onPress={handleContinue}
      >
        <Text style={styles.mainButtonText}>View Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 120,
  },

  // ✅ Typography
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    color: '#999',
    marginTop: 4,
    fontSize: 14,
  },

  // ✅ Exercise cards
  exerciseItem: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedItem: {
    backgroundColor: '#2a2a2a',
    borderColor: '#37d137',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    marginLeft: 10,
  },

  mainButton: {
    backgroundColor: '#37d137',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  mainButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
