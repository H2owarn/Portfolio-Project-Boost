import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

export default function QuestSelection() {
  // Dummy quests for testing
  const quests = [
    {
      id: "1",
      title: "Strength Challenge 1",
      description: "Progressive strength workout designed to push your limits",
      type: "main",
      difficulty: 1,
      xpReward: 30,
      staminaCost: 25,
      duration: "15 min",
      exercises: ["Push-ups", "Squats"],
    },
    {
      id: "2",
      title: "Strength Challenge 2",
      description: "Progressive strength workout designed to push your limits",
      type: "main",
      difficulty: 2,
      xpReward: 40,
      staminaCost: 30,
      duration: "20 min",
      exercises: ["Push-ups", "Squats", "Plank"],
    },
    {
      id: "3",
      title: "Quick Boost",
      description: "Quick and easy workout for motivation boost",
      type: "side",
      difficulty: 1,
      xpReward: 10,
      staminaCost: 10,
      duration: "5 min",
      exercises: ["Jumping Jacks"],
    },
  ];

  const userLevel = 1;
  const userStamina = 40;

  const mainQuests = quests.filter((q) => q.type === "main");
  const sideQuests = quests.filter((q) => q.type === "side");

  const canStartQuest = (quest: any) =>
    userStamina >= quest.staminaCost && userLevel >= quest.difficulty;

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "#4CAF50"; // green
    if (difficulty <= 4) return "#FFC107"; // yellow
    return "#F44336"; // red
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return "Easy";
    if (difficulty <= 4) return "Medium";
    return "Hard";
  };

  const QuestCard = ({ quest }: { quest: any }) => {
    const canStart = canStartQuest(quest);
    const isLocked = userLevel < quest.difficulty;

    return (
      <View style={[styles.card, !canStart && { opacity: 0.6 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>
            {quest.type === "main" ? "⚔️" : "⭐"}
          </Text>
          <Text style={styles.cardTitle}>{quest.title}</Text>
          {isLocked && (
            <View style={styles.lockedTag}>
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          )}
        </View>

        <Text style={styles.description}>{quest.description}</Text>

        <View style={styles.tagsRow}>
          <View
            style={[
              styles.difficultyTag,
              { backgroundColor: getDifficultyColor(quest.difficulty) },
            ]}
          >
            <Text style={styles.tagText}>
              {getDifficultyLabel(quest.difficulty)}
            </Text>
          </View>
          <Text style={styles.tag}>⚡ {quest.xpReward} XP</Text>
          <Text style={styles.tag}>🕐 {quest.duration}</Text>
        </View>

        <View style={styles.exercisesBox}>
          <Text style={styles.exercisesTitle}>Exercises:</Text>
          <View style={styles.exercisesRow}>
            {quest.exercises.map((ex: string, i: number) => (
              <Text key={i} style={styles.exercise}>
                {ex}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.stamina}>Stamina Cost: {quest.staminaCost}</Text>
          <Pressable
            style={[
              styles.startButton,
              { backgroundColor: canStart ? "#007bff" : "#ccc" },
            ]}
            disabled={!canStart}
            onPress={() => console.log("Quest Selected:", quest.title)}
          >
            <Text style={styles.startButtonText}>
              {isLocked
                ? `Level ${quest.difficulty} Required`
                : userStamina < quest.staminaCost
                ? "Not Enough Stamina"
                : "Start Quest"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentInset={{ top: 45 }} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => console.log("Back pressed")}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Choose Your Quest</Text>
      </View>

      {/* Main Quests */}
      <Text style={styles.sectionTitle}>⚔️ Main Quests</Text>
      {mainQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}

      {/* Side Quests */}
      <Text style={styles.sectionTitle}>⭐ Side Quests</Text>
      {sideQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  backButton: {
    backgroundColor: "#ffffff33",
    padding: 8,
    borderRadius: 8
  },
  backText: {
    color: "#fff",
    fontWeight: "600"
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8 },
  icon: {
    fontSize: 20,
    marginRight: 8 },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600" },
  lockedTag: {
    backgroundColor: "#f8d7da",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6 },
  lockedText: {
    color: "#721c24",
    fontSize: 12,
    fontWeight: "600"
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    marginRight: 6
  },
  exercisesBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4
  },
  exercisesRow: {
    flexDirection: "row",
    flexWrap: "wrap" },
  exercise: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 4
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  stamina: {
    fontSize: 13,
    color: "#666"
  },
  startButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
});
