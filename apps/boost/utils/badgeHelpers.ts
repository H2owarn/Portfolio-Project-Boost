import { supabase } from '@/lib/supabase';

export async function awardBadge(userId: string, badgeName: string) {

  const { data: badge, error: badgeErr } = await supabase
    .from('badges')
    .select('id')
    .eq('name', badgeName)
    .single();

  if (badgeErr || !badge) throw new Error('Badge not found');

  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badge.id)
    .maybeSingle();

  if (existing) return;

  const { error: insertErr } = await supabase
    .from('user_badges')
    .upsert({
      user_id: userId,
      badge_id: badge.id,
    });

  if (insertErr) throw insertErr;

  console.log(`🏅 Awarded badge: ${badgeName}`);
}
