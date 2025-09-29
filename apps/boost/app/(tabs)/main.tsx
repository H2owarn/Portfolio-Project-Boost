import { View, Text, StyleSheet, Image, ScrollView, Pressable} from "react-native";
import * as Progress from "react-native-progress";

export default function DashboardPage() {
  const user = {
    name: "IAN",
    level: 1,
    xp: 40,
    xpRequired: 100,
    avatar: "https://via.placeholder.com/80",
    quests: ["👑", "🦴", "💎", "🌚", "⭐"],
    friends: [
      { id: "1", name: "Bailey Dupont", level: 99, avatar: "https://via.placeholder.com/60" },
      { id: "2", name: "Pedro Fernandes", level: 50, avatar: "https://via.placeholder.com/60" },
    ],
  };

  return (
    <ScrollView
    contentInset={{ top: 45 }} contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLevel}>Level {user.level}</Text>
          <Progress.Bar
            progress={user.xp / user.xpRequired}
            width={220}
            height={12}
            color="#4cafef"
            unfilledColor="#ddd"
            borderWidth={1}
            borderColor="#ccc"
            style={{ marginTop: 6 }}
          />
          <Text style={styles.xpText}>
            {user.xp}/{user.xpRequired} XP
          </Text>
        </View>
      </View>

      {/* QUESTS */}
      <View style={styles.questSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUEST</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.questGrid}>
          {user.quests.map((emoji, idx) => (
            <View key={idx} style={styles.hexagon}>
              <Text style={styles.questEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.quickStartBtn}>
          <Text style={styles.quickStartText}>QUICK START</Text>
        </Pressable>
      </View>

      {/* RECOMMENDED */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All ▾</Text>
          </Pressable>
        </View>
        {user.friends.map((friend) => (
          <View key={friend.id} style={styles.recommendCard}>
            <Image source={{ uri: friend.avatar }} style={styles.recommendAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recommendName}>{friend.name}</Text>
              <Text style={styles.recommendLevel}>Level {friend.level}</Text>
            </View>
            <Text style={styles.arrow}>➡️</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d1b2a",
    flex: 1,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0d1b2a",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
  },
  userName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  userLevel: { fontSize: 14, color: "#ddd" },
  xpText: { fontSize: 12, color: "#ccc", marginTop: 2 },
  questSection: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -10, // overlap effect
  },
  section: { padding: 20, backgroundColor: "#fff" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
  seeAll: { fontSize: 14, color: "#007bff" },
  questGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  hexagon: {
    width: 90,
    height: 90,
    margin: 8,
    backgroundColor: "#dce8ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  questEmoji: { fontSize: 28 },
  quickStartBtn: {
    backgroundColor: "#4a6cf7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  quickStartText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  recommendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  recommendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  recommendName: { fontSize: 14, fontWeight: "600", color: "#fff" },
  recommendLevel: { fontSize: 12, color: "#ccc" },
  arrow: { fontSize: 18, color: "#fff" },
});
