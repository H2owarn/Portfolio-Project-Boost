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
  const TICK_MS = 360000;
  const STAMINA_PER_TICK = 1;

  const [stamina, setStamina] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const syncing = useRef(false);
  const sessionUser = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('stamina, stamina_last_updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading stamina:', error);
        return;
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

      if (mounted) {
        setStamina(currentStamina);
        setLastUpdate(now);
      }
    };

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await loadProfile(session.user.id);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) loadProfile(session.user.id);
      });

      return () => listener?.subscription.unsubscribe();
    };

    init();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
  const tick = setInterval(() => {
    setStamina(prev => {
      if (prev >= MAX_STAMINA) return prev;
      const next = prev + STAMINA_PER_TICK;

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
            console.error('Error syncing stamina:', err);
          } finally {
            syncing.current = false;
          }
        })();
      }

      setLastUpdate(new Date());
      return next;
    });
  }, TICK_MS);

  return () => clearInterval(tick);
}, []);

  const refreshStamina = async () => {
      if (!sessionUser.current) return;
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("stamina")
        .eq("id", sessionUser.current)
        .single();

      if (!error && profile) {
        setStamina(profile.stamina);
        console.log("🔄 Refreshed stamina:", profile.stamina);
      }
    };

  const spendStamina = async (amount: number) => {
  if (!sessionUser.current) throw new Error('Not logged in');
  const next = Math.max(stamina - amount, 0);
  setStamina(next);
  setLastUpdate(new Date());

  try {
    await supabase
      .from('profiles')
      .update({
        stamina: next,
        stamina_last_updated_at: new Date().toISOString(),
      })
      .eq('id', sessionUser.current);
      await refreshStamina();
  } catch (err) {
    console.error('Error updating stamina:', err);
  }
};


  return (
    <StaminaContext.Provider value={{ stamina, spendStamina, refreshStamina, maxStamina: MAX_STAMINA }}>

      {children}
    </StaminaContext.Provider>
  );
};

export const useStamina = () => useContext(StaminaContext);

