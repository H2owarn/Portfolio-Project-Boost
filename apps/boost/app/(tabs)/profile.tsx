import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import * as Progress from "react-native-progress";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header: Avatar + Name + Stamina */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>Username</Text>
          <Progress.Bar
            progress={0.6} // TODO: replace with user stamina value
            width={150}
            color="#f59e0b"
            unfilledColor="#eee"
            borderWidth={1}
            height={14}
          />
          <Text style={styles.staminaText}>stamina bar</Text>
        </View>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchBox}
        placeholder="find some thing..."
      />

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text>Summary</Text>
      </View>

      {/* Three Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}></View>
        <View style={styles.statBox}></View>
        <View style={styles.statBox}></View>
      </View>

      {/* Quest Section */}
      <Link href="/quests" asChild>
        <View style={styles.questBox}>
          <Text>Quest</Text>
        </View>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  staminaText: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statBox: {
    flex: 1,
    height: 80,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  questBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  questDetailBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

});
