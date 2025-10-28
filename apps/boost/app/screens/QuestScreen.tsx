import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useXp } from '@/contexts/Xpcontext';
import { useStamina } from '@/contexts/Staminacontext';
import { playPreloaded, playSound } from "@/utils/sound";

export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = Colors[useColorScheme() ?? "dark"];
  const [quest, setQuest] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const { addXp } = useXp();
  const { spendStamina } = useStamina();
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalCount = exercises.length;

  // ✅ guard so completion runs only once (prevents double sound + double alert)
  const completingQuestRef = useRef(false);

  // ✅ Fetch quest + exercise info
  const loadQuest = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      const { data: questData, error: questErr } = await supabase
        .from("quests")
        .select("*")
        .eq("id", id)
        .single();
      if (questErr) throw questErr;
      setQuest(questData);

      if (questData.exercise_ids?.length > 0) {
        const { data: exerciseRows, error: exErr } = await supabase
          .from("exercises")
          .select("id, name, xp_reward, stamina_cost, primary_muscles, level, category, images")
          .in("id", questData.exercise_ids);
        if (exErr) throw exErr;
        setExercises(exerciseRows);
      } else {
        setExercises([]);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progress } = await supabase
          .from("completed_quest_exercises")
          .select("exercise_id")
          .eq("user_id", user.id)
          .eq("quest_id", id);

        if (progress) {
          const map: Record<string, boolean> = {};
          progress.forEach((p) => { map[p.exercise_id] = true; });
          setCompletedExercises(map);
        } else {
          setCompletedExercises({});
        }
      }
    } catch (error) {
      console.error("Error loading quest:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ Re-fetch when user comes back from QuestExerciseScreen
  useFocusEffect(
    React.useCallback(() => {
      loadQuest();
    }, [loadQuest])
  );

  // ✅ Single effect to decide completion (remove duplicates)
  useEffect(() => {
    if (!exercises.length) return;
    const allDone = exercises.every(e => completedExercises[e.id]);
    if (allDone && !completingQuestRef.current) {
      handleQuestComplete();
    }
  }, [exercises, completedExercises]);

  const handleQuestComplete = async () => {
    if (!quest) return;
    if (completingQuestRef.current) return; // ✅ guard re-entry
    completingQuestRef.current = true;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Login required");
        return;
      }

      await supabase
        .from("user_quests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("quest_id", quest.id);

      await supabase.from("completed_quests").insert({
        user_id: user.id,
        quest_id: quest.id,
      });

      await spendStamina(quest.stamina_cost ?? 0);
      await addXp(quest.xp_reward ?? 0);

      // 🎵 play success sound ONCE
      try {
        await playPreloaded("complete");
      } catch {
        await playSound(require("@/assets/sound/completed.wav"));
      }


      // Optional level recalc
      try {
        await supabase.rpc("calculate_level", { user_id: user.id });
      } catch (error: any) {
        console.log("Skipping level recalc (no RPC)");
      }

      Alert.alert(
        "🎉 Quest Complete!",
        `You earned ${quest.xp_reward ?? 0} XP and used ${quest.stamina_cost ?? 0} stamina.`,
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                await playPreloaded("click");
              } catch {
                await playSound(require("@/assets/sound/tap.wav"));
              }
              router.replace("/(tabs)/quest");
            },
          },
        ]
      );
    } catch (err) {
      console.error("Quest completion error:", err);
      Alert.alert("Error", "Could not complete quest.");
      // If you want to allow re-try on error, you can reset guard here:
      // completingQuestRef.current = false;
    }
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


  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.title, { color: palette.text }]}>{quest.name}</Text>
      <Text style={[styles.desc, { color: palette.mutedText }]}>{quest.description}</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
              style={[styles.exerciseCard, { backgroundColor: palette.surface }]}
              onPress={async () => {
                try {
                  await playPreloaded('click');
                } catch {
                  await playSound(require('@/assets/sound/tap.wav')); // fallback
                }

                router.push({
                  pathname: '/screens/QuestExerciseScreen',
                  params: { exercise: JSON.stringify(item), quest_id: quest.id },
                });
              }}
            >
            <View style={styles.row}>
              <MaterialIcons name="fitness-center" size={24} color={palette.primary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.exerciseName, { color: palette.text }]}>{item.name}</Text>
                <Text style={{ color: palette.mutedText }}>
                  {item.primary_muscles?.join(", ")}
                </Text>
              </View>
            </View>

          <Pressable
            onPress={async () => {
              try {
                await playPreloaded("click");
              } catch {
                await playSound(require('@/assets/sound/tap.wav'));
              }

              setCompletedExercises((prev) => ({
                ...prev,
                [item.id]: !prev[item.id], // toggle checkbox
              }));
            }}
          >
            <MaterialIcons
              name={
                completedExercises[item.id]
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={26}
              color={
                completedExercises[item.id]
                  ? palette.primary
                  : palette.mutedText
              }
            />
          </Pressable>

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
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  desc: { fontSize: 14, marginBottom: 12 },
  exerciseCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", flex: 1 },
  exerciseName: { fontSize: 16, fontWeight: "600" },
});
