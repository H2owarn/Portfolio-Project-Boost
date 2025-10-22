import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";


type Profile = {
  id: string;
  name: string;
  level: number;
  exp: number;
};

type LevelRow = {
  level_number: number;
  min_exp: number;
  max_exp: number | null;
};

type UserQuestRow = {
  quest_id: number;
  quest: {
    id: number;
    name: string;
    description?: string | null;
    exercise_ids?: number[];
  } | null;
  completed_exercises: number;
  total_exercises: number;
};

const FALLBACK_FRIEND_AVATAR = "https://via.placeholder.com/60";


export default function HomeScreen() {
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [quests, setQuests] = useState<UserQuestRow[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let mounted = true;

  (async () => {
    // 1) Auth user
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) console.error("User error:", userErr);
    if (!user) {
      if (mounted) setLoading(false);
      return;
    }

    // 2) Profile
    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileErr) console.error("Profile fetch error:", profileErr);

    // 2.2) Level info (based on profile.level)

    let fetchedLevelInfo: LevelRow | null = null;

    if (profileData) {
      const { data: levelData, error: levelErr } = await supabase
        .from("levels")
        .select("min_exp, max_exp")
        .eq("level_number", profileData.level)
        .maybeSingle<LevelRow>();

      if (levelErr) console.error("Level fetch error:", levelErr);
      fetchedLevelInfo = levelData ?? null;
    }

    // 3) Recommended rivals
    const { data: usersData, error: usersErr } = await supabase
      .from("profiles")
      .select("id, name, level, exp")
      .neq("id", user.id)
      .order("level", { ascending: false })
      .limit(2)

    if (usersErr) console.error("Users fetch error:", usersErr);

    // 4) Active quests with progress
    const { data: questsData, error: questsErr } = await supabase
      .from("user_quests")
      .select(`
        quest_id,
        quests ( id, name, description, exercise_ids )
      `)
      .eq("user_id", user.id)
      .eq("status", "active");

    if (questsErr) console.error("Quests fetch error:", questsErr);

    const normalizedQuests = await Promise.all(
      (questsData ?? []).map(async (q: any) => {
        const quest = q.quests;
        const exerciseIds = quest?.exercise_ids ?? [];
        const totalExercises = exerciseIds.length;

        // Get completed exercises count for this quest
        const { data: completedData } = await supabase
          .from("user_quest_exercises")
          .select("exercise_id")
          .eq("user_id", user.id)
          .eq("quest_id", q.quest_id)
          .eq("completed", true);

        const completedExercises = completedData?.length ?? 0;

        return {
          quest_id: q.quest_id,
          quest: quest ?? null,
          completed_exercises: completedExercises,
          total_exercises: totalExercises,
        };
      })
    );

    // ✅ Set all state once
    if (mounted) {
      setProfile(profileData ?? null);
      setLevelInfo(fetchedLevelInfo);
      setUsers(usersData ?? []);
      setQuests(normalizedQuests as UserQuestRow[]);
      setLoading(false);
    }
  })();


  return () => {
    mounted = false;
  };
}, []);

 // ---- EXP calculation here ----
  const currentExp = profile?.exp ?? 0;
  const minExp = levelInfo?.min_exp ?? 0;
  const maxExp = levelInfo?.max_exp ?? null;
  const progress =
    levelInfo && profile
      ? (currentExp - minExp) / ((maxExp ?? currentExp) - minExp)
      : 0;


  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: 45, backgroundColor: palette.background }]}>
        <Text style={{ color: palette.text }}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header / Profile */}
      <View style={[styles.header, { backgroundColor: palette.surface }]}>
        <Image
          source={{ uri: FALLBACK_FRIEND_AVATAR  }}
          style={styles.avatar}
        />
        <View style={styles.headerCopy}>
          <Text style={[styles.userName, { color: palette.text }]}>{profile?.name ?? "—"}</Text>
          <Text style={[styles.userLevel, { color: palette.mutedText }]}>
            Level {profile?.level ?? 1}
          </Text>

          <Progress.Bar
            progress={progress}
            width={220}
            height={12}
            color={palette.primary}
            unfilledColor={palette.primary + "20"}
            borderWidth={1}
            borderColor={palette.borderColor}
            style={styles.progressBar}
          />

          <Text style={[styles.xpText, { color: palette.mutedText }]}>
            {currentExp}/{maxExp ?? "∞"} XP
          </Text>

        </View>
      </View>

      {/* Quest Board */}
      <View style={[styles.questSection, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Quest Board</Text>
          <Pressable
            onPress={() => router.push("/(tabs)/quest")}
            android_ripple={{ color: palette.primary + "20" }}
          >
            <Text style={[styles.seeAll, { color: palette.primary }]}>See All</Text>
          </Pressable>
        </View>

        {/* Active Quests with Progress */}
        {quests.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questList}
          >
            {quests.slice(0, 3).map((q) => {
              const progress = q.total_exercises > 0 
                ? q.completed_exercises / q.total_exercises 
                : 0;
              const hasProgress = q.completed_exercises > 0;

              return (
                <Pressable
                  key={q.quest_id}
                  style={[styles.questCard, { backgroundColor: palette.surfaceElevated ?? palette.surface }]}
                  onPress={() => router.push(`/screens/QuestScreen?id=${q.quest?.id}`)}
                  android_ripple={{ color: palette.primary + "20" }}
                >
                  <View style={styles.questCardContent}>
                    <View style={styles.questCardTop}>
                      <Text style={[styles.questCardEmoji, { backgroundColor: palette.primary + "15" }]}>
                        {q.quest?.name?.slice(0, 2) ?? "�"}
                      </Text>
                      <Text style={[styles.questCardName, { color: palette.text }]} numberOfLines={2}>
                        {q.quest?.name ?? "Quest"}
                      </Text>
                    </View>

                    {hasProgress ? (
                      <View style={styles.questProgressContainer}>
                        <View style={[styles.progressBarWrapper, { borderColor: palette.borderColor, backgroundColor: palette.background }]}>
                          <View 
                            style={[
                              styles.progressBarFill, 
                              { 
                                width: `${progress * 100}%`,
                                backgroundColor: palette.primary 
                              }
                            ]} 
                          />
                          <Text style={[styles.progressBarText, { color: palette.text }]}>
                            {q.completed_exercises}/{q.total_exercises}
                          </Text>
                        </View>
                      </View>
                    ) : (
                    <View style={[styles.goButton, { backgroundColor: palette.primary }]}>
                      <Text style={[styles.goButtonText, { color: palette.secondary }]}>GO</Text>
                    </View>
                  )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noQuestsContainer}>
            <Text style={[styles.noQuestsText, { color: palette.mutedText }]}>
              No active quests. Tap &quot;See All&quot; to start a quest!
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.quickStartBtn, { backgroundColor: palette.primary }]}
          android_ripple={{ color: palette.secondary + "20" }}
          onPress={() => router.push("/(tabs)/quest")}
        >
          <Text style={[styles.quickStartText, { color: palette.secondary }]}>Browse All Quests</Text>
        </Pressable>
      </View>

      {/* Friends */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Recommended Rivals</Text>
          <Pressable
            onPress={() => console.log("See all friends")}
            android_ripple={{ color: palette.primary + "20" }}
          >
          </Pressable>
        </View>

          <View style={styles.recommendContainer}>
      {users.map((u) => (
        <View
          key={u.id}
          style={[
            styles.recommendCard,
            { backgroundColor: palette.surfaceElevated ?? palette.surface },
          ]}
        >
          <Image
            source={{ uri: FALLBACK_FRIEND_AVATAR }}
            style={styles.recommendAvatar}
          />
          <View style={styles.recommendInfo}>
            <Text style={[styles.recommendName, { color: palette.text }]}>
              {u.name ?? "—"}
            </Text>
            <Text style={[styles.recommendLevel, { color: palette.mutedText }]}>
              Level {u.level}
            </Text>
          </View>
          <Text style={[styles.arrow, { color: palette.primary }]}>➡️</Text>
        </View>
      ))}
    </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: Radii.lg,
    ...Shadow.card,
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#000000ff",
  },
  progressBar: { marginTop: 6 },
  userName: { fontSize: 20, fontWeight: "bold" },
  userLevel: { fontSize: 14, fontWeight: "600" },
  xpText: { fontSize: 12 },

  questSection: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 18,
    ...Shadow.card,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 14,
    ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "600" },

  questList: {
    gap: 12,
    paddingRight: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
  questCard: {
    borderRadius: Radii.md,
    padding: 16,
    gap: 12,
    minWidth: 100,
    flex: 1,
    ...Shadow.card,
  },
  questCardContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  questCardTop: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  questCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  questCardEmoji: {
    width: 60,
    height: 60,
    borderRadius: Radii.md,
    textAlign: "center",
    lineHeight: 60,
    fontSize: 28,
  },
  questCardInfo: {
    flex: 1,
    gap: 4,
  },
  questCardName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  questCardDesc: {
    fontSize: 13,
    textAlign: "center",
  },
  goButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Radii.sm,
    width: "100%",
    alignItems: "center",
  },
  goButtonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  questProgressContainer: {
    gap: 6,
    width: "100%",
  },
  progressBarWrapper: {
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  progressBarText: {
    fontSize: 14,
    fontWeight: "700",
    zIndex: 1,
  },
  noQuestsContainer: {
    padding: 24,
    alignItems: "center",
  },
  noQuestsText: {
    fontSize: 14,
    textAlign: "center",
  },

  questGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  hexagon: {
    width: 90,
    height: 90,
    borderRadius: Radii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  questEmoji: { fontSize: 28 },

  quickStartBtn: { borderRadius: Radii.md, paddingVertical: 14, alignItems: "center" },
  quickStartText: { fontWeight: "700", letterSpacing: 0.4 },

  recommendCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.md,
    padding: 12,
    gap: 12,
  },
  recommendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111",
  },

  recommendContainer: {
  gap: 12,
  marginTop: 8,
  },

  recommendInfo: {
    flex: 1,
    gap: 4
  },
  recommendName: {
    fontSize: 16,
    fontWeight: "600"
  },
  recommendLevel: {
    fontSize: 13
  },
  arrow: {
    fontSize: 18
    },
});
