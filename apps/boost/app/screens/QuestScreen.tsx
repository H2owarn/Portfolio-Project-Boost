import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";



export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = Colors[useColorScheme() ?? "dark"];
  const [quest, setQuest] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalCount = exercises.length;
  const { exercise } = useLocalSearchParams<{ exercise: string }>();
  const exerciseData = exercise ? JSON.parse(exercise) : null;




  useEffect(() => {
    const loadQuest = async () => {
      if (!id) return;
      setLoading(true);

      // 1️⃣ Fetch quest details
      const { data: questData, error: questErr } = await supabase
        .from("quests")
        .select("*")
        .eq("id", id)
        .single();

      if (questErr) {
        console.error("Quest fetch error:", questErr);
        setLoading(false);
        return;
      }

      setQuest(questData);

      // 2️⃣ Fetch all exercises linked to that quest
      if (questData.exercise_ids && questData.exercise_ids.length > 0) {
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

        if (exErr) {
          console.error("Exercise fetch error:", exErr);
        } else {
          setExercises(exerciseRows);
        }
      }

      setLoading(false);
    };

    loadQuest();
  }, [id]);

  const toggleComplete = (id: string) => {
  setCompletedExercises((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!quest) {
    return (
      <View style={styles.center}>
        <Text style={{ color: palette.text }}>Quest not found.</Text>
      </View>
    );
  }

  const totalXP = exercises.reduce((sum, e) => sum + (e.xp_reward || 0), 0);
  const totalStamina = exercises.reduce((sum, e) => sum + (e.stamina_cost || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.title, { color: palette.text }]}>{quest.name}</Text>
      <Text style={[styles.desc, { color: palette.mutedText }]}>{quest.description}</Text>

      <View style={styles.stats}>
        <Text style={{ color: palette.primary }}><MaterialIcons name="star" size={16} color={palette.primary} /> {totalXP} XP</Text>
        <Text style={{ color: palette.secondary }}><MaterialIcons name="flash-on" size={20} color={palette.primary} /> {totalStamina} Stamina</Text>
      </View>

      <FlatList
  data={exercises}
  keyExtractor={(item) => item.id.toString()}
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
        <MaterialIcons name="fitness-center" size={24} color={palette.primary} />
        <View style={{ marginLeft: 8 }}>
          <Text style={[styles.exerciseName, { color: palette.text }]}>{item.name}</Text>
          <Text style={{ color: palette.mutedText }}>
            {item.primary_muscles?.join(", ")}
          </Text>
        </View>
      </View>

      {/* Right side: checkbox */}
      <View
        onStartShouldSetResponder={(e) => {
          // 👇 Prevent checkbox press from triggering card navigation
          e.stopPropagation();
          return false;
        }}
      >
        <Pressable onPress={() => toggleComplete(item.id)}>
          <MaterialIcons
            name={completedExercises[item.id] ? "check-box" : "check-box-outline-blank"}
            size={26}
            color={completedExercises[item.id] ? palette.primary : palette.mutedText}
          />
        </Pressable>
      </View>
    </Pressable>
  )}
/>

        <Text style={{ textAlign: "center", color: palette.text, marginVertical: 8 }}>
        {completedCount}/{totalCount} exercises completed
        </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
},
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6 },
  desc: {
    fontSize: 14,
    marginBottom: 12
},
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
},
  exerciseCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
},
  exerciseName: {
    fontSize: 16,
    fontWeight: "600"
},
});
