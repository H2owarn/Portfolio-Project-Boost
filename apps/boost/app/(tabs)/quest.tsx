import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { supabase } from "@/lib/supabase";

export default function QuestScreen() {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error("User error:", userErr);
        return;
      }
      if (!user) {
        console.warn("No logged in user");
        return;
      }

      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        return;
      }

      setProfile(profileData);
    };

    loadProfile();
  }, []);

  // Load quests
  useEffect(() => {
    if (!profile) return;

    const loadQuests = async () => {
      const { data: activeQuests, error: uqErr } = await supabase
        .from("user_quests")
        .select(`
          quest_id,
          quests(*)
        `)
        .eq("user_id", profile.id)
        .eq("status", "active")
        .gte(
          "assigned_at",
          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (uqErr) {
        console.error("User quests fetch error:", uqErr);
        return;
      }

      let questsList: any[] = [];

      if (activeQuests && activeQuests.length > 0) {
        // use existing quests
        questsList = activeQuests.map((uq) => ({
          ...uq.quests, // flatten quest fields
        }));
      } else {
        // pick new random quests
        const { data: questRows, error } = await supabase
          .from("quests")
          .select("*")
          .lte("min_level", profile.level)
          .gte("max_level", profile.level);

        if (error) {
          console.error("Quest fetch error:", error);
          return;
        }

        const mains = questRows.filter((q) => q.quest_type === "main");
        const sides = questRows.filter((q) => q.quest_type === "side");
        const pickRandom = (arr: any[], n: number) =>
          arr.sort(() => 0.5 - Math.random()).slice(0, n);

        questsList = [...pickRandom(mains, 3), ...pickRandom(sides, 2)];

        const insertPayload = questsList.map((q) => ({
          user_id: profile.id,
          quest_id: q.id,
          status: "active",
          assigned_at: new Date().toISOString(),
        }));

        await supabase.from("user_quests").insert(insertPayload);
      }

      // fetch exercise names
      const allExerciseIds = questsList.flatMap((q) => q.exercise_ids || []);
      let exerciseMap = new Map<number, string>();

      if (allExerciseIds.length > 0) {
        const { data: exerciseRows, error: exErr } = await supabase
          .from("exercises")
          .select("id, name")
          .in("id", allExerciseIds);

        if (exErr) {
          console.error("Exercise fetch error:", exErr);
        } else {
          exerciseMap = new Map(exerciseRows.map((ex) => [ex.id, ex.name]));
        }
      }

      const questsWithExercises = questsList.map((q) => ({
        ...q,
        exercises: (q.exercise_ids || []).map(
          (id: number) => exerciseMap.get(id) || `Exercise ${id}`
        ),
      }));

      setQuests(questsWithExercises);
      setLoading(false);
    };

    loadQuests();
  }, [profile]);

  if (loading) {
    return <Text style={{ color: "#fff" }}>Loading quests…</Text>;
  }

  const userLevel = profile?.level ?? 1;
  const userStamina = 40;

  const mainQuests = quests.filter((q) => q.quest_type?.toLowerCase() === "main");
  const sideQuests = quests.filter((q) => q.quest_type?.toLowerCase() === "side");


  const canStartQuest = (quest: any) =>
    userStamina >= (quest.stamina_cost ?? 0) &&
    userLevel >= (quest.min_level ?? 0) &&
    (quest.max_level == null || userLevel <= quest.max_level);

  const QuestCard = ({ quest }: { quest: any }) => {
    const canStart = canStartQuest(quest);
    const isLocked = userLevel < (quest.min_level ?? 0);
    const exerciseNames: string[] = Array.isArray(quest.exercises)
      ? quest.exercises
      : [];

    return (
      <View style={[styles.card, !canStart && { opacity: 0.6 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>
            {quest.quest_type === "main" ? "⚔️" : "⭐"}
          </Text>
          <Text style={styles.cardTitle}>{quest.name}</Text>
          {isLocked && (
            <View style={styles.lockedTag}>
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          )}
        </View>

        {!!quest.description && (
          <Text style={styles.description}>{quest.description}</Text>
        )}

        <View style={styles.tagsRow}>
          <Text style={styles.tag}>⚡ {quest.xp_reward ?? 0} XP</Text>
        </View>

        <View style={styles.exercisesBox}>
          <Text style={styles.exercisesTitle}>Exercises:</Text>
          <View style={styles.exercisesRow}>
            {exerciseNames.length > 0 ? (
              exerciseNames.map((ex, i) => (
                <Text key={`${quest.id}-ex-${i}`} style={styles.exercise}>
                  {ex}
                </Text>
              ))
            ) : (
              <Text style={styles.exercise}>—</Text>
            )}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.stamina}>
            Stamina Cost: {quest.stamina_cost ?? 0}
          </Text>
          <Pressable
            style={[
              styles.startButton,
              { backgroundColor: canStart ? "#007bff" : "#ccc" },
            ]}
            disabled={!canStart}
            onPress={() => console.log("Quest Selected:", quest.name)}
          >
            <Text style={styles.startButtonText}>
              {isLocked
                ? `Level ${quest.min_level ?? 0} Required`
                : userStamina < quest.stamina_cost
                ? "Not Enough Stamina"
                : "Start Quest"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentInset={{ top: 45 }} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Quest</Text>
      </View>

      <Text style={styles.sectionTitle}>⚔️ Main Quests</Text>
      {mainQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}

      <Text style={styles.sectionTitle}>⭐ Side Quests</Text>
      {sideQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1b2a", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  icon: { fontSize: 20, marginRight: 8 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "600" },
  lockedTag: {
    backgroundColor: "#f8d7da",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockedText: { color: "#721c24", fontSize: 12, fontWeight: "600" },
  description: { fontSize: 14, color: "#555", marginBottom: 8 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  tag: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    marginRight: 6,
  },
  exercisesBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  exercisesTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  exercisesRow: { flexDirection: "row", flexWrap: "wrap" },
  exercise: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stamina: { fontSize: 13, color: "#666" },
  startButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  startButtonText: { color: "#fff", fontWeight: "600" },
});
