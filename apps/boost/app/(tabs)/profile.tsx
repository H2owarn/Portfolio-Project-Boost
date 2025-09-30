import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string;
  level: number;
  streak: number;
  stamina: number;
  exp: number;
  rank_division: string;
  created_at: string;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // get the signed-in user
      const { data: {user}, error:userErr } = await supabase.auth.getUser();
      if (userErr) console.error(userErr);
      if(!user) {
        setLoading(false);
        return;    // not logged in
      }

      // fetch profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (mounted) {
        if(error) console.error(error);
        setProfile(data as Profile);
        setLoading(false);
      }

      // live update profile
      const channel = supabase
        .channel(`profile:${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}`},
          (payload) => setProfile(payload.new as Profile)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

      };

      load();
      return () => { mounted = false; };
    }, []);

    const joined = useMemo(() => {
    if (!profile?.created_at) return "";
    const d = new Date(profile.created_at);
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
    }, [profile?.created_at]);

    if (loading) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <Text>Loading profile…</Text>
        </View>
      );
    }

    if (!profile) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <Text>No profile. Please sign in.</Text>
        </View>
      );
    }


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="gray" />
          </View>
          <Text style={styles.username}>{profile.name}</Text>
          <Text style={styles.joinedText}>Joined {joined}</Text>
          <View style={styles.followRow}>
            <Text style={styles.linkText}>0 Friends</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="local-fire-department" value="112" label="Day streak" />
          <StatCard icon="star" value={profile.exp} label="Total XP" />
          <StatCard icon="shield" value={profile.rank_division} label="Current league" />
          <StatCard icon="workspace-premium" value="4" label="Badges" />
        </View>

        {/* Rival Section */}
        <Text style={styles.sectionTitle}>Rivals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rivalsRow}
        >
        {/* Repeat for each rival */}
          <View style={styles.rivalAvatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="gray" />
            </View>
            <Text style={styles.username}>Kaj Kennedy</Text>
          </View>

          <View style={styles.rivalAvatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="gray" />
            </View>
            <Text style={styles.username}>WaWa</Text>
          </View>

          <View style={styles.rivalAvatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="gray" />
            </View>
            <Text style={styles.username}>Jin Lieu</Text>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <View style={{ marginBottom: 16, width: "48%" }}>
      <View style={[styles.statCard, { height: 65, width: 170 }]}>
        <MaterialIcons name={icon as any} size={28} color="#2ec91aff" />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={[styles.statLabel, { marginTop: 4, textAlign: "center" }]}>{label}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8eaecff"
  },
  scrollContent: {
    padding: 16
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  rivalAvatarContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  username: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8
  },
  joinedText: {
    color: "#9ca3af",
    marginTop: 4
  },
  followRow: {
    flexDirection: "row",
    marginTop: 8
  },
  linkText: {
    color: "#3b82f6",
    marginHorizontal: 8
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  shareButton: {
    backgroundColor: "#374151ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12
  },
  sectionTitle: {
    color: "Black",
    fontSize: 18, fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center"
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#ffffff9d",
    borderRadius: 16, padding: 16,
    width: "48%", marginBottom: 1,
    borderWidth: 2, flexDirection: "row",
    alignItems: "center",
    gap: 20
  },
  statValue: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4
  },
  statLabel: {
    color: "#000000ff"
  },
  rivalsRow: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 12,
  },

});
