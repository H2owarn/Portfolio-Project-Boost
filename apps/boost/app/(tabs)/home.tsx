import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { playPreloaded, preloadSounds, playSound } from "@/utils/sound";
import { checkAndAwardBadges } from "@/utils/awardBadges";
import { getBadgeImage } from "@/utils/getbadgeimage";
import { LineChart, BarChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Avatar } from "@/components/ui/avatar";
import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";


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
    exercise_ids?: number[];
  } | null;
  completed_exercises: number;
  total_exercises: number;
};

// Avatar fallback is handled by <Avatar/> component


export default function HomeScreen() {
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<UserQuestRow[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelRow | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<string>("IRON");
  const [questRowWidth, setQuestRowWidth] = useState(0);

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
    const { data: questsData, error } = await supabase
      .from("user_quests")
      .select(`
        quest_id,
        status,
        quests ( id, name, description )
      `)
      .eq("user_id", user.id)
      .eq("status", "active");


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
        .eq("user_id", user.id)
        .order("badge_id", { ascending: true });

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
  const clampedProgress = Math.min(1, Math.max(0, progress));



  if (loading) {
    return (
      <ScrollView
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={styles.container}
      >
        {/* Header skeleton */}
        <View style={[styles.header, { backgroundColor: palette.surface }]}>
          <Skeleton style={{ width: 80, height: 80 }} borderRadius={40} />
          <View style={styles.headerCopy}>
            <Skeleton style={{ height: 18, width: '50%' }} borderRadius={6} />
            <Skeleton style={{ height: 14, width: '30%' }} borderRadius={6} />
            <Skeleton style={{ height: 12, width: '100%', marginTop: 8 }} borderRadius={6} />
            <Skeleton style={{ height: 12, width: 100, marginTop: 8 }} borderRadius={6} />
          </View>
        </View>

        {/* Quest Board skeleton */}
        <View style={[styles.questSection, { backgroundColor: palette.surface }]}>
          <View style={styles.sectionHeader}>
            <Skeleton style={{ height: 20, width: 120 }} borderRadius={6} />
            <Skeleton style={{ height: 16, width: 60 }} borderRadius={6} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.questList}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.questCard, { backgroundColor: palette.surfaceElevated }]}>
                <View style={styles.questCardContent}>
                  <View style={styles.questCardTop}>
                    <Skeleton style={{ width: 60, height: 60 }} borderRadius={Radii.md} />
                    <Skeleton style={{ height: 14, width: 80 }} borderRadius={6} />
                  </View>
                  <Skeleton style={{ height: 12, width: '100%' }} borderRadius={6} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header / Profile */}
      <View style={[styles.header, { backgroundColor: palette.surface }]}>
        <Avatar name={profile?.name ?? undefined} level={profile?.level} size={64} />
        <View style={styles.headerCopy}>
          <Text style={[styles.userName, { color: palette.text }]}>{profile?.name ?? "—"}</Text>
          <Text style={[styles.userLevel, { color: palette.mutedText }]}>
            Rank: {rank} · Level {profile?.level ?? 1}
          </Text>

          <View style={[styles.progressBarWrapper, { borderColor: palette.borderColorAlt, backgroundColor: palette.background, width: '100%' }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${clampedProgress * 100}%`,
                  backgroundColor: palette.primary,
                  borderRadius: 6,
                },
              ]}
            />
          </View>

          <Text style={[styles.xpText, { color: palette.mutedText }]}>
            {currentExp}/{maxExp ?? "∞"} XP
          </Text>
        </View>
      </View>

        {/* Active Quests section */}

        <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Your Quests</Text>
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

        {quests.length > 0 ? (
          <View
            style={styles.questList}
            onLayout={(e) => setQuestRowWidth(e.nativeEvent.layout.width)}
          >
            {quests.slice(0, 3).map((q, idx, arr) => {
              const cardsCount = arr.length || 1;
              const gap = 10; // must match styles.questList gap
              const cardWidth = questRowWidth > 0 ? (questRowWidth - gap * (cardsCount - 1)) / cardsCount : undefined;
              const progress = q.total_exercises > 0
                ? q.completed_exercises / q.total_exercises
                : 0;
              const hasProgress = q.completed_exercises > 0;

              return (
                <Pressable
                  key={q.quest_id}
                  style={[styles.questCard, { backgroundColor: palette.surfaceElevated ?? palette.surface, width: cardWidth }]}
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
                        <View style={[styles.progressBarWrapper, { borderColor: palette.borderColorAlt, backgroundColor: palette.background }]}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${progress * 100}%`,
                                backgroundColor: palette.primary
                              }
                            ]}
                          />
                        </View>
                        <Text style={[styles.progressBarText, { color: palette.mutedText, textAlign: 'center' }]}>
                          {q.completed_exercises}/{q.total_exercises}
                        </Text>
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
          </View>
        ) : (
          <EmptyState
            icon="auto-awesome"
            title="No active quests"
            message="Start a random quest or browse all available quests."
            actionLabel="Quest Quick Start"
            onActionPress={async () => {
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

              // 2. Fetch all available quests
              const { data: allQuests, error } = await supabase
                .from("quests")
                .select("id, name, description");

              if (error || !allQuests?.length) {
                Alert.alert(
                  "No quests available",
                  "There are no quests available right now."
                );
                return;
              }

              // 3. Pick a random quest
              const randomQuest =
                allQuests[Math.floor(Math.random() * allQuests.length)];

              // 4. Navigate to that quest detail page
              router.push(`/screens/QuestScreen?id=${randomQuest.id}`);
            }}
          />
        )}
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
              router.push("/screens/badges" as any);
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
          <View style={{ height: 170, flexDirection: "row" }}>
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
    padding: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: Radii.lg,
    ...Shadow.card,
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  progressBar: { marginTop: 6 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userLevel: { fontSize: 12, fontWeight: "600" },
  xpText: { fontSize: 11 },

  questSection: {
    borderRadius: Radii.lg,
    padding: 12,
    gap: 10,
    ...Shadow.card,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 12,
    gap: 10,
    ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  seeAll: { fontSize: 12, fontWeight: "600" },

  questList: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 0,
    justifyContent: "center",
    flexGrow: 1,
  },
  questCard: {
    borderRadius: Radii.md,
    padding: 12,
    gap: 10,
    ...Shadow.card,
  },
  questCardContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  questCardTop: {
    alignItems: "center",
    gap: 8,
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
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    textAlign: "center",
    lineHeight: 44,
    fontSize: 22,
  },
  questCardInfo: {
    flex: 1,
    gap: 4,
  },
  questCardName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  questCardDesc: {
    fontSize: 13,
    textAlign: "center",
  },
  goButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
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
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
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
    borderRadius: 6,
  },
  progressBarText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
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

  quickStartBtn: { borderRadius: Radii.md, paddingVertical: 10, alignItems: "center" },
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
    width: 100,
    borderRadius: Radii.md,
    padding: 10,
    gap: 10,
  },
  badgeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    gap: 4
  },
  recommendName: {
    fontSize: 14,
    fontWeight: "600"
  },
  recommendLevel: {
    fontSize: 12
  },
});
