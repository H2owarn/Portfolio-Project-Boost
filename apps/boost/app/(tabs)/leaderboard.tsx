import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// 🎨 Custom Theme Colors
const colors = {
  primary: "#7DF843",
  secondary: "#1F2937",
  backgroundDark: "#000000",
  backgroundLight: "#FFFFFF",
  textDark: "#F9FAFB",
  textLight: "#111827",
};

// Dummy leaderboard data
const leaderboardData = [
  { id: 1, name: "Number one", score: 25456 },
  { id: 2, name: "Number two", score: 25456 },
  { id: 3, name: "Number three", score: 25456 },
  { id: 4, name: "Random name", score: 25456 },
  { id: 5, name: "Random name", score: 25456 },
  { id: 6, name: "Random name", score: 25456 },
  { id: 7, name: "Random name", score: 25456 },
];

export default function LeaderboardPage() {
  const top3 = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  return (
	<ScrollView style={styles.container}>
	  <Text style={styles.header}>Leaderboard</Text>

	  {/* Top 3 podium */}
	  <View style={styles.podiumRow}>
		{/* 2nd place */}
		<View style={[styles.podiumBox, { height: 110 }]}>
		  <View style={styles.avatar} />
		  <Text style={[styles.rankCircle, styles.rankCircle1]}>2</Text>
		  <Text style={[styles.podiumName23, styles.podiumName]}>{top3[1].name}</Text>
		  <Text style={styles.podiumScore}>{top3[1].score}</Text>
		</View>

		{/* 1st place */}
		<View style={[styles.podiumBox, { height: 120 }]}>
		  <View style={[styles.avatar, styles.avatar1]}>
			<Text style={styles.crown}>👑</Text>
		  </View>
		  <Text style={styles.rankCircle}>1</Text>
		  <Text style={[styles.podiumName1, styles.podiumName]}>{top3[0].name}</Text>
		  <Text style={[styles.podiumScore, styles.podiumScore1]}>{top3[0].score}</Text>
		</View>

		{/* 3rd place */}
		<View style={[styles.podiumBox, { height: 110 }]}>
		  <View style={styles.avatar} />
		  <Text style={[styles.rankCircle, styles.rankCircle1]}>3</Text>
		  <Text style={[styles.podiumName23, styles.podiumName]}>{top3[2].name}</Text>
		  <Text style={styles.podiumScore}>{top3[2].score}</Text>
		</View>
	  </View>

	  {/* Other leaderboard entries */}
	  {others.map((player) => (
		<View key={player.id} style={styles.listItem}>
		  <View style={styles.rowLeft}>
			<View style={styles.smallAvatar} />
			<Text style={styles.listName}>{player.name}</Text>
		  </View>
		  <Text style={styles.listScore}>{player.score}</Text>
		</View>
	  ))}
	</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: colors.backgroundDark,
	padding: 16,
  },
  header: {
	fontSize: 28,
	fontWeight: "bold",
	textAlign: "center",
	marginBottom: 90,
	color: colors.primary,
  },
  podiumRow: {
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "flex-end",
	marginBottom: 30,
  },
  podiumBox: {
	marginHorizontal: 6,
	backgroundColor: colors.secondary,
	borderRadius: 12,
	alignItems: "center",
	justifyContent: "flex-end",
	padding: 8,
  },
  avatar: {
	width: 70,
	height: 70,
	borderRadius: 35,
	backgroundColor: colors.textLight,
	marginBottom: 6,
	alignItems: "center",
	justifyContent: "center",
	bottom: 25,
  },
  avatar1: {
  bottom: 45,
  },

  crown: {
	position: "absolute",
	fontSize: 24,
	top: -22,
  },
  rankCircle: {
	position: "absolute",
	bottom: 90,
	backgroundColor: colors.primary,
	color: colors.textLight,
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
	color: colors.textDark,
	textAlign: "center",
  },
  podiumName1: {
	top:-30,
  },
  podiumName23: {
	top:-10,
  },
  podiumScore: {
	color: colors.textDark,
	fontSize: 13,
	textAlign: "center",
  },
  podiumScore1 :{
	top: -20,
  },
  listItem: {
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	backgroundColor: colors.secondary,
	borderRadius: 12,
	padding: 12,
	marginBottom: 10,
  },
  rowLeft: {
	flexDirection: "row",
	alignItems: "center",
  },
  smallAvatar: {
	width: 40,
	height: 40,
	borderRadius: 20,
	backgroundColor: colors.textLight,
	marginRight: 10,
  },
  listName: {
	fontSize: 16,
	fontWeight: "500",
	color: colors.textDark,
  },
  listScore: {
	fontSize: 14,
	fontWeight: "bold",
	color: colors.textDark,
  },
});
