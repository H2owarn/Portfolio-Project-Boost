export interface Muscle {
  id: string;
  name: string;
  icon: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleId: string;
  description: string;
  sets?: number;
  reps?: string;
  duration?: string;
}

export const MUSCLES: Muscle[] = [
  { id: 'chest', name: 'Chest', icon: 'fitness-center' },
  { id: 'back', name: 'Back', icon: 'fitness-center' },
  { id: 'shoulders', name: 'Shoulders', icon: 'fitness-center' },
  { id: 'biceps', name: 'Biceps', icon: 'fitness-center' },
  { id: 'triceps', name: 'Triceps', icon: 'fitness-center' },
  { id: 'legs', name: 'Legs', icon: 'fitness-center' },
  { id: 'glutes', name: 'Glutes', icon: 'fitness-center' },
  { id: 'core', name: 'Core', icon: 'fitness-center' },
];

export const EXERCISES_BY_MUSCLE: Record<string, Exercise[]> = {
  chest: [
    { id: 'push-ups', name: 'Push-ups', muscleId: 'chest', description: 'Classic bodyweight chest exercise', sets: 3, reps: '8-12' },
    { id: 'bench-press', name: 'Bench Press', muscleId: 'chest', description: 'Barbell chest press', sets: 3, reps: '6-10' },
    { id: 'chest-fly', name: 'Chest Fly', muscleId: 'chest', description: 'Dumbbell chest fly', sets: 3, reps: '10-15' },
    { id: 'dips', name: 'Dips', muscleId: 'chest', description: 'Parallel bar dips', sets: 3, reps: '8-12' },
  ],
  back: [
    { id: 'pull-ups', name: 'Pull-ups', muscleId: 'back', description: 'Upper body pulling exercise', sets: 3, reps: '5-10' },
    { id: 'rows', name: 'Rows', muscleId: 'back', description: 'Barbell or dumbbell rows', sets: 3, reps: '8-12' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', muscleId: 'back', description: 'Cable lat pulldown', sets: 3, reps: '10-15' },
    { id: 'deadlift', name: 'Deadlift', muscleId: 'back', description: 'Compound back exercise', sets: 3, reps: '5-8' },
  ],
  shoulders: [
    { id: 'overhead-press', name: 'Overhead Press', muscleId: 'shoulders', description: 'Military press', sets: 3, reps: '6-10' },
    { id: 'lateral-raise', name: 'Lateral Raise', muscleId: 'shoulders', description: 'Dumbbell lateral raise', sets: 3, reps: '12-15' },
    { id: 'front-raise', name: 'Front Raise', muscleId: 'shoulders', description: 'Dumbbell front raise', sets: 3, reps: '12-15' },
    { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscleId: 'shoulders', description: 'Reverse fly exercise', sets: 3, reps: '12-15' },
  ],
  biceps: [
    { id: 'bicep-curls', name: 'Bicep Curls', muscleId: 'biceps', description: 'Dumbbell bicep curls', sets: 3, reps: '10-15' },
    { id: 'hammer-curls', name: 'Hammer Curls', muscleId: 'biceps', description: 'Neutral grip curls', sets: 3, reps: '10-15' },
    { id: 'chin-ups', name: 'Chin-ups', muscleId: 'biceps', description: 'Underhand pull-ups', sets: 3, reps: '5-10' },
    { id: 'preacher-curls', name: 'Preacher Curls', muscleId: 'biceps', description: 'Preacher bench curls', sets: 3, reps: '10-12' },
  ],
  triceps: [
    { id: 'tricep-dips', name: 'Tricep Dips', muscleId: 'triceps', description: 'Chair or bench dips', sets: 3, reps: '10-15' },
    { id: 'close-grip-pushups', name: 'Close-Grip Push-ups', muscleId: 'triceps', description: 'Diamond push-ups', sets: 3, reps: '8-12' },
    { id: 'overhead-extension', name: 'Overhead Extension', muscleId: 'triceps', description: 'Tricep overhead extension', sets: 3, reps: '10-15' },
    { id: 'tricep-kickbacks', name: 'Tricep Kickbacks', muscleId: 'triceps', description: 'Dumbbell kickbacks', sets: 3, reps: '12-15' },
  ],
  legs: [
    { id: 'squats', name: 'Squats', muscleId: 'legs', description: 'Bodyweight or weighted squats', sets: 3, reps: '10-15' },
    { id: 'lunges', name: 'Lunges', muscleId: 'legs', description: 'Forward or reverse lunges', sets: 3, reps: '10-12 each leg' },
    { id: 'leg-press', name: 'Leg Press', muscleId: 'legs', description: 'Machine leg press', sets: 3, reps: '12-15' },
    { id: 'calf-raises', name: 'Calf Raises', muscleId: 'legs', description: 'Standing calf raises', sets: 3, reps: '15-20' },
  ],
  glutes: [
    { id: 'hip-thrusts', name: 'Hip Thrusts', muscleId: 'glutes', description: 'Glute bridge variations', sets: 3, reps: '12-15' },
    { id: 'bulgarian-split-squats', name: 'Bulgarian Split Squats', muscleId: 'glutes', description: 'Rear foot elevated squats', sets: 3, reps: '10-12 each leg' },
    { id: 'glute-bridges', name: 'Glute Bridges', muscleId: 'glutes', description: 'Basic glute bridge', sets: 3, reps: '15-20' },
    { id: 'clamshells', name: 'Clamshells', muscleId: 'glutes', description: 'Side-lying clamshells', sets: 3, reps: '15-20 each side' },
  ],
  core: [
    { id: 'planks', name: 'Planks', muscleId: 'core', description: 'Standard plank hold', sets: 3, duration: '30-60 seconds' },
    { id: 'crunches', name: 'Crunches', muscleId: 'core', description: 'Basic abdominal crunches', sets: 3, reps: '15-25' },
    { id: 'russian-twists', name: 'Russian Twists', muscleId: 'core', description: 'Seated twisting motion', sets: 3, reps: '20-30' },
    { id: 'mountain-climbers', name: 'Mountain Climbers', muscleId: 'core', description: 'Dynamic plank exercise', sets: 3, duration: '30-45 seconds' },
  ],
};

export function getExercisesForMuscle(muscleId: string): Exercise[] {
  return EXERCISES_BY_MUSCLE[muscleId] || [];
}

export function getMuscleById(muscleId: string): Muscle | undefined {
  return MUSCLES.find(muscle => muscle.id === muscleId);
}