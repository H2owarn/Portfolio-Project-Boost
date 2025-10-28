import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type StaminaContextType = {
  stamina: number;
  spendStamina: (amount: number) => Promise<void>;
  refreshStamina: () => Promise<void>;
  maxStamina: number;
};

const StaminaContext = createContext<StaminaContextType>({
  stamina: 0,
  spendStamina: async () => {},
  refreshStamina: async () => {},
  maxStamina: 100,
});

export const StaminaProvider = ({ children }: { children: React.ReactNode }) => {
  const MAX_STAMINA = 100;
  const TICK_MS = 360000; // 6 minutes
  const STAMINA_PER_TICK = 1;

  const [stamina, setStamina] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const syncing = useRef(false);
  const sessionUser = useRef<string | null>(null);
  const mountedRef = useRef(true);

  const safeSet = <T,>(setter: (v: T) => void, v: T) => {
    if (mountedRef.current) setter(v);
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('stamina, stamina_last_updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error loading stamina:', error);
      }

      sessionUser.current = userId;

      let currentStamina = profile?.stamina ?? MAX_STAMINA;
      const last = profile?.stamina_last_updated_at
        ? new Date(profile.stamina_last_updated_at)
        : new Date();

      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - last.getTime()) / 60000);

      if (diffMinutes > 0 && currentStamina < MAX_STAMINA) {
        currentStamina = Math.min(currentStamina + diffMinutes, MAX_STAMINA);

        await supabase
          .from('profiles')
          .update({
            stamina: currentStamina,
            stamina_last_updated_at: now.toISOString(),
          })
          .eq('id', userId);
      }

      safeSet(setStamina, currentStamina);
      safeSet(setLastUpdate, now);
    } catch (err) {
      console.warn('Unexpected error loading stamina:', err);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session?.user) await loadProfile(session.user.id);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mountedRef.current) return;
        if (session?.user) loadProfile(session.user.id);
        else {
          safeSet(setStamina, 0);
          safeSet(setLastUpdate, null);
          sessionUser.current = null;
        }
      });

      unsubscribe = () => listener?.subscription?.unsubscribe();
    })();

    return () => {
      mountedRef.current = false;
      unsubscribe?.();
    };
  }, []);

  /** Auto-regenerate stamina over time */
  useEffect(() => {
    const tick = setInterval(() => {
      if (!mountedRef.current) return;

      safeSet(setStamina, (prev) => {
        if (prev >= MAX_STAMINA) return prev;
        const next = Math.min(prev + STAMINA_PER_TICK, MAX_STAMINA);

        if (!syncing.current && sessionUser.current) {
          (async () => {
            try {
              syncing.current = true;
              await supabase
                .from('profiles')
                .update({
                  stamina: next,
                  stamina_last_updated_at: new Date().toISOString(),
                })
                .eq('id', sessionUser.current);
            } catch (err) {
              console.warn('Error syncing stamina:', err);
            } finally {
              syncing.current = false;
            }
          })();
        }

        safeSet(setLastUpdate, new Date());
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(tick);
  }, []);

  const spendStamina = async (amount: number) => {
    if (!sessionUser.current) throw new Error('Not logged in');

    const next = Math.max(stamina - amount, 0);
    safeSet(setStamina, next);
    safeSet(setLastUpdate, new Date());

    try {
      await supabase
        .from('profiles')
        .update({
          stamina: next,
          stamina_last_updated_at: new Date().toISOString(),
        })
        .eq('id', sessionUser.current);
    } catch (err) {
      console.warn('Error updating stamina:', err);
    }
  };

  return (
    <StaminaContext.Provider value={{ stamina, spendStamina, refreshStamina, maxStamina: MAX_STAMINA }}>

      {children}
    </StaminaContext.Provider>
  );
};

export const useStamina = () => useContext(StaminaContext);

