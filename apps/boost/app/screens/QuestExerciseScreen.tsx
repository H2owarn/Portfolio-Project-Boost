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
  const [sets, setSets] = useState('3');
const [reps, setReps] = useState('10');

  // ✅ Fetch quest info (non-blocking)
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

  // ✅ Simple image loading indicator (no prefetch)
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentImageIndex(index);
  };

  const handleCompleteQuestExercise = async () => {
    if (!data || !quest_id) return;

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        Alert.alert("Login Required", "Please log in to complete quest exercises.");
        setLoading(false);
        return;
      }

      const { error: progressErr } = await supabase
        .from("completed_quest_exercises")
        .upsert({
          user_id: user.id,
          quest_id,
          exercise_id: data.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (progressErr) {
        console.error("Quest exercise insert error:", progressErr);
        Alert.alert("Error", "Failed to record quest exercise progress.");
      } else {
        Alert.alert(
          "✅ Exercise Complete",
          `You finished ${data.name} and earned ${quest?.xp_reward ?? 0} XP from the quest!`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
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
      <Stack.Screen options={{ title: data.name }} />
      <ScrollView style={[styles.container, { backgroundColor: palette.background }]}>

        {/* Quest Info (renders instantly with placeholders) */}
        <View style={styles.questHeader}>
          <Text style={[styles.questName, { color: palette.primary }]}>
            {quest?.name}
          </Text>
          <Text style={[styles.questType, { color: palette.mutedText }]}>
            {quest?.quest_type?.toUpperCase() ?? ""}
          </Text>
          {quest?.xp_reward && (
            <View style={styles.questReward}>
              <MaterialIcons name="star" size={18} color={palette.primary} />
              <Text style={[styles.rewardText, { color: palette.text }]}>
                {quest.xp_reward} XP Reward
              </Text>
            </View>
          )}
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
                  {imageLoading[index] && (
                    <ActivityIndicator
                      size="large"
                      color={palette.primary}
                      style={styles.imageLoader}
                    />
                  )}
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
            <Text style={[styles.noImageText, { color: palette.mutedText }]}>No images available</Text>
          </View>
        )}

        {/* Exercise Level and Category Tags */}
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

        {/* Sets & Reps Input */}
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
                    borderColor: palette.borderColor
                }
                ]}
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
                placeholder="3"
                placeholderTextColor={palette.mutedText}
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
                    borderColor: palette.borderColor
                }
                ]}
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
                placeholder="12"
                placeholderTextColor={palette.mutedText}
            />
            </View>
        </View>
        </View>

        {/* Complete Button */}
        <Pressable
          style={[
            styles.completeButton,
            { backgroundColor: palette.primary },
            loading && { opacity: 0.6 },
          ]}
          onPress={handleCompleteQuestExercise}
          disabled={loading}
        >
          <MaterialIcons name="check-circle" size={24} color="#000" />
          <Text style={styles.completeText}>
            {loading ? "Saving..." : "Finish Workout"}
          </Text>
        </Pressable>

        {/* Exercise Info */}
        {data.instructions && data.instructions.length > 0 && (
        <View style={[styles.instructionsCard, { backgroundColor: palette.surface }]}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Instructions</Text>
            {data.instructions.map((instruction, index) => (
            <View key={`instruction-${index}`} style={styles.instructionItem}>
                <View style={[styles.stepNumber, { backgroundColor: palette.primary + '20' }]}>
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
    padding: Spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  questName: { fontSize: 22, fontWeight: "bold" },
  questType: { fontSize: 14, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },
  questReward: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  carouselSection: { width, height: width * 0.75, backgroundColor: "#000", position: "relative" },
  imageContainer: { width, height: width * 0.75, justifyContent: "center", alignItems: "center" },
  exerciseImage: { width: "100%", height: "100%" },
  imageLoader: { position: "absolute" },
  paginationDots: { position: "absolute", top: 12, right: 12, flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  noImageContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  noImageText: { fontSize: 16, fontWeight: "500" },
  infoSection: { padding: Spacing.lg, gap: Spacing.sm },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14 },
  instructions: { marginTop: 8, gap: 4 },
  instructionText: { fontSize: 15, lineHeight: 22 },
  rewardText: { fontSize: 16, fontWeight: "600" },
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
 instructionFullText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22
  },
instructionsCard: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    gap: Spacing.md
},
sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs
},
instructionItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start'
},
stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
},
stepNumberText: {
    fontSize: 14,
    fontWeight: '700'
},
inputCard: {
    padding: Spacing.sm,
    borderRadius: Radii.lg,
    gap: Spacing.sm
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md
  },
  inputGroup: {
    flex: 1,
    gap: Spacing.xs
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    height: 56,
    borderRadius: Radii.md,
    borderWidth: 2,
    paddingHorizontal: Spacing.md,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },


});
