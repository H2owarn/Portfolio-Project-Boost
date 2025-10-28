import { supabase } from "@/lib/supabase";
import { awardBadge } from "@/utils/badgeHelpers";

export async function checkAndAwardBadges(userId: string) {
  // --- First Workout ---
  const { count: workoutCount } = await supabase
    .from("workout_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const totalWorkouts = workoutCount ?? 0;

  if (totalWorkouts === 1) await awardBadge(userId, "First Workout");
  if (totalWorkouts === 10) await awardBadge(userId, "10 Workouts");

  // --- Charged Up ---
  const { data: staminaData } = await supabase
    .from("completed_exercises")
    .select("stamina_spent")
    .eq("user_id", userId);

  const totalStamina = (staminaData ?? []).reduce(
    (sum, e) => sum + (e.stamina_spent || 0),
    0
  );

  if (totalStamina >= 100) await awardBadge(userId, "Charged Up");

  // --- Rising Star ---
  const { count: friendsCount } = await supabase
    .from("relationships")
    .select("*", { count: "exact", head: true })
    .eq("user_1_id", userId)
    .eq("status", "accepted");

  const totalFriends = friendsCount ?? 0;

  if (totalFriends >= 5) await awardBadge(userId, "Rising Star");

  // --- No Rest ---
  const { count: questCount } = await supabase
    .from("quests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  const totalQuests = questCount ?? 0;

  if (totalQuests >= 5) await awardBadge(userId, "No Rest");

  // --- Boost ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("level")
    .eq("id", userId)
    .single();

  if ((profile?.level ?? 0) >= 10) await awardBadge(userId, "Boost");
}
