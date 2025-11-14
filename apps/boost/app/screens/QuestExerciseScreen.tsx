import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors, Spacing, Radii } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { playPreloaded, playSound } from "@/utils/sound";

const { width } = Dimensions.get("window");

type Exercise = {
  id: number;
  name: string;
  instructions: string[];
  images?: string[];
  category?: string;
  level?: string;
};

type Quest = {
  id: number;
  name: string;
  quest_type: string;
  xp_reward: number;
};

export default function QuestExerciseScreen() {
  const { exercise, quest_id } = useLocalSearchParams<{ exercise: string; quest_id: string }>();
  const palette = Colors[useColorScheme() ?? "dark"];

  const data: Exercise | null = exercise ? JSON.parse(exercise) : null;
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");

  useEffect(() => {
    const loadQuest = async () => {
      if (!quest_id) return;
      const { data: questData, error } = await supabase
        .from("quests")
        .select("id, name, quest_type, xp_reward")
        .eq("id", quest_id)
        .single();

      if (error) console.error("Quest fetch error:", error);
      else setQuest(questData);
    };
    loadQuest();
  }, [quest_id]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentImageIndex(index);
  };

  const handleCompleteQuestExercise = async () => {
    if (!data || !quest_id) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Login Required", "Please log in to complete quest exercises.");
        return;
      }

      const { error: insertErr } = await supabase
        .from("completed_quest_exercises")
        .upsert({
          user_id: user.id,
          quest_id,
          exercise_id: data.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (insertErr) {
        console.error("Quest exercise insert error:", insertErr);
        Alert.alert("Error", "Failed to record quest exercise progress.");
        return;
      }


      const { data: questRow } = await supabase
        .from("user_quests")
        .select("status")
        .eq("user_id", user.id)
        .eq("quest_id", quest_id)
        .single();

      if (questRow?.status === "active") {
        await supabase
          .from("user_quests")
          .update({ status: "complete" })
          .eq("user_id", user.id)
          .eq("quest_id", quest_id);
      }


      try {
        await playPreloaded("achieve");
      } catch {
        await playSound(require("@/assets/sound/achievement.wav"));
      }


      Alert.alert(
        "Exercise Complete!",
        `You finished ${data.name}! Progress saved toward your quest.`,
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                await playPreloaded("click");
              } catch {
                await playSound(require("@/assets/sound/tap.wav"));
              }
              router.back();
            },
          },
        ]
      );
    } catch (err) {
      console.error("Error completing quest exercise:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No exercise data found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: data.name, headerBackTitle: 'Back' }} />
      <ScrollView style={[styles.container, { backgroundColor: palette.background }]}>
        {/* Quest Info */}
        <View style={styles.questHeader}>
          <Text style={[styles.questName, { color: palette.primary }]}>{quest?.name}</Text>
          <Text style={[styles.questType, { color: palette.mutedText }]}>
            {quest?.quest_type?.toUpperCase() ?? ""}
          </Text>

          <View style={styles.questRewardRow}>
            <View style={[styles.questReward, { backgroundColor: palette.primary + "20" }]}>
              <MaterialIcons name="star" size={18} color={palette.primary} />
              <Text style={[styles.rewardText, { color: palette.text }]}>
                {quest?.xp_reward ?? 0} XP Reward
              </Text>
            </View>

          </View>
        </View>

        {/* Exercise Images */}
        {data.images && data.images.length > 0 ? (
          <View style={styles.carouselSection}>
            <FlatList
              ref={flatListRef}
              data={data.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item }}
                    style={styles.exerciseImage}
                    resizeMode="contain"
                    onLoadStart={() => setImageLoading((prev) => ({ ...prev, [index]: true }))}
                    onLoad={() => setImageLoading((prev) => ({ ...prev, [index]: false }))}
                    onError={() => setImageLoading((prev) => ({ ...prev, [index]: false }))}
                  />
                </View>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          </View>
        ) : (
          <View style={[styles.carouselSection, styles.noImageContainer]}>
            <MaterialIcons name="image-not-supported" size={64} color={palette.mutedText} />
            <Text style={[styles.noImageText, { color: palette.mutedText }]}>
              No images available
            </Text>
          </View>
        )}

        {/* Exercise Tags */}
        <View style={styles.tagsRow}>
          {data.level && (
            <View style={[styles.tag, { backgroundColor: palette.surfaceElevated }]}>
              <MaterialIcons name="signal-cellular-alt" size={16} color={palette.primary} />
              <Text style={[styles.tagText, { color: palette.primary }]}>
                {data.level.charAt(0).toUpperCase() + data.level.slice(1)}
              </Text>
            </View>
          )}
          {data.category && (
            <View style={[styles.tag, { backgroundColor: palette.surfaceElevated }]}>
              <MaterialIcons name="fitness-center" size={16} color={palette.primary} />
              <Text style={[styles.tagText, { color: palette.primary }]}>
                {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Sets & Reps */}
        <View style={[styles.inputCard, { backgroundColor: palette.surface }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Your Workout</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: palette.mutedText }]}>Sets</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.background,
                    color: palette.text,
                    borderColor: palette.borderColor,
                  },
                ]}
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: palette.mutedText }]}>Reps</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.background,
                    color: palette.text,
                    borderColor: palette.borderColor,
                  },
                ]}
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Instructions */}
        {data.instructions && data.instructions.length > 0 && (
          <View style={[styles.instructionsCard, { backgroundColor: palette.surface }]}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Instructions</Text>
            {data.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View style={[styles.stepNumber, { backgroundColor: palette.primary + "20" }]}>
                  <Text style={[styles.stepNumberText, { color: palette.primary }]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[styles.instructionFullText, { color: palette.mutedText }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  questHeader: {
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  questName: { fontSize: 22, fontWeight: "bold" },
  questType: { fontSize: 14, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },
  questRewardRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  questReward: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  rewardText: { fontSize: 16, fontWeight: "600" },
  tagsRow: { flexDirection: "row", gap: 10, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: { fontSize: 13, fontWeight: "600" },
  carouselSection: { width, height: width * 0.75, backgroundColor: "#000" },
  imageContainer: { width, height: width * 0.75, justifyContent: "center", alignItems: "center" },
  exerciseImage: { width: "100%", height: "100%" },
  imageLoader: { position: "absolute" },
  noImageContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  noImageText: { fontSize: 16, fontWeight: "500" },
  inputCard: { padding: Spacing.sm, borderRadius: Radii.lg, gap: Spacing.sm, marginBottom: 10 },
  inputRow: { flexDirection: "row", gap: Spacing.md },
  inputGroup: { flex: 1, gap: Spacing.xs },
  inputLabel: { fontSize: 14, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    height: 56,
    borderRadius: Radii.md,
    borderWidth: 2,
    paddingHorizontal: Spacing.md,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  completeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  completeText: { fontSize: 18, fontWeight: "700", color: "#000" },
  instructionsCard: { padding: Spacing.md, borderRadius: Radii.lg, gap: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: Spacing.xs },
  instructionItem: { flexDirection: "row", gap: Spacing.sm, alignItems: "flex-start" },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberText: { fontSize: 14, fontWeight: "700" },
  instructionFullText: { flex: 1, fontSize: 14, lineHeight: 22 },
});
