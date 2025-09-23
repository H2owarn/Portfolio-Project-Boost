import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function QuestsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Main Quest */}
      <View style={styles.questCard}>
        <Text style={styles.questTitle}>Main quest</Text>
        <View style={styles.questItem}>
          <View style={styles.checkbox} />
          <Text style={styles.questText}>Defeat the dragon</Text>
        </View>
        <View style={styles.questItem}>
          <View style={styles.checkbox} />
          <Text style={styles.questText}>Find the magic sword</Text>
        </View>
        <View style={styles.questItem}>
          <View style={styles.checkbox} />
          <Text style={styles.questText}>Rescue the princess</Text>
        </View>
      </View>

      {/* Side Quest */}
      <View style={styles.questCard}>
        <Text style={styles.questTitle}>Side quest</Text>
        <View style={styles.questItem}>
          <View style={styles.checkbox} />
          <Text style={styles.questText}>Collect 10 herbs</Text>
        </View>
        <View style={styles.questItem}>
          <View style={styles.checkbox} />
          <Text style={styles.questText}>Help the villager</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 16,
  },
  questCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  questItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  questText: {
    fontSize: 14,
  },
});
