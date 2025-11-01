import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors, Shadow, Radii, Spacing, Font} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { color } from "bun";
import { playPreloaded, preloadSounds } from "@/utils/sound";


export default function QuestScreen() {
  const palette = Colors[useColorScheme() ?? "dark"];
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Load profile
  useEffect(() => {
    preloadSounds();
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

    for (const q of insertPayload) {
      const { data: existing, error: selectErr } = await supabase
        .from("user_quests")
        .select("user_id, quest_id, status")
        .eq("user_id", q.user_id)
        .eq("quest_id", q.quest_id)
        .maybeSingle();

      if (selectErr) {
        console.error("Select error:", selectErr);
        continue;
      }

      if (!existing) {
        // Only insert if not exists
        const { error: insertErr } = await supabase
          .from("user_quests")
          .insert(q);

        if (insertErr) console.error("Insert error:", insertErr);
      } else {
        console.log(`Skipping duplicate quest ${q.quest_id} (already exists)`);
      }
    }


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
    return <Text style={{ color: palette.text }}>Loading quests…</Text>;
  }

  const userLevel = profile?.level ?? 1;
  const userStamina = 40;

  const mainQuests = quests.filter((q) => q.quest_type?.toLowerCase() === "main");
  const sideQuests = quests.filter((q) => q.quest_type?.toLowerCase() === "side");

  const QuestCard = ({ quest }: { quest: any }) => {
    const isLocked = userLevel < (quest.min_level ?? 0);
    const exerciseNames: string[] = Array.isArray(quest.exercises)
      ? quest.exercises
      : [];

    return (
      <View style={[styles.questCard, { backgroundColor: palette.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>
            {quest.quest_type === "main" ? "⚔️" : "⭐"}
          </Text>
          <Text style={[styles.questName, { color: palette.text }]}>{quest.name}</Text>
          {isLocked && (
            <View style={[styles.lockedTag, { backgroundColor: palette.errorTransparent }]}>
              <Text style={[styles.lockedText, { color: palette.error }]}>Locked</Text>
            </View>
          )}
        </View>

        {!!quest.description && (
          <Text style={[styles.description, {color: palette.text}]}>{quest.description}</Text>
        )}

        <View style={styles.questSpecs}>
          <View style={[styles.tagsRow, { backgroundColor: palette.primary + "20" }]}>
            <MaterialIcons name="diamond" size={12} color={palette.primary} />
            <Text style={[styles.specText, { color: palette.primary }]}>
              {quest.xp_reward ?? 0} XP
            </Text>
          </View>
        </View>

        <View style={[styles.exercisesBox, {backgroundColor: palette.surfaceElevated}]}>
          <Text style={[styles.exercisesTitle, {color: palette.text}]}>Exercises:</Text>
          <View style={styles.questSpecs}>
            {exerciseNames.length > 0 ? (
              exerciseNames.map((ex, i) => (
                <Text
                  key={`${quest.id}-ex-${i}`}
                  style={[
                    styles.exercise,
                    { color: palette.primary },
                    { backgroundColor: palette.primary + "20" },
                  ]}
                >
                  {ex}
                </Text>
              ))
            ) : (
              <Text style={styles.exercise}>—</Text>
            )}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.stamina, {color: palette.primary}]}>
            Stamina Cost: <MaterialIcons name="bolt" size={12} color={palette.primary} /> {quest.stamina_cost ?? 0}
          </Text>
          <Pressable
            style={[
              styles.startButton,
              { backgroundColor: palette.primary }
            ]}
            android_ripple={{ color: palette.secondary + "20" }}
            onPress={() => {
              playPreloaded("click");

              !isLocked && userStamina >= (quest.stamina_cost ?? 0)
                ? router.push({
                    pathname: '/screens/QuestScreen',
                    params: { id: quest.id.toString() }, // 👈 pass quest ID
                  })
                : console.log("Quest Locked or Not Enough Stamina");
                }}
          >
            <Text style={[styles.startButtonText, { color: palette.secondary }]}>
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
    <ScrollView 
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      <View style={[styles.header, { backgroundColor: palette.surface }]}>
        <Text style={[styles.headerTitle,{ color: palette.text }]}>
          Choose Your Quest
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, {color: palette.text}]}>
          ⚔️ Main Quests
        </Text>
        {mainQuests.map((quest, index) => (
          <React.Fragment key={quest.id}>
            <QuestCard quest={quest} />
            {index < mainQuests.length - 1 && (
              <View style={[styles.questDivider, { backgroundColor: palette.borderColorAlt }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>⭐ Side Quests</Text>
        {sideQuests.map((quest, index) => (
          <React.Fragment key={quest.id}>
            <QuestCard quest={quest} />
            {index < sideQuests.length - 1 && (
              <View style={[styles.questDivider, { backgroundColor: palette.borderColorAlt }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
    gap: 12,
  },
  header: {
    alignItems: "center",
    padding: 12,
    borderRadius: Radii.lg,
    ...Shadow.card,
  },
  headerTitle: {
    ...Font.title,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 16,
    gap: 16,
    ...Shadow.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  questDivider: {
    height: 1,
    borderRadius: 1,
    marginVertical: 4,
  },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  icon: { fontSize: 20, marginRight: 8 },

  questName: {
    fontSize: 18,
    fontWeight: "600"
  },
  lockedTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockedText: { fontSize: 12, fontWeight: "600" },
  description: { fontSize: 14, marginBottom: 8 },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    gap: 4,
  },
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#fff",
  },
  exercisesRow: { flexDirection: "row", flexWrap: "wrap" },
  exercise: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  stamina: {
    fontSize: 13,
    color: "#666"
  },
  startButton: {
    borderRadius: Radii.md,
    padding: 13,
    gap: 18,
    ...Shadow.card,
  },
  startButtonText: {
    fontWeight: "600"
  },
  questCard: {
    padding: 16,
    borderRadius: Radii.lg,
    elevation: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    gap: Spacing.xs,
  },
  specText: {
    fontSize: 12,
    fontWeight: "500",
  },
  questSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

});