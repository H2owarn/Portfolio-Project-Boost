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
  avatar_url?: string | null;
};

type FriendRow = {
  friend_id: string;
  profile: {
    id: string;
    name: string;
    level: number;
    avatar_url?: string | null;
  } | null;
};


type UserQuestRow = {
  quest_id: number;
  quest: {
    id: number;
    name: string;
    description?: string | null;
  } | null;
};


const FALLBACK_AVATAR = "https://via.placeholder.com/80";
const FALLBACK_FRIEND_AVATAR = "https://via.placeholder.com/60";

export default function HomeScreen() {
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [quests, setQuests] = useState<UserQuestRow[]>([]);
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

    // 3) Friends
    const { data: friendsData, error: friendsErr } = await supabase
      .from("friends")
      .select(`
        friend_id,
        profiles!friends_friend_id_fkey ( id, name, level, avatar_url )
      `)
      .eq("user_id", user.id);

    if (friendsErr) console.error("Friends fetch error:", friendsErr);

    const normalizedFriends = (friendsData ?? []).map((f: any) => ({
      friend_id: f.friend_id,
      profile: f.profiles?.[0] ?? null,
    }));

    // 4) Active quests
    const { data: questsData, error: questsErr } = await supabase
      .from("user_quests")
      .select(`
        quest_id,
        quests ( id, name, description )
      `)
      .eq("user_id", user.id)
      .eq("status", "active");

    if (questsErr) console.error("Quests fetch error:", questsErr);

    const normalizedQuests = (questsData ?? []).map((q: any) => ({
      quest_id: q.quest_id,
      quest: q.quests?.[0] ?? null,
    }));

    // ✅ Set all state once
    if (mounted) {
      setProfile((profileData ?? null) as Profile | null);
      setFriends(normalizedFriends as FriendRow[]);
      setQuests(normalizedQuests as UserQuestRow[]);
      setLoading(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);


  function getXpRequired(level: number) {
    return 100 + level * 20; // tweak as you like
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: 45, backgroundColor: palette.background }]}>
        <Text style={{ color: palette.text }}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentInset={{ top: 45 }}
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header / Profile */}
      <View style={[styles.header, { backgroundColor: palette.surface }]}>
        <Image
          source={{ uri: profile?.avatar_url || FALLBACK_AVATAR }}
          style={styles.avatar}
        />
        <View style={styles.headerCopy}>
          <Text style={[styles.userName, { color: palette.text }]}>{profile?.name ?? "—"}</Text>
          <Text style={[styles.userLevel, { color: palette.mutedText }]}>
            Level {profile?.level ?? 1}
          </Text>

          <Progress.Bar
            progress={(profile?.exp ?? 0) / getXpRequired(profile?.level ?? 1)}
            width={220}
            height={12}
            color={palette.primary}
            unfilledColor={palette.primary + "20"}
            borderWidth={1}
            borderColor={palette.borderColor}
            style={styles.progressBar}
          />
          <Text style={[styles.xpText, { color: palette.mutedText }]}>
            {profile?.exp ?? 0}/{getXpRequired(profile?.level ?? 1)} XP
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

        {/* If you want to show up to 3 active quests here */}
        <View style={styles.questGrid}>
          {(quests.slice(0, 3)).map((q) => (
            <View key={q.quest_id} style={[styles.hexagon, { backgroundColor: palette.primary + "15" }]}>
              <Text style={styles.questEmoji}>{q.quest?.name?.slice(0, 2) ?? "🌟"}</Text>
            </View>
          ))}
          {/* If none yet, show placeholders */}
          {quests.length === 0 && (
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
          )}
        </View>

        <Pressable
          style={[styles.quickStartBtn, { backgroundColor: palette.primary }]}
          android_ripple={{ color: palette.secondary + "20" }}
          onPress={() => router.push("/(tabs)/quest")}
        >
          <Text style={[styles.quickStartText, { color: palette.secondary }]}>Quick Start</Text>
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
            <Text style={[styles.seeAll, { color: palette.primary }]}>See All ▾</Text>
          </Pressable>
        </View>

        {friends.map((f) => (
          <View
            key={f.friend_id}
            style={[styles.recommendCard, { backgroundColor: palette.surfaceElevated }]}
          >
            <Image
              source={{ uri: f.profile?.avatar_url || FALLBACK_FRIEND_AVATAR }}
              style={styles.recommendAvatar}
            />
            <View style={styles.recommendInfo}>
              <Text style={[styles.recommendName, { color: palette.text }]}>{f.profile?.name ?? "—"}</Text>
              <Text style={[styles.recommendLevel, { color: palette.mutedText }]}>
                Level {f.profile!.level}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: palette.primary }]}>➡️</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
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
    backgroundColor: "#222",
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
  recommendInfo: { flex: 1, gap: 4 },
  recommendName: { fontSize: 16, fontWeight: "600" },
  recommendLevel: { fontSize: 13 },
  arrow: { fontSize: 18 },
});
