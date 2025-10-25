import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors, Shadow } from "@/constants/theme";
import Skeleton from "@/components/ui/skeleton";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Avatar from "@/components/ui/avatar";

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
    return (
      <ScrollView style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Skeleton style={{ height: 20, width: 160, alignSelf: 'center', marginBottom: 16 }} borderRadius={6} />
          <View style={styles.podiumRow}>
            {[0,1,2].map((i) => (
              <View key={i} style={[styles.podiumWrapper, { height: 100 }]}>
                <Skeleton style={{ width: 56, height: 56 }} borderRadius={28} />
              </View>
            ))}
          </View>
          {[0,1,2].map((i) => (
            <View key={`row-${i}`} style={[styles.listItem, { backgroundColor: palette.surfaceElevated }]}> 
              <View style={styles.rowLeft}>
                <Skeleton style={{ width: 40, height: 40, marginRight: 10 }} borderRadius={20} />
                <Skeleton style={{ height: 14, width: 120 }} borderRadius={6} />
              </View>
              <Skeleton style={{ height: 12, width: 36 }} borderRadius={6} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
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
              <View style={[styles.badgeBottom, { borderTopColor: palette.borderColorAlt }]} />
              <View style={[styles.badgeContent, { backgroundColor: palette.surfaceElevated }]}></View>
              <Avatar name={top3[1].name} size={56} />
              <Text
                style={[
                  styles.rankCircle,
                  styles.rankCircle1,
                  { backgroundColor: palette.primary, color: palette.secondary },
                ]}
              >
                2
              </Text>
              <Text
                style={[
                  styles.podiumName23,
                  styles.podiumName,
                  { color: palette.text },
                ]}
              >
                {top3[1].name}
              </Text>
              <Text style={[styles.podiumScore, { color: palette.text }]}>
                {top3[1].exp}
              </Text>
            </View>

            {/* 1st place */}
            <View style={[styles.podiumWrapper, { height: 130 }]}>
              <View style={[styles.badgeBottom, { borderTopColor: palette.borderColorAlt }]} />
              <View
                style={[
                  styles.badgeContent,
                  { bottom: -20 },
                  { backgroundColor: palette.surfaceElevated },
                ]}
              ></View>
              <View style={[{ position: 'relative' }, styles.avatar1]}>
                <Avatar name={top3[0].name} size={56} />
                <Text style={styles.crown}>👑</Text>
              </View>
              <Text style={[styles.rankCircle, { backgroundColor: palette.primary, color: palette.secondary }]}>1</Text>
              <Text
                style={[
                  styles.podiumName1,
                  styles.podiumName,
                  { color: palette.text },
                ]}
              >
                {top3[0].name}
              </Text>
              <Text
                style={[
                  styles.podiumScore,
                  styles.podiumScore1,
                  { color: palette.text },
                ]}
              >
                {top3[0].exp}
              </Text>
            </View>

            {/* 3rd place */}
            <View style={[styles.podiumWrapper, { height: 100 }]}>
              <View style={[styles.badgeBottom, { borderTopColor: palette.borderColorAlt }]} />
              <View style={[styles.badgeContent, { backgroundColor: palette.surfaceElevated }]}></View>
              <Avatar name={top3[2].name} size={56} />
              <Text
                style={[
                  styles.rankCircle,
                  styles.rankCircle1,
                  { backgroundColor: palette.primary, color: palette.secondary },
                ]}
              >
                3
              </Text>
              <Text
                style={[
                  styles.podiumName23,
                  styles.podiumName,
                  { color: palette.text },
                ]}
              >
                {top3[2].name}
              </Text>
              <Text style={[styles.podiumScore, { color: palette.text }]}>
                {top3[2].exp}
              </Text>
            </View>
          </View>
        )}

        {/* Other leaderboard entries */}
        {/* Divider */}
        {others.length > 0 && (
          <View style={{ height: 1, backgroundColor: palette.borderColorAlt, borderRadius: 1, marginBottom: 12 }} />
        )}

        {others.map((player) => (
          <View
            key={player.id}
            style={[styles.listItem, { backgroundColor: palette.surfaceElevated }]}
          >
            <View style={styles.rowLeft}>
              <Avatar name={player.name} size={40} />
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
    padding: 12,
  },
  card: {
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    bottom: 18,
  },
  avatar1: {
    bottom: 45,
  },
  crown: {
    position: "absolute",
    fontSize: 24,
    top: -14,
  },
  rankCircle: {
    position: "absolute",
    bottom: 68,
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: "hidden",
  },
  rankCircle1: {
    bottom: 42,
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
    padding: 10,
    marginBottom: 10,
    top: 0,
    ...Shadow.card,
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
    fontSize: 14,
    fontWeight: "500",
  },
  listScore: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
