// app/exercises/ExercisesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { MUSCLE_GROUPS } from "@/utils/muscle-group";
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useXp } from '@/contexts/Xpcontext';

type Exercise = {
  id: number;
  name: string;
  primary_muscles: string[];
  secondary_muscles?: string[];
  instructions?: string[];
  level?: string;
  category?: string;
  images?: string[];
  xp_reward?: number;
  stamina_cost?: number;
};

export default function ExercisesScreen() {
  const params = useLocalSearchParams();
  const palette = Colors[useColorScheme() ?? 'dark'];
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const { addXp } = useXp();

  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  // Parse selectedMuscles safely
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

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);

      const selectedNames = Object.values(selectedMuscles)
        .flat()
        .map((id: string) => id.split('-')[0].toLowerCase());

      const expandedMuscles = selectedNames.flatMap(name => {
        if (MUSCLE_GROUPS[name]) {
          return MUSCLE_GROUPS[name].map(m => m.toLowerCase());
        }
        return [name];
      });

      const { data, error } = await supabase
        .from('exercises')
        .select('id, name, primary_muscles, secondary_muscles, instructions, level, category, images, xp_reward, stamina_cost');

      if (error) {
        console.error('Error fetching exercises:', error);
        setExercises([]);
        setFilteredExercises([]);
        setLoading(false);
        return;
      }

      const filtered = data.filter((ex: Exercise) =>
        ex.primary_muscles?.some(m => expandedMuscles.includes(m.toLowerCase()))
      );

      setExercises(filtered);
      setFilteredExercises(filtered);

      const levels = [...new Set(filtered.map(ex => ex.level).filter(Boolean))] as string[];
      const categories = [...new Set(filtered.map(ex => ex.category).filter(Boolean))] as string[];
      setAvailableLevels(levels);
      setAvailableCategories(categories);

      setLoading(false);
    };

    fetchExercises();
  }, [params.selectedMuscles]);

  useEffect(() => {
    let filtered = exercises;

    if (selectedLevel) {
      filtered = filtered.filter(ex => ex.level === selectedLevel);
    }

    if (selectedCategory) {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    if (searchText.trim() !== '') {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(lowerSearch) ||
        ex.primary_muscles.some(m => m.toLowerCase().includes(lowerSearch)) ||
        (ex.secondary_muscles?.some(m => m.toLowerCase().includes(lowerSearch)) ?? false)
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, selectedLevel, selectedCategory, searchText]);

  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable
      style={[
        styles.filterChip,
        {
          backgroundColor: isSelected ? palette.primary : palette.surface,
          borderWidth: 1,
          borderColor: palette.borderColor
        }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: isSelected ? '#000' : palette.text }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <Pressable
      style={[styles.exerciseCard, { backgroundColor: palette.surface }]}
      android_ripple={{ color: palette.primary + '20' }}
      onPress={() => {
        router.push({
          pathname: '/screens/ExerciseInProgressScreen' as any,
          params: { exercise: JSON.stringify(item) }
        });
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.exerciseIcon, { backgroundColor: palette.primary + '20' }]}>
            <MaterialIcons name="fitness-center" size={24} color={palette.primary} />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: palette.text }]}>{item.name}</Text>
            <Text style={[styles.exerciseDescription, { color: palette.mutedText }]}>
              {item.primary_muscles.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.exerciseSpecs}>
          {item.xp_reward && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <MaterialIcons name="diamond" size={12} color={palette.primary} />
              <Text style={[styles.specText, { color: palette.primary }]}>{item.xp_reward} XP</Text>
            </View>
          )}
          {item.stamina_cost && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <MaterialIcons name="bolt" size={12} color={palette.primary} />
              <Text style={[styles.specText, { color: palette.primary }]}>{item.stamina_cost}</Text>
            </View>
          )}
          {item.level && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <MaterialIcons name="signal-cellular-alt" size={12} color={palette.primary} />
              <Text style={[styles.specText, { color: palette.primary }]}>{item.level}</Text>
            </View>
          )}
          {item.category && (
            <View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
              <MaterialIcons name="category" size={12} color={palette.primary} />
              <Text style={[styles.specText, { color: palette.primary }]}>{item.category}</Text>
            </View>
          )}
          {item.secondary_muscles && item.secondary_muscles.map((muscle, index) => (
            <View key={index} style={[styles.specBadge, { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.borderColorAlt }]}>
              <Text style={[styles.specText, { color: palette.mutedText }]}>{muscle}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );

  const handleFinishWorkout = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // Get all completed exercises for the user (e.g., for today)
    const { data: completed, error: completedErr } = await supabase
      .from("completed_exercises")
      .select("id, exercise_id")
      .eq("user_id", user.id)
      .eq("claimed", false);


    if (completedErr) throw completedErr;
    if (!completed?.length) {
      Alert.alert("No completed exercises", "Do some exercises first!");
      return;
    }

    // Get XP rewards for those exercises
    const ids = completed.map((c) => c.exercise_id);
    const { data: exercises, error: exErr } = await supabase
      .from("exercises")
      .select("id, xp_reward")
      .in("id", ids);

    if (exErr || !exercises?.length) throw exErr;

    //  Calculate total XP
    const totalXp = exercises.reduce((sum, ex) => sum + ex.xp_reward, 0);

    //  Add XP in one go
    await addXp(totalXp);

    Alert.alert(
      "🎉 Workout Complete!",
      `You earned a total of +${totalXp} XP!`,
      [{ text: "OK", onPress: () => router.push('/home') }]
    );


    // update claimed to TRUE
    const completedIds = completed.map((c) => c.id);

    await supabase
      .from("completed_exercises")
      .update({ claimed: true })
      .in("id", completedIds);

  } catch (err) {
    console.error("Error finishing workout:", err);
    Alert.alert("❌ Error", "Could not finish workout.");
  }



};


  return (
    <>
      <Stack.Screen options={{ title: 'Recommended Exercises', headerShown: false }} />
      <Screen scrollable={false} contentStyle={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="search-off" size={48} color={palette.mutedText} />
            <Text style={[styles.errorText, { color: palette.mutedText }]}>
              No exercises found for the selected muscles.
            </Text>
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
              <TextInput
                style={{
                  backgroundColor: palette.surface,
                  color: palette.text,
                  borderRadius: Radii.md,
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                  borderWidth: 1,
                  borderColor: palette.borderColor,
                }}
                placeholder="Search exercises..."
                placeholderTextColor={palette.mutedText}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* Filters Section */}
            {(availableLevels.length > 0 || availableCategories.length > 0) && (
              <View style={styles.filtersSection}>
                {availableLevels.length > 0 && (
                  <View style={styles.filterGroup}>
                    <Text style={[styles.filterLabel, { color: palette.mutedText }]}>Level</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterChips}
                    >
                      {availableLevels.map(level => (
                        <View key={`level-${level}`}>
                          {renderFilterChip(
                            level,
                            selectedLevel === level,
                            () => setSelectedLevel(selectedLevel === level ? null : level)
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {availableCategories.length > 0 && (
                  <View style={styles.filterGroup}>
                    <Text style={[styles.filterLabel, { color: palette.mutedText }]}>Category</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterChips}
                    >
                      {availableCategories.map(category => (
                        <View key={`category-${category}`}>
                          {renderFilterChip(
                            category,
                            selectedCategory === category,
                            () => setSelectedCategory(selectedCategory === category ? null : category)
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ ...styles.list, paddingBottom: 120 }} // extra space for floating button
              showsVerticalScrollIndicator={false}
            />

            {/* Floating Finish Workout Button */}
            <Pressable
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                zIndex: 20,
                backgroundColor: palette.primary,
                borderRadius: Radii.lg,
                paddingVertical: 16,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 6,
              }}
              onPress={async () => {
                await handleFinishWorkout();
                router.push('/screens/share');
              }}
            >
              <MaterialIcons name="check-circle" size={24} color="#000" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
                Finish Workout
              </Text>
            </Pressable>
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: Radii.lg,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    gap: 4,
  },
  specText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filtersSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  filterGroup: {
    gap: Spacing.xs,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChips: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
