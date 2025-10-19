import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';

type StreakContextType = {
  streak: number;
  refreshStreak: () => Promise<void>;
  updateStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  setStreakValue: (value: number) => Promise<void>;
};

const StreakContext = createContext<StreakContextType>({
  streak: 0,
  refreshStreak: async () => {},
  updateStreak: async () => {},
  resetStreak: async () => {},
  setStreakValue: async () => {},
});

export const StreakProvider = ({ children }: { children: React.ReactNode }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await refreshStreak();
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) refreshStreak();
        else setStreak(0);
      });

      return () => listener.subscription.unsubscribe();
    };

    init();
  }, []);

  /** Fetch streak and last_active from Supabase */
  const refreshStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('streak, last_active')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching streak:', error.message);
      return;
    }

    setStreak(data?.streak ?? 0);
  };

  /** Update streak based on date logic */
  const updateStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = dayjs().startOf('day');

    const { data, error } = await supabase
      .from('profiles')
      .select('streak, last_active')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error fetching streak data:', error?.message);
      return;
    }

    let newStreak = data.streak ?? 0;
    const lastActive = data.last_active ? dayjs(data.last_active).startOf('day') : null;

    if (!lastActive) {
      newStreak = 1;
    } else {
      const dayDiff = today.diff(lastActive, 'day');

      if (dayDiff === 1) {
        newStreak += 1;
      } else if (dayDiff > 1) {
        newStreak = 1;
      } else if (dayDiff === 0) {
        return;
      }
    }

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_active: today.toISOString(),
      })
      .eq('id', user.id);

    if (updateErr) {
      console.error('Error updating streak:', updateErr.message);
      return;
    }

    setStreak(newStreak);
    console.log(`🔥 Updated streak: ${newStreak}`);
  };

  const resetStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ streak: 0, last_active: null })
      .eq('id', user.id);

    if (error) {
      console.error('Error resetting streak:', error);
      return;
    }

    setStreak(0);
    console.log('❄️ Streak reset to 0');
  };

  const setStreakValue = async (value: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ streak: value, last_active: dayjs().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error setting streak manually:', error.message);
      return;
    }

    setStreak(value);
    console.log(`✅ Streak manually set to: ${value}`);
  };

  return (
    <StreakContext.Provider
      value={{
        streak,
        refreshStreak,
        updateStreak,
        resetStreak,
        setStreakValue,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext);
