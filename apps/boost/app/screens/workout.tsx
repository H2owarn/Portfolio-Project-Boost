import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WorkoutScreen() {
  const { selectedExercises } = useLocalSearchParams();
  const exercises = selectedExercises ? JSON.parse(selectedExercises) : [];

  const [completed, setCompleted] = useState<{ [key: string]: boolean }>({});

  const toggleComplete = (exercise: string) => {
    setCompleted((prev) => ({
      ...prev,
      [exercise]: !prev[exercise],
    }));
  };

  const handleLogWorkout = () => {
    const done = Object.keys(completed).filter((k) => completed[k]);
    alert(`You logged ${done.length} exercise${done.length !== 1 ? 's' : ''}!`);
    router.push({
      pathname: '/screens/share',
      params: { loggedWorkout: JSON.stringify(done) },
    });
  };

  const renderItem = ({ item }: { item: string }) => {
    const isDone = completed[item];

    return (
      <View style={styles.cardContainer}>
        <View style={[styles.card, isDone && styles.completedCard]}>
          <Text style={styles.exerciseName}>{item}</Text>
          <Text style={styles.details}>Sets: 1–3 | Reps: 6–12</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleComplete(item)}
          >
            <Ionicons
              name={isDone ? 'checkbox' : 'square-outline'}
              size={36}
              color={isDone ? '#37d137' : '#aaa'}
            />
            <Text style={styles.checkboxText}>
              {isDone ? 'Completed' : 'Tap to mark done'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <Text style={styles.title}>Swipe through your workout!</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.logButton} onPress={handleLogWorkout}>
        <Text style={styles.logButtonText}>Log Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 180,
    borderWidth: 2,
    borderColor: 'transparent', 
  },
  completedCard: {
    backgroundColor: '#2e2e2e',
    borderColor: '#37d137', 
  },
  exerciseName: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
  },
  details: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  logButton: {
    backgroundColor: '#37d137',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  logButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
