import { useLocalSearchParams, router, Stack } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, } from "react-native";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFocusEffect } from "@react-navigation/native";
import { useXp } from "@/contexts/Xpcontext";
import { useStamina } from "@/contexts/Staminacontext";




export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = Colors[useColorScheme() ?? "dark"];
  const [quest, setQuest] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalCount = exercises.length;
  const { xp, addXp } = useXp();
  const { stamina, spendStamina } = useStamina();



  
  useFocusEffect(
    useCallback(() => {
    let isActive = true;

    const loadQuest = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const { data: questData, error: questErr } = await supabase
          .from("quests")
          .select("*")
          .eq("id", id)
          .single();

        if (questErr) throw questErr;

        if (!isActive) return;
        setQuest(questData);

        if (questData.exercise_ids?.length > 0) {
          const { data: exerciseRows, error: exErr } = await supabase
            .from("exercises")
            .select(`
              id,
              name,
              primary_muscles,
              level,
              category,
              xp_reward,
              stamina_cost,
              images,
              instructions
            `)
            .in("id", questData.exercise_ids);

          if (exErr) throw exErr;
          if (isActive) setExercises(exerciseRows);
        }
      } catch (err) {
        console.error("Quest fetch error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadQuest();

    return () => {
      isActive = false;
    };
  }, [id])
);

  const toggleComplete = (id: string) => {
  setCompletedExercises((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};



  if (!quest) {
    return (
      <View style={styles.center}>
        <Text style={{ color: palette.text }}>Quest not found.</Text>
      </View>
    );
  }

  return (
  <>
    <Stack.Screen options={{ title: 'Quest Details', headerBackTitle: 'Back' }} />

    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Header Card */}
      <View style={[styles.header, { backgroundColor: palette.surface }]}>
        <Text style={[styles.title, { color: palette.text }]}>{quest.name}</Text>
        <Text style={[styles.desc, { color: palette.mutedText }]}>{quest.description}</Text>

        <View style={styles.stats}>
          <View style={[styles.statBadge, { backgroundColor: palette.primary + "20" }]}>
            <MaterialIcons name="star" size={18} color={palette.primary} />
            <Text style={[styles.statText, { color: palette.primary }]}>{quest?.xp_reward} XP</Text>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={[styles.progressSection, { backgroundColor: palette.surface }]}>
        <Text style={[styles.progressText, { color: palette.text }]}>
          {completedCount}/{totalCount} exercises completed
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: palette.primary,
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Exercises List */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.exerciseCard, { backgroundColor: palette.surface }]}
            onPress={() =>
              router.push({
                pathname: "/screens/QuestExerciseScreen",
                params: {
                  exercise: JSON.stringify(item),
                  quest_id: quest.id,
                },
              })
            }
          >
            {/* Left side: exercise info */}
            <View style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: palette.primary + "15" }]}>
                <MaterialIcons name="fitness-center" size={20} color={palette.primary} />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, { color: palette.text }]}>{item.name}</Text>
                <Text style={[styles.muscleText, { color: palette.mutedText }]}>
                  {item.primary_muscles?.join(", ")}
                </Text>
              </View>
            </View>

            {/* Right side: checkbox */}
            <View
              onStartShouldSetResponder={(e) => {
                e.stopPropagation();
                return false;
              }}
            >
              <Pressable onPress={() => toggleComplete(item.id)}>
                <MaterialIcons
                  name={completedExercises[item.id] ? "check-box" : "check-box-outline-blank"}
                  size={28}
                  color={completedExercises[item.id] ? palette.primary : palette.mutedText}
                />
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* Complete Workout Button */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Pressable
          style={[
            styles.completeButton,
            { backgroundColor: completedCount === totalCount ? palette.primary : "#555" },
          ]}
          onPress={async () => {
            if (completedCount < totalCount) {
              alert("You must complete all exercises before finishing the workout!");
              return;
            }

            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return alert("Please log in to save progress.");

              await supabase
                .from("user_quests")
                .update({ status: "completed", completed_at: new Date().toISOString() })
                .eq("user_id", user.id)
                .eq("quest_id", quest.id);

                addXp(quest.xp_reward);
                await spendStamina(quest.stamina_cost);

              alert(`Quest complete!\n+${quest.xp_reward} XP -${quest.stamina_cost} Stamina`);
              router.back();
            } catch (err) {
              console.error(err);
              alert("Error marking quest complete.");
            }
          }}
        >
          <MaterialIcons name="check-circle" size={24} color="#000" />
          <Text style={styles.completeText}>Complete Workout</Text>
        </Pressable>
      </View>
    </View>
  </>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 10,
    marginBottom: 16,
    ...Shadow.card,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.md,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressSection: {
    borderRadius: Radii.lg,
    padding: 16,
    marginBottom: 16,
    gap: 10,
    ...Shadow.card,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    gap: 12,
  },
  exerciseCard: {
    borderRadius: Radii.lg,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  muscleText: {
    fontSize: 13,
    opacity: 0.7,
  },
  completeButton: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
  gap: 8,
  marginBottom: 30,
},
completeText: {
  fontSize: 18,
  fontWeight: "700",
  color: "#000",
},

});