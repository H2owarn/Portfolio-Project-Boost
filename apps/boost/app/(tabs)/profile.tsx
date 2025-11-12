import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter, } from "expo-router";
import React, { useMemo, useState, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Share, } from "react-native";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/lib/supabase";
import { playPreloaded, playSound } from "@/utils/sound";
import { useAuth } from "@/hooks/use-auth";
import { useRelationships } from "@/contexts/FriendContext";
import { Avatar } from "@/components/ui/avatar";
import { useFocusEffect, } from "@react-navigation/native";
import  ViewShot from "react-native-view-shot";
import * as sharing from "expo-sharing"

export default function ProfileScreen() {
  const { authedProfile: profile, authChecked } = useAuth();
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();
  const viewShotRef = useRef(null);

  const [badgeCount, setBadgeCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState(profile?.rank_divisions?.name ?? "?");
  const [streak, setStreak] = useState(0);

  const { friends, rivals, requests, fetchRelationships, fetchPendingRequests } =
    useRelationships();


  const joined = useMemo(() => {
    if (!profile?.created_at) return "";
    const d = new Date(profile.created_at);
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [profile?.created_at]);

  const handleShare = async () => {
      try {

        const uri = await viewShotRef.current.capture();

        console.log("Screenshot saved:", uri);

        await sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share your Boost stats!",
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    };

  useFocusEffect(
    React.useCallback(() => {
      if (!profile?.id) return;

      const load = async () => {
        const { count } = await supabase
          .from("user_badges")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profile.id);

        setBadgeCount(count ?? 0);
      };

      load();
    }, [profile?.id])
  );


  useFocusEffect(
    React.useCallback(() => {
      if (!profile?.id) return;

      let isMounted = true;

      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("exp, level, streak, rank_division_id")
          .eq("id", profile.id)
          .single();

        if (error || !data || !isMounted) return;

        setXp(data.exp ?? 0);
        setLevel(data.level ?? 1);
        setStreak(data.streak ?? 0);


        if (data.rank_division_id) {
          const { data: rankRow } = await supabase
            .from("rank_divisions")
            .select("name")
            .eq("id", data.rank_division_id)
            .single();

          if (isMounted) setRank(rankRow?.name ?? "?");
        } else {
          setRank("?");
        }
      };

      fetchProfile();

      return () => {
        isMounted = false;
      };
    }, [profile?.id])
  );


  useFocusEffect(
    React.useCallback(() => {
      fetchRelationships();
      fetchPendingRequests();
    }, [])
  );


  if (!authChecked) return <Text>Loading...</Text>;
  if (!profile) return <Redirect href="/onboarding/login" />;

  const hasRequests = requests && requests.length > 0;

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.container}
    >
      {/* Profile Header */}
      <ViewShot style={styles.shotGroup} ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
      <View style={[styles.profileCard, { backgroundColor: palette.surface }]}>
        <View style={styles.profileSection}>
          <Avatar name={profile.name} level={level} size={80} />
          <Text style={[styles.username, { color: palette.text }]}>{profile.name}</Text>
          <Text style={[styles.joinedText, { color: palette.mutedText }]}>
            Joined {joined}
          </Text>
          <Text style={[styles.friendsText, { color: palette.text }]}>0 Friends</Text>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: palette.secondary }]}
                onPress={async () => {
                  try {
                    await playPreloaded("click");
                  } catch {
                    await playSound(require("@/assets/sound/tap.wav"));
                  }
                  router.push("/screens/testfriend");
                }}
              >
                <Text style={[styles.addButtonText, { color: palette.primary }]}>
                  + Add Friends
                </Text>
              </TouchableOpacity>

              {/* Notification Badge */}
              {hasRequests && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {requests.length > 9 ? "9+" : requests.length}
                  </Text>
                </View>
              )}
            </View>

            {/* Share Button */}
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: palette.surfaceElevated }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={18} color={palette.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/*  Overview */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Overview</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCardContainer}>
            <StatCard icon="local-fire-department" value={streak} label="Streak" />
          </View>
          <View style={styles.statCardContainer}>
            <StatCard icon="star" value={xp} label="Total XP" />
          </View>
          <View style={styles.statCardContainer}>
            <StatCard icon="shield" value={rank} label="League" />
          </View>
          <TouchableOpacity
            onPress={async () => {
              try {
                await playPreloaded("click");
              } catch {
                await playSound(require("@/assets/sound/tap.wav"));
              }
              router.push("/screens/badges" as any);
            }}
            style={styles.statCardContainer}
          >
            <StatCard icon="workspace-premium" value={badgeCount} label="Badges" />
          </TouchableOpacity>
        </View>
      </View>
      </ViewShot>

      {/*  Friends */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Friends</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsRow}
        >
          {friends.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.mutedText }]}>
              No friends yet. Add some friends!
            </Text>
          ) : (
            friends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <Avatar name={friend.name ?? undefined} size={56} />
                <Text style={[styles.friendName, { color: palette.text }]}>
                  {friend.name ?? "Unknown"}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/*  Rivals */}
      <View style={[styles.section, { backgroundColor: palette.surface }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Rivals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsRow}
        >
          {rivals.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.mutedText }]}>
              No rivals yet. Challenge someone!
            </Text>
          ) : (
            rivals.map((rival) => (
              <View key={rival.id} style={styles.friendCard}>
                <Avatar name={rival.name ?? undefined} size={56} />
                <Text style={[styles.friendName, { color: palette.text }]}>
                  {rival.name ?? "Unknown"}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

//  Stat Card Component
function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  const palette = Colors[useColorScheme() ?? "dark"];
  return (
    <>
      <View style={[styles.statCard, { backgroundColor: palette.surfaceElevated }]}>
        <MaterialIcons name={icon as any} size={24} color={palette.primary} />
        <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      </View>
      <Text style={[styles.statLabel, { color: palette.text }]}>{label}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 10, gap: 10 },
  profileCard: { borderRadius: Radii.lg, padding: 12, ...Shadow.card },
  profileSection: { alignItems: "center", gap: 6 },
  username: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  joinedText: { fontSize: 12 },
  friendsText: { fontSize: 13, marginTop: 2 },
  buttonRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.md,
    ...Shadow.card,
  },
  addButtonText: { fontWeight: "bold", fontSize: 13 },
  shareButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radii.md,
    ...Shadow.card,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 12,
    gap: 10,
    ...Shadow.card,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  statCardContainer: { width: "48%", alignItems: "center", gap: 4},
  statCard: {
    borderRadius: Radii.md,
    padding: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Shadow.card,
  },
  statValue: { fontSize: 16, fontWeight: "bold" },
  statLabel: { fontSize: 11, textAlign: "center" },
  friendsRow: { paddingVertical: 2, gap: 10 },
  friendCard: { alignItems: "center", gap: 6 },
  friendName: { fontSize: 12, fontWeight: "600" },
  emptyText: { fontSize: 13, textAlign: "center", paddingVertical: 10 },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "700" },
  shotGroup: {
    width: "100%",
    gap: 10,
    marginBottom: 1,
  },
});
