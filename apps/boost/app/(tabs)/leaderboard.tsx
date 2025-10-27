import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width } = Dimensions.get("window");

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [rivals, setRivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const palette = Colors[useColorScheme() ?? "dark"];

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, exp")
        .order("exp", { ascending: false });

      if (error) {
        console.error("Leaderboard fetch error:", error);
        setLoading(false);
        return;
      }

      setLeaderboard(data ?? []);
      setLoading(false);
    };

    const loadRivals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: rivalRelations, error: rivalErr } = await supabase
        .from("relationships")
        .select("user_1_id, user_2_id")
        .eq("type", "rival")
        .eq("status", "ACCEPTED")
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`);

      if (rivalErr) {
        console.error("Rival fetch error:", rivalErr);
        return;
      }

      const rivalIds = rivalRelations.map((r) =>
        r.user_1_id === user.id ? r.user_2_id : r.user_1_id
      );

      if (rivalIds.length === 0) return;

      const { data: rivalProfiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, name, exp_week")
        .in("id", [user.id, ...rivalIds]);

      if (profileErr) {
        console.error("Profile fetch error:", profileErr);
        return;
      }

      const myExp = rivalProfiles.find((p) => p.id === user.id)?.exp_week ?? 0;
      const rivalsCompared = rivalProfiles
        .filter((p) => p.id !== user.id)
        .map((p) => ({
          ...p,
          diff: p.exp_week - myExp,
        }));

      setRivals(rivalsCompared);
    };

    loadLeaderboard();
    loadRivals();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 8 }}>Loading leaderboard…</Text>
      </View>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const pages = [
    { key: "rivals", content: renderRivals() },
    { key: "leaderboard", content: renderLeaderboard() },
  ];

  function renderLeaderboard() {
    return (
      <View style={[styles.page, { backgroundColor: palette.background }]}>
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={[styles.header, { color: palette.text }]}>Leaderboard</Text>

          {/* Top 3 podium */}
          {top3.length === 3 && (
            <View style={styles.podiumRow}>
              {/* 2nd place */}
              <View style={[styles.podiumWrapper, { height: 100 }]}>
                <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
                <View style={[styles.badgeContent, { backgroundColor: palette.secondary }]} />
                <View style={styles.avatar} />
                <Text style={[styles.rankCircle, styles.rankCircle1, { backgroundColor: palette.primary }]}>2</Text>
                <Text style={[styles.podiumName23, styles.podiumName, { color: "white" }]}>{top3[1].name}</Text>
                <Text style={[styles.podiumScore, { color: "white" }]}>{top3[1].exp}</Text>
              </View>

              {/* 1st place */}
              <View style={[styles.podiumWrapper, { height: 130 }]}>
                <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
                <View style={[styles.badgeContent, { bottom: -20, backgroundColor: palette.secondary }]} />
                <View style={[styles.avatar, styles.avatar1]}>
                  <Text style={styles.crown}>👑</Text>
                </View>
                <Text style={[styles.rankCircle, { backgroundColor: palette.primary }]}>1</Text>
                <Text style={[styles.podiumName1, styles.podiumName, { color: "white" }]}>{top3[0].name}</Text>
                <Text style={[styles.podiumScore, styles.podiumScore1, { color: "white" }]}>{top3[0].exp}</Text>
              </View>

              {/* 3rd place */}
              <View style={[styles.podiumWrapper, { height: 100 }]}>
                <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
                <View style={[styles.badgeContent, { backgroundColor: palette.secondary }]} />
                <View style={styles.avatar} />
                <Text style={[styles.rankCircle, styles.rankCircle1, { backgroundColor: palette.primary }]}>3</Text>
                <Text style={[styles.podiumName23, styles.podiumName, { color: "white" }]}>{top3[2].name}</Text>
                <Text style={[styles.podiumScore, { color: "white" }]}>{top3[2].exp}</Text>
              </View>
            </View>
          )}

          {/* Remaining players */}
          {others.slice(0, 20).map((player) => (
            <View key={player.id} style={[styles.listItem, { backgroundColor: palette.secondary }]}>
              <View style={styles.rowLeft}>
                <View style={styles.smallAvatar} />
                <Text style={[styles.listName, { color: palette.text }]}>{player.name}</Text>
              </View>
              <Text style={[styles.listScore, { color: palette.text }]}>{player.exp}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  function renderRivals() {
  return (
    <View style={[styles.page, { backgroundColor: palette.background }]}>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.header, { color: palette.text }]}>Rival Standings</Text>

        {rivals.length === 0 ? (
          <Text style={{ color: palette.mutedText, textAlign: "center" }}>
            No active rivals yet
          </Text>
        ) : (
          rivals.map((r, index) => {
            const ahead = r.diff > 0;
            const rank = index + 1;
            const rankColor =
              rank === 1
                ? "#FFD700" // gold
                : rank === 2
                ? "#C0C0C0" // silver
                : "#CD7F32"; // bronze

            return (
              <View
                key={r.id}
                style={[
                  styles.rivalCard,
                  {
                    backgroundColor: palette.secondary,
                    borderLeftColor: ahead ? "tomato" : "lime",
                    borderLeftWidth: 4,
                    shadowColor: ahead ? "red" : "lime",
                    shadowOpacity: 0.3,
                  },
                ]}
              >
                <View style={styles.rivalInfo}>
                  <Text style={[styles.rivalRank, { color: rankColor }]}>#{rank}</Text>
                  <Text style={[styles.rivalName, { color: palette.text }]}>{r.name}</Text>
                </View>

                <View style={styles.rivalStats}>
                  <Text
                    style={[
                      styles.rivalText,
                      { color: ahead ? "tomato" : palette.text, textAlign: "right" },
                    ]}
                  >
                    {ahead
                      ? `😤 Ahead by ${r.diff} XP`
                      : `🏆 You’re ahead by ${Math.abs(r.diff)} XP`}
                  </Text>

                  {/* XP Difference Bar */}
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.min(Math.abs(r.diff) / 100 * 100, 100)}%`,
                          backgroundColor: ahead ? "tomato" : "yellow",
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}


  return (
    <FlatList
      data={pages}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => item.content}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
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
    backgroundColor: "#000",
  },
  page: {
    width,
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 40,
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 90,
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 30,
    gap: 15,
  },
  podiumWrapper: {
    width: 100,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  badgeBottom: {
    position: "absolute",
    bottom: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  badgeContent: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#111827",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    bottom: 25,
  },
  avatar1: {
    bottom: 55,
  },
  crown: {
    position: "absolute",
    fontSize: 24,
    top: -22,
  },
  rankCircle: {
    position: "absolute",
    bottom: 90,
    color: "#111827",
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: "hidden",
  },
  rankCircle1: {
    bottom: 60,
  },
  podiumName: {
    fontWeight: "600",
    textAlign: "center",
  },
  podiumName1: {
    top: -30,
  },
  podiumName23: {
    top: -10,
  },
  podiumScore: {
    fontSize: 13,
    textAlign: "center",
  },
  podiumScore1: {
    top: -20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    top: 20,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    marginRight: 10,
  },
  listName: {
    fontSize: 16,
    fontWeight: "500",
  },
  listScore: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rivalSection: {
    borderRadius: 16,
    padding: 16,
    marginTop: 40,
  },
  rivalHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  rivalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rivalName: {
    fontSize: 16,
    fontWeight: "600",
  },
  rivalText: {
    fontSize: 14,
    fontWeight: "500",
  },
  rivalInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rivalRank: {
    fontSize: 16,
    fontWeight: "700",
  },
  rivalStats: {
    flex: 1,
    alignItems: "flex-end",
  },
  barContainer: {
    height: 6,
    width: 100,
    backgroundColor: "#333",
    borderRadius: 4,
    marginTop: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
