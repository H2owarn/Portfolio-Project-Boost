import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
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

    loadLeaderboard();
  }, []);

  if (loading) {
    return <Text style={{ color: "#fff" }}>Loading leaderboard…</Text>;
  }

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.header, { color: palette.text }]}>Leaderboard</Text>

        {/* Top 3 podium */}
        {top3.length === 3 && (
          <View style={styles.podiumRow}>
            {/* 2nd place */}
            <View style={[styles.podiumWrapper, { height: 100 }]}>
              <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
              <View style={[styles.badgeContent, { backgroundColor: palette.secondary }]}></View>
              <View style={styles.avatar} />
              <Text
                style={[
                  styles.rankCircle,
                  styles.rankCircle1,
                  { backgroundColor: palette.primary },
                ]}
              >
                2
              </Text>
              <Text
                style={[
                  styles.podiumName23,
                  styles.podiumName,
                  { color: 'white' },
                ]}
              >
                {top3[1].name}
              </Text>
              <Text style={[styles.podiumScore, { color: 'white' }]}>
                {top3[1].exp}
              </Text>
            </View>

            {/* 1st place */}
            <View style={[styles.podiumWrapper, { height: 130 }]}>
              <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
              <View
                style={[
                  styles.badgeContent,
                  { bottom: -20 },
                  { backgroundColor: palette.secondary },
                ]}
              ></View>
              <View style={[styles.avatar, styles.avatar1]}>
                <Text style={styles.crown}>👑</Text>
              </View>
              <Text style={[styles.rankCircle, { backgroundColor: palette.primary }]}>1</Text>
              <Text
                style={[
                  styles.podiumName1,
                  styles.podiumName,
                  { color: 'white' },
                ]}
              >
                {top3[0].name}
              </Text>
              <Text
                style={[
                  styles.podiumScore,
                  styles.podiumScore1,
                  { color: 'white' },
                ]}
              >
                {top3[0].exp}
              </Text>
            </View>

            {/* 3rd place */}
            <View style={[styles.podiumWrapper, { height: 100 }]}>
              <View style={[styles.badgeBottom, { borderTopColor: palette.secondary }]} />
              <View style={[styles.badgeContent, { backgroundColor: palette.secondary }]}></View>
              <View style={styles.avatar} />
              <Text
                style={[
                  styles.rankCircle,
                  styles.rankCircle1,
                  { backgroundColor: palette.primary },
                ]}
              >
                3
              </Text>
              <Text
                style={[
                  styles.podiumName23,
                  styles.podiumName,
                  { color: 'white' },
                ]}
              >
                {top3[2].name}
              </Text>
              <Text style={[styles.podiumScore, { color: 'white' }]}>
                {top3[2].exp}
              </Text>
            </View>
          </View>
        )}

        {/* Other leaderboard entries */}
        {others.map((player) => (
          <View
            key={player.id}
            style={[styles.listItem, { backgroundColor: palette.secondary }]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.smallAvatar} />
              <Text style={[styles.listName, { color: palette.text }]}>{player.name}</Text>
            </View>
            <Text style={[styles.listScore, { color: palette.text }]}>{player.exp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
