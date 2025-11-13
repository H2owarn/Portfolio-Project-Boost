import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, ScrollView, Image,TouchableOpacity, ActivityIndicator, Dimensions, StatusBar, SafeAreaView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors, Radii, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getBadgeImage } from "@/utils/getbadgeimage";
import { useAuth } from "@/hooks/use-auth";
import { playPreloaded, playSound } from "@/utils/sound";

const { width } = Dimensions.get("window");

interface Badge {
  id: number;
  name: string;
  description: string;
  asset_key: string;
}

interface UserBadge {
  badge_id: number;
  awarded_at: string;
  badges: Badge;
}

export default function BadgesScreen() {
  const { authedProfile: profile } = useAuth();
  const palette = Colors[useColorScheme() ?? "dark"];
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const loadBadges = React.useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all available badges
      const { data: allBadgesData, error: allBadgesError } = await supabase
        .from("badges")
        .select("*")
        .order("id", { ascending: true });

      if (allBadgesError) throw allBadgesError;

      // Fetch user's earned badges
      const { data: earnedBadgesData, error: earnedBadgesError } = await supabase
        .from("user_badges")
        .select(`
          badge_id,
          awarded_at,
          badges!inner (
            id,
            name,
            description,
            asset_key
          )
        `)
        .eq("user_id", profile.id);

      if (earnedBadgesError) throw earnedBadgesError;

      setAllBadges(allBadgesData ?? []);
      setEarnedBadges((earnedBadgesData ?? []) as unknown as UserBadge[]);
    } catch (error) {
      console.error("Error loading badges:", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  const isBadgeEarned = (badgeId: number): boolean => {
    return earnedBadges.some((ub) => ub.badge_id === badgeId);
  };

  const handleBadgePress = async (badge: Badge) => {
    try {
      await playPreloaded("click");
    } catch {
      await playSound(require("@/assets/sound/tap.wav"));
    }
    setSelectedBadge(badge);
  };

  const handleBack = async () => {
    try {
      await playPreloaded("click");
    } catch {
      await playSound(require("@/assets/sound/tap.wav"));
    }
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.loadingText, { color: palette.text }]}>
          Loading badges...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <Stack.Screen 
        options={{
          title: "Your Badges",
          headerShown: false,
        }} 
      />
      <StatusBar barStyle="light-content" backgroundColor={palette.background} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: palette.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={palette.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.text }]}>Your Badges</Text>
        <View style={styles.backButton} />
      </View>

      {/* Stats Summary */}
      <View style={[styles.statsCard, { backgroundColor: palette.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.primary }]}>
            {earnedBadges.length}
          </Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>
            Earned
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.borderColor }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.text }]}>
            {allBadges.length}
          </Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>
            Total
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.borderColor }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: palette.text }]}>
            {allBadges.length > 0 ? Math.round((earnedBadges.length / allBadges.length) * 100) : 0}%
          </Text>
          <Text style={[styles.statLabel, { color: palette.mutedText }]}>
            Complete
          </Text>
        </View>
      </View>

      {/* Badges Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.badgesGrid}>
          {allBadges.map((badge) => {
            const isEarned = isBadgeEarned(badge.id);
            return (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: palette.surface,
                    borderColor: isEarned ? palette.primary : palette.borderColor,
                    borderWidth: isEarned ? 2 : 1,
                  },
                ]}
                onPress={() => handleBadgePress(badge)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.badgeImageContainer,
                    {
                      backgroundColor: isEarned
                        ? palette.surfaceElevated
                        : palette.background,
                    },
                  ]}
                >
                  <Image
                    source={getBadgeImage(badge.asset_key)}
                    style={[
                      styles.badgeImage,
                      !isEarned && styles.badgeImageLocked,
                    ]}
                  />
                  {isEarned && (
                    <View
                      style={[
                        styles.earnedIndicator,
                        { backgroundColor: palette.primary },
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="#000" />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    {
                      color: isEarned ? palette.text : palette.mutedText,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedBadge(null)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: palette.surface }]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: palette.background }]}
              onPress={() => setSelectedBadge(null)}
            >
              <Ionicons name="close" size={24} color={palette.text} />
            </TouchableOpacity>

            <View
              style={[
                styles.modalBadgeContainer,
                {
                  backgroundColor: isBadgeEarned(selectedBadge.id)
                    ? palette.surfaceElevated
                    : palette.background,
                },
              ]}
            >
              <Image
                source={getBadgeImage(selectedBadge.asset_key)}
                style={[
                  styles.modalBadgeImage,
                  !isBadgeEarned(selectedBadge.id) && styles.badgeImageLocked,
                ]}
              />
            </View>

            <Text style={[styles.modalBadgeName, { color: palette.text }]}>
              {selectedBadge.name}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isBadgeEarned(selectedBadge.id)
                    ? palette.primary + "20"
                    : palette.mutedText + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isBadgeEarned(selectedBadge.id)
                      ? palette.primary
                      : palette.mutedText,
                  },
                ]}
              >
                {isBadgeEarned(selectedBadge.id) ? "✓ Earned" : "🔒 Locked"}
              </Text>
            </View>

            <Text style={[styles.modalDescription, { color: palette.mutedText }]}>
              {selectedBadge.description}
            </Text>

            {isBadgeEarned(selectedBadge.id) && (
              <Text style={[styles.earnedDate, { color: palette.mutedText }]}>
                Earned on:{" "}
                {new Date(
                  earnedBadges.find((b) => b.badge_id === selectedBadge.id)
                    ?.awarded_at ?? ""
                ).toLocaleDateString()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  statsCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: Radii.lg,
    padding: 20,
    ...Shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: "100%",
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  badgeCard: {
    width: (width - 60) / 3,
    marginBottom: 16,
    borderRadius: Radii.md,
    padding: 12,
    alignItems: "center",
    ...Shadow.card,
  },
  badgeImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  badgeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badgeImageLocked: {
    opacity: 0.3,
  },
  earnedIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width - 60,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    ...Shadow.card,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBadgeContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  modalBadgeImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  modalBadgeName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  earnedDate: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
