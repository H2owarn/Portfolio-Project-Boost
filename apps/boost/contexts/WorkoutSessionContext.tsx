import { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';

type WorkoutSessionContextType = {
  currentSessionId: string | null;
  startWorkout: () => Promise<void>;
  endWorkout: () => Promise<void>;
};

const WorkoutSessionContext = createContext<WorkoutSessionContextType>({
  currentSessionId: null,
  startWorkout: async () => {},
  endWorkout: async () => {},
});

export const WorkoutSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startWorkout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // create a session record
    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    setCurrentSessionId(data.id);
  };

  const endWorkout = async () => {
    if (!currentSessionId) return;

    try {
        // update session stats and mark as completed
        const { error } = await supabase.rpc("complete_workout_session", {
        session_id: currentSessionId,
        });

        if (error) throw error;

        setCurrentSessionId(null);
    } catch (err) {
        console.error("Error ending workout session:", err);
    }
    };


  return (
    <WorkoutSessionContext.Provider value={{ currentSessionId, startWorkout, endWorkout }}>
      {children}
    </WorkoutSessionContext.Provider>
  );
};

export const useWorkoutSession = () => useContext(WorkoutSessionContext);
