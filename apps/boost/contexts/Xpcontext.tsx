import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type XpContextType = {
  xp: number;
  level: number;
  minExp: number;
  maxExp: number;
  xpWeek: number;
  addXp: (amount: number) => Promise<void>;
};

const XpContext = createContext<XpContextType>({
  xp: 0,
  level: 0,
  minExp: 0,
  maxExp: 0,
  xpWeek: 0,
  addXp: async () => {},
});

export const XpProvider = ({ children }: { children: React.ReactNode }) => {
  const [xp, setXp] = useState(0);
  const [xpWeek, setXpWeek] = useState(0);
  const [level, setLevel] = useState(0);
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(0);

  const mountedRef = useRef(true);
  const loadingUserRef = useRef<string | null>(null); // prevent overlapping loads for same user

  const safeSetState = <T,>(setter: (v: T) => void, value: T) => {
    if (mountedRef.current) setter(value);
  };

  const loadXpData = async (userId: string) => {
    // Avoid overlapping fetches for the same user
    if (loadingUserRef.current === userId) return;
    loadingUserRef.current = userId;

    try {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('exp, exp_week, level')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('loadXpData: profile error', profileErr);
      }

      const exp = profile?.exp ?? 0;
      const expWeek = profile?.exp_week ?? 0;
      const lvl = profile?.level ?? 0;

      safeSetState(setXp, exp);
      safeSetState(setXpWeek, expWeek);
      safeSetState(setLevel, lvl);

      const { data: levelData, error: levelErr } = await supabase
        .from('levels')
        .select('min_exp, max_exp')
        .eq('level_number', lvl)
        .maybeSingle();

      if (levelErr) {
        console.warn('loadXpData: level error', levelErr);
      }

      safeSetState(setMinExp, levelData?.min_exp ?? 0);
      safeSetState(setMaxExp, levelData?.max_exp ?? 0);
    } catch (err) {
      console.warn('loadXpData: unexpected error', err);
    } finally {
      loadingUserRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    let unsub: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        await loadXpData(session.user.id);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mountedRef.current) return;

        if (session?.user) {
          loadXpData(session.user.id);
        } else {
          safeSetState(setXp, 0);
          safeSetState(setXpWeek, 0);
          safeSetState(setLevel, 0);
          safeSetState(setMinExp, 0);
          safeSetState(setMaxExp, 0);
        }
      });

      unsub = () => listener?.subscription?.unsubscribe();
    })();

    return () => {
      mountedRef.current = false;
      try {
        unsub?.();
      } catch {}
    };
  }, []);

  const addXp = async (amount: number) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) throw new Error('Not logged in');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('exp, exp_week, level')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    const currentExp = profile?.exp ?? 0;
    const currentWeek = profile?.exp_week ?? 0;
    const currentLevel = profile?.level ?? 0;

    const newXp = currentExp + amount;
    const newXpWeek = currentWeek + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ exp: newXp, exp_week: newXpWeek })
      .eq('id', user.id);

    if (updateError) throw updateError;

    const { data: levelData } = await supabase
      .from('levels')
      .select('level_number, min_exp, max_exp')
      .lte('min_exp', newXp)
      .order('level_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const newLevel = levelData?.level_number ?? currentLevel;

    safeSetState(setXp, newXp);
    safeSetState(setXpWeek, newXpWeek);
    safeSetState(setLevel, newLevel);
    safeSetState(setMinExp, levelData?.min_exp ?? 0);
    safeSetState(setMaxExp, levelData?.max_exp ?? 0);

    console.log(`+${amount} XP — Total: ${newXp}, Weekly: ${newXpWeek}`);
  };

  return (
    <XpContext.Provider value={{ xp, xpWeek, level, minExp, maxExp, addXp }}>
      {children}
    </XpContext.Provider>
  );
};

export const useXp = () => useContext(XpContext);
