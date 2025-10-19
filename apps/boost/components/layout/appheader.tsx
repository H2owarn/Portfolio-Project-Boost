import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useXp } from '@/contexts/Xpcontext';
import { useStamina } from '@/contexts/Staminacontext';
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";


  type Profile = {
    id: string;
    name: string;
    level: number;
    exp: number;
    stamina: number;
  };

  type LevelRow = {
    level_number: number;
    min_exp: number;
    max_exp: number | null;
  };

  export default function headerBar() {
    const palette = Colors[useColorScheme() ?? "dark"];
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [users, setUsers] = useState<Profile[]>([]);
    const [levelInfo, setLevelInfo] = useState<LevelRow | null>(null);
    const [loading, setLoading] = useState(true);
    const { xp, level, minExp, maxExp } = useXp();


    useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Initial fetch
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (mounted) setProfile(profileData ?? null);

      // live updates for this user’s profile
      const channel = supabase
        .channel(`profile-updates-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*", // can be 'UPDATE', 'INSERT', 'DELETE'
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log("🔄 Profile updated:", payload.new);
            if (mounted) setProfile(payload.new as Profile);
          }
        )
        .subscribe();

      return () => {
        mounted = false;
        supabase.removeChannel(channel);
      };
    })();
  }, []);


 // XP, streak and stamina ratios.

  const currentExp = profile?.exp ?? 0;
  const progress = Math.round(((currentExp - minExp) / (maxExp - minExp)) * 100);
  const currentStamina = profile?.stamina?? 0;
  const maxStamina = 100;


  const staminaWidth = Math.floor((currentStamina / maxStamina) * 100);
  const streak = 112;



  return (
    <View style={[styles.header, { backgroundColor: palette.surface }]}>
      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <MaterialIcons name="local-fire-department" size={20} color="orange" />
            <Text style={[styles.statValue, { color: palette.text }]}>{streak}</Text>
          </View>
          <Text style={styles.statLabel}>Streak</Text>
        </View>

        {/* XP Bar */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <Ionicons name="star" size={20} color="gold" />
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
              <Text style={styles.barText}>{profile?.exp ?? 0}/{maxExp}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>XP</Text>
        </View>

        {/* Stamina */}
        <View style={styles.statItem}>
          <View style={styles.iconValueRow}>
            <MaterialCommunityIcons name="lightning-bolt-circle" size={20} color="#7ee926ff" />
            <View style={styles.staminaBarContainer}>
              <View style={[styles.staminaBarFill, { width: `${staminaWidth}%` }]} />
              <Text style={styles.barText}>{currentStamina}/{maxStamina}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Stamina</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  iconValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
  },
  staminaBarContainer: {
    width: 60,
    height: 12,
    backgroundColor: '#ada6a6ff',
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  staminaBarFill: {
    height: '100%',
    backgroundColor: '#7ee926ff',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  xpBarContainer: {
    width: 80,
    height: 12,
    backgroundColor: '#ada6a6ff',
    borderRadius: 6,
    marginLeft: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: 'gold',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  barText: {
    color: '#000000ff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
  },
  });
