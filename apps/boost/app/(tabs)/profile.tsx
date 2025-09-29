import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";

export default function ProfilePage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          <Text style={{ fontSize: 32 }}>👤</Text>
        </View>
      </View>

      {/* Name + Info */}
      <Text style={styles.name}>Ian Gibson</Text>
      <Text style={styles.subtext}>Joined February 2022</Text>
      <Text style={[styles.subtext, { color: "#007bff" }]}>0 Friends</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Friends</Text>
        </Pressable>
        <Pressable style={styles.shareButton}>
          <Text style={{ fontSize: 18 }}>🔗</Text>
        </Pressable>
      </View>

      {/* Overview */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>112</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>12716</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={styles.statValue}>Emerald</Text>
          <Text style={styles.statLabel}>Current league</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Rivals */}
      <Text style={styles.sectionTitle}>Rivals</Text>
      <View style={styles.rivalsRow}>
        <View style={styles.rival}>
          <View style={styles.rivalCircle}>
            <Text>👤</Text>
          </View>
          <Text style={styles.rivalName}>Kaj Kennedy</Text>
        </View>
        <View style={styles.rival}>
          <View style={styles.rivalCircle}>
            <Text>👤</Text>
          </View>
          <Text style={styles.rivalName}>WaWa</Text>
        </View>
        <View style={styles.rival}>
          <View style={styles.rivalCircle}>
            <Text>👤</Text>
          </View>
          <Text style={styles.rivalName}>Jin Lieu</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  avatarWrapper: {
    marginBottom: 10,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: 140,
    alignItems: "center",
    margin: 6,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  rivalsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  rival: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  rivalCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  rivalName: {
    fontSize: 12,
    fontWeight: "500",
  },
});
