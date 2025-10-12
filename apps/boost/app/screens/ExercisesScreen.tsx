// app/exercises/ExercisesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { MUSCLE_GROUPS } from "@/utils/muscle-group";
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
}


export default function ExercisesScreen() {
  const params = useLocalSearchParams();
  const palette = Colors[useColorScheme() ?? 'dark'];
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);

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

      // Fetch exercises from Supabase
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

      // Filter by expanded group muscles
      const filtered = data.filter((ex: Exercise) =>
        ex.primary_muscles?.some(m => expandedMuscles.includes(m.toLowerCase()))
      );

      setExercises(filtered);
      setFilteredExercises(filtered);

      // Extract unique levels and categories for filters
      const levels = [...new Set(filtered.map(ex => ex.level).filter(Boolean))] as string[];
      const categories = [...new Set(filtered.map(ex => ex.category).filter(Boolean))] as string[];
      setAvailableLevels(levels);
      setAvailableCategories(categories);

      setLoading(false);
    };

    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.selectedMuscles]);

  // Filter exercises when level or category changes
  useEffect(() => {
    let filtered = exercises;

    if (selectedLevel) {
      filtered = filtered.filter(ex => ex.level === selectedLevel);
    }

    if (selectedCategory) {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    setFilteredExercises(filtered);
  }, [exercises, selectedLevel, selectedCategory]);

  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable
      style={[
        styles.filterChip,
        isSelected
          ? { backgroundColor: palette.primary }
          : { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.borderColor }
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
        // Navigate to exercise in progress screen
        router.push({
          pathname: '/screens/ExerciseInProgressScreen' as any,
          params: {
            exercise: JSON.stringify(item)
          }
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
              <Text style={[styles.specText, { color: palette.primary }]}>{item.stamina_cost} </Text>
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

  return (
    <>
      <Stack.Screen options={{ title: 'Recommended Exercises' }} />
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
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
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
    paddingHorizontal: Spacing.lg
  },
  exerciseCard: {
    padding: 16,
    borderRadius: Radii.lg,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12
  },
  cardContent: {
    gap: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center'
  },
  exerciseInfo: {
    flex: 1,
    gap: 4
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600'
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20
  },
  exerciseSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    gap: 4
  },
  specText: {
    fontSize: 12,
    fontWeight: '500'
  },
  filtersSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    gap: Spacing.md
  },
  filterGroup: {
    gap: Spacing.xs
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  filterChips: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500'
  }
});
