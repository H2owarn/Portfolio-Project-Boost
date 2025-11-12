import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors, Shadow } from "@/constants/theme";
import Skeleton from "@/components/ui/skeleton";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Avatar } from "@/components/ui/avatar";

const { width } = Dimensions.get("window");

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const palette = Colors[useColorScheme() ?? "dark"];
  const [rivals, setRivals] = useState<any[]>([]);
  const [activePage, setActivePage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
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

      const myProfile = rivalProfiles.find((p) => p.id === user.id);
      const myExp = myProfile?.exp_week ?? 0;

      const allProfiles = rivalProfiles.map((p) => ({
        ...p,
        diff: p.exp_week - myExp,
        isSelf: p.id === user.id,
      }));

      setRivals(allProfiles);
    };

    loadLeaderboard();
    loadRivals();
  }, []);

  const handleTabPress = (index: number) => {
    setActivePage(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setActivePage(newIndex);
  };

  if (loading) {
    return (
      <ScrollView
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={styles.container}
      >
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Skeleton
            style={{
              height: 20,
              width: 160,
              alignSelf: "center",
              marginBottom: 16,
            }}
            borderRadius={6}
          />
          <View style={styles.podiumRow}>
            <View style={[styles.podiumWrapper, styles.podiumWrapper23]}>
              <Skeleton style={{ width: 56, height: 56 }} borderRadius={28} />
            </View>
            <View style={[styles.podiumWrapper, styles.podiumWrapper1]}>
              <Skeleton style={{ width: 56, height: 56 }} borderRadius={28} />
            </View>
            <View style={[styles.podiumWrapper, styles.podiumWrapper23]}>
              <Skeleton style={{ width: 56, height: 56 }} borderRadius={28} />
            </View>
          </View>
          {[0, 1, 2].map((i) => (
            <View
              key={`row-${i}`}
              style={[
                styles.listItem,
                { backgroundColor: palette.surfaceElevated },
              ]}
            >
              <View style={styles.rowLeft}>
                <Skeleton
                  style={{ width: 40, height: 40, marginRight: 10 }}
                  borderRadius={20}
                />
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

  function renderLeaderboard() {
    return (
      <ScrollView
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={styles.container}
      >
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={[styles.header, { color: palette.text }]}>
            Leaderboard
          </Text>

          {top3.length === 3 && (
            <View style={styles.podiumRow}>
              {/* 2nd place */}
              <View style={[styles.podiumWrapper, styles.podiumWrapper23]}>
                <View
                  style={[
                    styles.badgeBottom,
                    { borderTopColor: palette.borderColorAlt },
                  ]}
                />
                <View
                  style={[
                    styles.badgeContent,
                    { backgroundColor: palette.surfaceElevated },
                  ]}
                >
                  <View style={styles.podiumContentInner}>
                    <View style={styles.avatarContainer}>
                      <Avatar name={top3[1].name} size={56} />
                      <Text
                        style={[
                          styles.rankCircle,
                          {
                            backgroundColor: palette.primary,
                            color: palette.secondary,
                          },
                        ]}
                      >
                        2
                      </Text>
                    </View>
                    <Text
                      style={[styles.podiumName, { color: palette.text }]}
                      numberOfLines={1}
                    >
                      {top3[1].name}
                    </Text>
                    <Text style={[styles.podiumScore, { color: palette.text }]}>
                      {top3[1].exp}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 1st place */}
              <View style={[styles.podiumWrapper, styles.podiumWrapper1]}>
                <View
                  style={[
                    styles.badgeBottom,
                    { borderTopColor: palette.borderColorAlt },
                  ]}
                />
                <View
                  style={[
                    styles.badgeContent,
                    { backgroundColor: palette.surfaceElevated },
                  ]}
                >
                  <View style={styles.podiumContentInner}>
                    <View style={styles.avatarContainer}>
                      <Avatar name={top3[0].name} size={56} />
                      <Text style={styles.crown}>👑</Text>
                      <Text
                        style={[
                          styles.rankCircle,
                          {
                            backgroundColor: palette.primary,
                            color: palette.secondary,
                          },
                        ]}
                      >
                        1
                      </Text>
                    </View>
                    <Text
                      style={[styles.podiumName, { color: palette.text }]}
                      numberOfLines={1}
                    >
                      {top3[0].name}
                    </Text>
                    <Text style={[styles.podiumScore, { color: palette.text }]}>
                      {top3[0].exp}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 3rd place */}
              <View style={[styles.podiumWrapper, styles.podiumWrapper23]}>
                <View
                  style={[
                    styles.badgeBottom,
                    { borderTopColor: palette.borderColorAlt },
                  ]}
                />
                <View
                  style={[
                    styles.badgeContent,
                    { backgroundColor: palette.surfaceElevated },
                  ]}
                >
                  <View style={styles.podiumContentInner}>
                    <View style={styles.avatarContainer}>
                      <Avatar name={top3[2].name} size={56} />
                      <Text
                        style={[
                          styles.rankCircle,
                          {
                            backgroundColor: palette.primary,
                            color: palette.secondary,
                          },
                        ]}
                      >
                        3
                      </Text>
                    </View>
                    <Text
                      style={[styles.podiumName, { color: palette.text }]}
                      numberOfLines={1}
                    >
                      {top3[2].name}
                    </Text>
                    <Text style={[styles.podiumScore, { color: palette.text }]}>
                      {top3[2].exp}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {others.length > 0 && (
            <View
              style={{
                height: 1,
                backgroundColor: palette.borderColorAlt,
                borderRadius: 1,
                marginBottom: 12,
              }}
            />
          )}

          {others.slice(0, 4).map((player) => (
            <View
              key={player.id}
              style={[
                styles.listItem,
                { backgroundColor: palette.surfaceElevated },
              ]}
            >
              <View style={styles.rowLeft}>
                <Avatar name={player.name} size={40} />
                <Text
                  style={[styles.listName, { color: palette.text }]}
                >
                  {player.name}
                </Text>
              </View>
              <Text style={[styles.listScore, { color: palette.text }]}>
                {player.exp}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  function renderRivals() {
    const you = { name: "You", exp_week: rivals.find(r => r.isSelf)?.exp_week ?? 0 };

    if (rivals.length === 0) {
      return (
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={[styles.header, { color: palette.text }]}>Rival Standings</Text>
          <Text style={{ color: palette.mutedText, textAlign: "center" }}>
            No active rivals yet
          </Text>
        </View>
      );
    }

    const sorted = [...rivals]
      .filter(r => !r.isSelf)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

    return (
      <ScrollView
        style={[styles.page, { backgroundColor: palette.background }]}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={[styles.header, { color: palette.text }]}>
            Weekly Standings
          </Text>

          {sorted.map((r) => {
            const ahead = r.diff < 0;
            const difference = Math.abs(r.diff);

            return (
              <View
                key={r.id}
                style={[
                  styles.vsCard,
                  {
                    backgroundColor: palette.surfaceElevated,
                    borderColor: ahead ? "lime" : "tomato",
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={styles.vsRow}>
                  {/* You */}
                  <View style={styles.playerSide}>
                    <Avatar name="You" size={40} />
                    <Text style={[styles.vsName, { color: palette.text }]}>
                      You
                    </Text>
                    <Text
                      style={[
                        styles.vsScore,
                        { color: ahead ? "lime" : palette.text },
                      ]}
                    >
                      {you.exp_week} XP
                    </Text>
                  </View>

                  {/* Status */}
                  <Text
                    style={[
                      styles.vsStatus,
                      { color: ahead ? "lime" : "tomato" },
                    ]}
                  >
                    {ahead
                      ? `Ahead by ${difference}`
                      : `Behind by ${difference}`}
                  </Text>

                  {/* Rival */}
                  <View style={styles.playerSide}>
                    <Avatar name={r.name} size={40} />
                    <Text style={[styles.vsName, { color: palette.text }]}>
                      {r.name}
                    </Text>
                    <Text
                      style={[
                        styles.vsScore,
                        { color: ahead ? palette.text : "tomato" },
                      ]}
                    >
                      {r.exp_week} XP
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  const pages = [
    { key: "leaderboard", content: renderLeaderboard() },
    { key: "rivals", content: renderRivals() },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.tabBar, { backgroundColor: palette.surface }]}>
        {["Leaderboard", "Rivals"].map((label, i) => (
          <TouchableOpacity
            key={label}
            onPress={() => handleTabPress(i)}
            style={[
              styles.tabButton,
              activePage === i && {
                borderBottomColor: palette.primary,
                borderBottomWidth: 3,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activePage === i ? palette.primary : palette.text },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <View style={{ width }}>{item.content}</View>}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={onScrollEnd}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    marginBottom: 24,
    gap: 8,
  },
  podiumWrapper: {
    width: 110,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  podiumWrapper1: {
    height: 160,
  },
  podiumWrapper23: {
    height: 140,
  },
  badgeBottom: {
    position: "absolute",
    bottom: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 55,
    borderRightWidth: 55,
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
    justifyContent: "center",
    paddingBottom: 8,
  },
  podiumContentInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  crown: {
    position: "absolute",
    fontSize: 24,
    top: -18,
  },
  rankCircle: {
    position: "absolute",
    bottom: -8,
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: "hidden",
  },
  podiumName: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    maxWidth: "100%",
    paddingHorizontal: 4,
  },
  podiumScore: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    ...Shadow.card,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  listName: {
    fontSize: 20,
    fontWeight: "800",
    
  },
  listScore: {
    fontSize: 12,
    fontWeight: "bold",
  },
  page: {
    width,
    flex: 1,
    padding: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabButton: {
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  vsCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    ...Shadow.card,
  },
  vsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerSide: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  vsName: {
    fontWeight: "600",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  vsScore: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  vsStatus: {
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
    width: "40%",
  },
});
