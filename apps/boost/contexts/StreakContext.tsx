import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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

  const mountedRef = useRef(true);
  const loadingUserRef = useRef<string | null>(null);

  const safeSet = <T,>(setter: (v: T) => void, v: T) => {
    if (mountedRef.current) setter(v);
  };

  const refreshStreak = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    // de-dupe parallel loads
    if (loadingUserRef.current === user.id) return;
    loadingUserRef.current = user.id;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('streak, last_active')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('refreshStreak: select error', error);
        safeSet(setStreak, 0);
        return;
      }

      safeSet(setStreak, data?.streak ?? 0);
    } catch (e) {
      console.warn('refreshStreak: unexpected', e);
      safeSet(setStreak, 0);
    } finally {
      loadingUserRef.current = null;
    }
  };

  const updateStreak = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const today = dayjs().startOf('day');

    const { data, error } = await supabase
      .from('profiles')
      .select('streak, last_active')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('updateStreak: select error', error);
      return;
    }

    const currentStreak = data?.streak ?? 0;
    const lastActive = data?.last_active ? dayjs(data.last_active).startOf('day') : null;

    let newStreak = currentStreak;

    if (!lastActive) {
      newStreak = 1;
    } else {
      const dayDiff = today.diff(lastActive, 'day');
      if (dayDiff === 1) newStreak += 1;
      else if (dayDiff > 1) newStreak = 1;
      else if (dayDiff === 0) return; // already done today
    }

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_active: today.toISOString(),
      })
      .eq('id', user.id);

    if (updateErr) {
      console.warn('updateStreak: update error', updateErr);
      return;
    }

    safeSet(setStreak, newStreak);
    console.log(`🔥 Updated streak: ${newStreak}`);
  };

  const resetStreak = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ streak: 0, last_active: null })
      .eq('id', user.id);

    if (error) {
      console.warn('resetStreak: update error', error);
      return;
    }

    safeSet(setStreak, 0);
    console.log('❄️ Streak reset to 0');
  };

  const setStreakValue = async (value: number) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ streak: value, last_active: dayjs().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.warn('setStreakValue: update error', error);
      return;
    }

    safeSet(setStreak, value);
    console.log(`✅ Streak manually set to: ${value}`);
  };

  useEffect(() => {
    mountedRef.current = true;

    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) await refreshStreak();

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mountedRef.current) return;
        if (session?.user) refreshStreak();
        else safeSet(setStreak, 0);
      });

      unsubscribe = () => listener?.subscription?.unsubscribe();
    })();

    return () => {
      mountedRef.current = false;
      try { unsubscribe?.(); } catch {}
    };
  }, []);

  return (
    <StreakContext.Provider
      value={{ streak, refreshStreak, updateStreak, resetStreak, setStreakValue }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext);
