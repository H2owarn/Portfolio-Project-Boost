const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateMMOName() {
  const prefixes = ["Trial", "Path", "Wrath", "Forge", "Shadow", "Heart", "Quest"];
  const suffixes = ["of Iron", "of Endurance", "of Balance", "of Shadows", "of Strength"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
    suffixes[Math.floor(Math.random() * suffixes.length)]
  }`;
}

function computeLevelRange(levels) {
  if (levels.includes("expert") || levels.includes("advanced")) {
    return { min: 21, max: 30 };
  } else if (levels.includes("intermediate")) {
    return { min: 11, max: 20 };
  } else {
    return { min: 1, max: 10 };
  }
}

function deriveGoal(group) {
  return group[0]?.category || "general";
}

async function generateQuests() {
  // 1. Fetch all exercises from Supabase
  const { data: exercises, error } = await supabase.from("exercises").select("*");
  if (error) throw error;
  console.log("Exercises count:", exercises.length);

  let quests = [];
  let questId = 1;

  // 2. Side quests: beginner + body only
  const sideExercises = exercises.filter(
    (ex) => ex.level === "beginner" && ex.equipment === "body only"
  );

  for (let i = 0; i < sideExercises.length; i += 2) {
    const group = sideExercises.slice(i, i + 2);
    quests.push({
      id: questId++,
      name: generateMMOName(),
      quest_type: "side",
      min_level: 1,
      max_level: 10,
      goal: deriveGoal(group),
      exercise_ids: group.map((ex) => ex.id),
    });
  }

  // 3. Main quests: group by 4
  for (let i = 0; i < exercises.length; i += 4) {
    const group = exercises.slice(i, i + 4);
    const levels = group.map((ex) => ex.level);
    const questLevelRange = computeLevelRange(levels);

    quests.push({
      id: questId++,
      name: generateMMOName(),
      quest_type: "main",
      min_level: questLevelRange.min,
      max_level: questLevelRange.max,
      goal: deriveGoal(group),
      exercise_ids: group.map((ex) => ex.id),
    });
  }

  console.log(`Generated ${quests.length} quests`);

  // 4. Insert into Supabase
  const { error: insertError } = await supabase.from("quests").insert(quests);
  if (insertError) {
    console.error("❌ Insert error:", insertError.message);
  } else {
    console.log("✅ All quests inserted into Supabase!");
  }
}

generateQuests().catch(console.error);
