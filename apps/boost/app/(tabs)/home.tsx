import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { playPreloaded, preloadSounds, playSound } from "@/utils/sound";
import { checkAndAwardBadges } from "@/utils/awardBadges";
import { getBadgeImage } from "@/utils/getbadgeimage";
import { LineChart, BarChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";


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
  status: string;
  quest: {
    id: number;
    name: string;
    description?: string | null;
  } | null;
};

const FALLBACK_FRIEND_AVATAR = "https://via.placeholder.com/60";


export default function HomeScreen() {
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<UserQuestRow[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelRow | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<string>("IRON");

  useEffect(() => {
  preloadSounds();
  let mounted = true;

    (async () => {
      // Auth user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) console.error("User error:", userErr);
      if (!user) {
        if (mounted) setLoading(false);
        return;
      }

      // Check for badges
      await checkAndAwardBadges(user.id);

      // Fetch profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileErr) console.error("Profile fetch error:", profileErr);

      // Fetch level info
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

      // Active quests
      const { data: questsData, error: questsErr } = await supabase
        .from("user_quests")
        .select(`
          quest_id,
          quests ( id, name, description )
        `)
        .eq("user_id", user.id)
        .eq("status", ["active", "in_progress"]);

      if (questsErr) console.error("Quests fetch error:", questsErr);

      const normalizedQuests = (questsData ?? []).map((q: any) => ({
        quest_id: q.quest_id,
        status: q.status,
        quest: q.quests ?? null,
      }));

      // Fetch earned badges
      const { data: earnedBadges, error: badgesErr } = await supabase
        .from("user_badges")
        .select(`
          badge_id,
          badges ( name, description, asset_key )
        `)
        .eq("user_id", user.id);

      if (badgesErr) console.error("Badge fetch error:", badgesErr);

      const badgeCount = earnedBadges?.length ?? 0;

      const { data: rankRow, error: rankErr } = await supabase
        .from("rank_divisions")
        .select("name")
        .lte("min_badges", badgeCount)
        .gte("max_badges", badgeCount)
        .maybeSingle();

      if (rankErr) console.error("Rank fetch error:", rankErr);

      setRank(rankRow?.name ?? "UNRANKED");

      if (mounted) {
        setProfile(profileData ?? null);
        setLevelInfo(fetchedLevelInfo);
        setQuests(normalizedQuests as UserQuestRow[]);
        setBadges(earnedBadges ?? []);
        setLoading(false);
      }

    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ---- EXP calculation ----
  const currentExp = profile?.exp ?? 0;
  const minExp = levelInfo?.min_exp ?? 0;
  const maxExp = levelInfo?.max_exp ?? null;
  const progress =
    levelInfo && profile
      ? (currentExp - minExp) / ((maxExp ?? currentExp) - minExp)
      : 0;



  if (loading) {
    return (
     <View style={styles.loadingContainer}>
                 <ActivityIndicator size="large" color={palette.primary} />
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
        <Image source={{ uri: FALLBACK_FRIEND_AVATAR }} style={styles.avatar} />
        <View style={styles.headerCopy}>
          <Text style={[styles.userName, { color: palette.text }]}>{profile?.name ?? "—"}</Text>
          <Text style={[styles.userLevel, { color: palette.mutedText }]}>
            Rank: {rank} · Level {profile?.level ?? 1}
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
              onPress={() => {
                playPreloaded("click");
                router.push("/(tabs)/quest");
              }}
              android_ripple={{ color: palette.primary + "20" }}
            >
              <Text style={[styles.seeAll, { color: palette.primary }]}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.questGrid}>
            {(() => {
              // sort by in-progress first
              const inProgress = quests.filter((q) => q.status === "in_progress");
              const active = quests.filter((q) => q.status === "active");
              const displayQuests = (inProgress.length > 0 ? inProgress : active).slice(0, 3);

              console.log("🔥 In-progress quests:", inProgress);
              console.log("⚡ Active quests:", active);

              if (displayQuests.length === 0) {
                return (
                  <>
                    <View style={[styles.hexagon, { backgroundColor: palette.primary + "15" }]}>
                      <Text style={styles.questEmoji}>👑</Text>
                    </View>
                    <View style={[styles.hexagon, { backgroundColor: palette.primary + "15" }]}>
                      <Text style={styles.questEmoji}>🦴</Text>
                    </View>
                    <View style={[styles.hexagon, { backgroundColor: palette.primary + "15" }]}>
                      <Text style={styles.questEmoji}>💎</Text>
                    </View>
                  </>
                );
              }

              return displayQuests.map((q) => (
                <Pressable
                  key={q.quest_id}
                  style={[
                    styles.hexagon,
                    {
                      backgroundColor:
                        q.status === "in_progress"
                          ? palette.primary + "30"
                          : palette.primary + "15",
                    },
                  ]}
                  onPress={async () => {
                    try {
                      await playPreloaded("click");
                    } catch {
                      await playSound(require("@/assets/sound/tap.wav"));
                    }
                    router.push(`/screens/QuestScreen?id=${q.quest_id}`);
                  }}
                >
                  <Text style={styles.questEmoji}>{q.quest?.name?.slice(0, 2) ?? "🌟"}</Text>
                </Pressable>
              ));
            })()}
          </View>


        <Pressable
          style={[styles.quickStartBtn, { backgroundColor: palette.primary }]}
          android_ripple={{ color: palette.secondary + "20" }}
          onPress={async () => {
            try {
              await playPreloaded("click");
            } catch {
              await playSound(require("@/assets/sound/tap.wav"));
            }

            // 1. Get the logged-in user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              Alert.alert("Login required", "Please sign in to start a quest.");
              return;
            }

            // 2. Fetch user's active quests
            const { data: activeQuests, error } = await supabase
              .from("user_quests")
              .select(`
                quest_id,
                quests (
                  id,
                  name,
                  description
                )
              `)
              .eq("user_id", user.id)
              .eq("status", "active");

            if (error || !activeQuests?.length) {
              Alert.alert(
                "No active quests found",
                "You don't have any assigned quests right now."
              );
              return;
            }

            // 3. Pick a random quest
            const randomQuest =
              activeQuests[Math.floor(Math.random() * activeQuests.length)];

            //4. Navigate to that quest detail page
            router.push(`/screens/QuestScreen?id=${randomQuest.quest_id}`);
          }}
        >
          <Text style={[styles.quickStartText, { color: palette.secondary }]}>
            Quick Start
          </Text>
        </Pressable>

      </View>

      {/* Charts section */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, { color: palette.text, marginBottom: 8 }]}>
          Progress Charts
        </Text>

        {/* Quick Metrics Row */}
        {loading ? (
          <Text style={{ color: palette.mutedText }}>Loading stats...</Text>
        ) : (
          <ChartsSection palette={palette} />
        )}
      </View>

      {/* Badges Section */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Your Badges</Text>
          <Pressable
            onPress={ () => {
              playPreloaded("click");
              router.push("/(tabs)/quest");
            }}
            android_ripple={{ color: palette.primary + "20" }}
          >
            <Text style={[styles.seeAll, { color: palette.primary }]}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.badgeGrid}>
          {badges.length > 0 ? (

            badges.slice(0, 3).map((b) => (
              <View
                key={b.badge_id}
                style={[styles.badgeCard, { backgroundColor: palette.surfaceElevated ?? palette.surface }]}
              >
                <Image
                  source={
                    getBadgeImage(b.badges.asset_key)
                  }
                  style={[styles.badgeImage, {backgroundColor: palette.background}]}
                />
                <Text style={[styles.badgeName, { color: palette.text }]}>{b.badges.name}</Text>
              </View>

            ))
          ) : (
            <Text style={{ color: palette.mutedText }}>No badges yet — keep training!</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

function ChartsSection({ palette }: { palette: any }) {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<{ label: string; count: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number }[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      /** Fetch Workout Sessions for Weekly Chart **/
      const { data: sessions, error: sessionErr } = await supabase
        .from("workout_sessions")
        .select("created_at")
        .eq("user_id", user.id);

      if (sessionErr) {
        console.error("Workout session fetch error:", sessionErr);
        setLoading(false);
        return;
      }

      const weeklyCount: Record<string, number> = {};
      sessions.forEach((s) => {
        const d = new Date(s.created_at);
        const weekKey = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
        weeklyCount[weekKey] = (weeklyCount[weekKey] || 0) + 1;
      });

      const weekly = Object.entries(weeklyCount).map(([label, count]) => ({ label, count }));
      setWeeklyData(weekly.sort((a, b) => a.label.localeCompare(b.label)));

      /** Fetch Completed Exercises for Volume Chart **/
      const { data: completed, error: compErr } = await supabase
        .from("completed_exercises")
        .select("weight, reps, sets, created_at")
        .eq("user_id", user.id);

      if (compErr) {
        console.error("Volume fetch error:", compErr);
        setLoading(false);
        return;
      }

      const volumeMap: Record<string, number> = {};
      completed.forEach((ex) => {
        const dateKey = new Date(ex.created_at).toISOString().split("T")[0];
        const vol = (ex.weight || 0) * (ex.reps || 0) * (ex.sets || 1);
        volumeMap[dateKey] = (volumeMap[dateKey] || 0) + vol;
      });

      const volume = Object.entries(volumeMap).map(([date, volume]) => ({ date, volume }));
      setVolumeData(volume.sort((a, b) => a.date.localeCompare(b.date)));

      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text style={{ color: palette.mutedText }}>Loading charts…</Text>
      </View>
    );
  }

  if (!weeklyData.length && !volumeData.length) {
    return (
      <Text style={{ color: palette.mutedText, textAlign: "center" }}>
        No workout data yet — complete your first session 💪
      </Text>
    );
  }

  /** Aggregate summary numbers **/
  const totalWorkouts = weeklyData.reduce((a, b) => a + b.count, 0);
  const totalVolume = volumeData.reduce((a, b) => a + b.volume, 0);

  return (
    <View style={{ gap: 24 }}>
      {/*  Quick Stats Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ color: palette.text, fontSize: 22, fontWeight: "700" }}>
            {totalWorkouts}
          </Text>
          <Text style={{ color: palette.mutedText }}>Total Workouts</Text>
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ color: palette.text, fontSize: 22, fontWeight: "700" }}>
            {Math.round(totalVolume)} kg
          </Text>
          <Text style={{ color: palette.mutedText }}>Total Volume</Text>
        </View>
      </View>

      {/* Total Training Volume Chart */}
      <View>
        <Text style={{ color: palette.text, fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
          Total Training Volume
        </Text>
        {volumeData.length === 0 ? (
          <Text style={{ color: palette.mutedText, textAlign: "center" }}>
            No volume data yet
          </Text>
        ) : (
          <View style={{ height: 220, flexDirection: "row" }}>
            <YAxis
              data={volumeData.map((v) => v.volume)}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fill: palette.mutedText, fontSize: 10 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={volumeData.map((v) => v.volume)}
                svg={{ stroke: palette.primary, strokeWidth: 3 }}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveNatural}
              >
                <Grid />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10, height: 20 }}
                data={volumeData}
                formatLabel={(v, i) =>
                  new Date(volumeData[i].date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })
                }
                contentInset={{ left: 20, right: 20 }}
                svg={{ fontSize: 10, fill: palette.text }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
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
    backgroundColor: "#000",
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
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
  },
  badgeCard: {
    alignItems: "center",
    width: 80,
    gap: 6,
    borderRadius: Radii.md,
    padding: 8,
    ...Shadow.card,
  },
  badgeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
