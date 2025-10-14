
import { supabase } from '@/lib/supabase';

export function useXpSystem() {
  const addXpToUser = async (xpAmount: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', user.id)
      .single();

    if (fetchError) throw fetchError;

    const newXp = (profile?.exp || 0) + xpAmount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ exp: newXp })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return newXp;
  };

  const getCurrentExp = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { data, error } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data?.exp || 0;
  };

  return { addXpToUser, getCurrentExp };
}
