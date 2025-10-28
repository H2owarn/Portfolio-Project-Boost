import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo, useEffect, useState} from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { playPreloaded, playSound } from "@/utils/sound";
import { useAuth } from '@/hooks/use-auth';
import { useRelationships } from '@/contexts/FriendContext';



export default function ProfileScreen() {
	const { authedProfile: profile, authChecked } = useAuth();
	const palette = Colors[useColorScheme() ?? 'dark'];
	const router = useRouter();
	const [badgeCount, setBadgeCount] = useState<number>(0);
	const [xp, setXp] = useState<number>(profile?.exp ?? 0);
	const [level, setLevel] = useState<number>(profile?.level ?? 1);
	const [rank, setRank] = useState<string>(profile?.rank_divisions?.name ?? '?');
	const [streak, setStreak] = useState<number>(profile?.streak ?? 0);
	const { requests, fetchPendingRequests } = useRelationships();



	useEffect(() => {
	const fetchBadgeCount = async () => {
		if (!profile?.id) return;

		const { count, error } = await supabase
		.from('user_badges')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', profile.id);

		if (error) {
		console.error('Badge count error:', error);
		return;
		}

		setBadgeCount(count ?? 0);
	};

	fetchBadgeCount();
	}, [profile?.id]);

	if (!authChecked) {
		return <Text>Loading...</Text>;
	}

   if (!profile) {
		return <Redirect href="/onboarding/login" />;
	}

	useEffect(() => {
	if (!profile?.id) return;

	// initial load
	const fetchProfile = async () => {
		const { data, error } = await supabase
		.from("profiles")
		.select("exp, level, streak, rank_division_id")
		.eq("id", profile.id)
		.single();

		if (!error && data) {
		setXp(data.exp ?? 0);
		setLevel(data.level ?? 1);
		setStreak(data.streak ?? 0);

		// fetch rank name from related table
		const { data: rankData } = await supabase
			.from("rank_divisions")
			.select("name")
			.eq("id", data.rank_division_id)
			.single();
		setRank(rankData?.name ?? "?");
		}
	};

	fetchProfile();

		// ✅ subscribe to realtime changes
		const channel = supabase
			.channel("profiles_realtime")
			.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "profiles",
				filter: `id=eq.${profile.id}`,
			},
			async (payload) => {
				const newData = payload.new;
				if (!newData) return;

				setXp(newData.exp ?? 0);
				setLevel(newData.level ?? 1);
				setStreak(newData.streak ?? 0);

				// re-fetch rank name only if id changed
				if (newData.rank_division_id) {
				const { data: rankData } = await supabase
					.from("rank_divisions")
					.select("name")
					.eq("id", newData.rank_division_id)
					.single();
				setRank(rankData?.name ?? "?");
				}
			}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
		}, [profile?.id]);

	useEffect(() => {
		fetchPendingRequests();
	}, []);

	const hasRequests = requests && requests.length > 0;


  const joined = useMemo(() => {
		if (!profile?.created_at) return '';
		const d = new Date(profile.created_at);
		return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
	}, [profile?.created_at]);



	return (
		<View style={[styles.container, {backgroundColor: palette.background}]}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Profile Section */}
				<View style={styles.profileSection}>
					<View style={styles.avatar}>
						<Ionicons name="person" size={48} color={palette.text} />
					</View>
					<Text style={[styles.username, {color: palette.text}]}>{profile.name}</Text>
					<Text style={[styles.joinedText, { color: palette.mutedText}]}>Joined {joined}</Text>
					<View style={styles.followRow}>
						<Text style={styles.linkText}>0 Friends</Text>
					</View>
					<View style={styles.buttonRow}>
						<View style={{ position: 'relative' }}>
							<TouchableOpacity
								style={[styles.addButton, { backgroundColor: palette.secondary }]}
								onPress={async () => {
								try {
									await playPreloaded('click');
								} catch {
									await playSound(require('@/assets/sound/tap.wav'));
								}
								router.push('/screens/testfriend');
								}}
							>
								<Text style={[styles.addButtonText, { color: palette.primary }]}>+ Add Friends</Text>
							</TouchableOpacity>

							{/* Notification badge */}
							{hasRequests && (
								<View style={styles.badge}>
								<Text style={styles.badgeText}>
									{requests.length > 9 ? '9+' : requests.length}
								</Text>
								</View>
							)}
							</View>

						<TouchableOpacity style={[styles.shareButton, {backgroundColor: palette.secondary}]}
						onPress={async () => {
							try {
							await playPreloaded('click');
							} catch {
							await playSound(require('@/assets/sound/tap.wav'));
							}
							router.push('/screens/streaktest')}}
							>
							<Ionicons name="share-outline" size={20} color="white" />
						</TouchableOpacity>

					</View>


			</View>

				{/* Statistics */}
				<Text style={[styles.sectionTitle, { color: palette.text }]}>Overview</Text>
				<View style={styles.statsGrid}>
					<StatCard
					icon="local-fire-department"
					value={streak}
					label="Streak"
					/>
					<StatCard
					icon="star"
					value={xp}
					label="Total XP"
					/>
					<StatCard
					icon="shield"
					value={rank} label="Current league"
					/>
					<StatCard
					icon="workspace-premium"
					value={badgeCount}
					label="Badges"
					/>
				</View>

				{/* Friends Section */}
				<Text style={[styles.sectionTitle, {color: palette.text }]}>Friends</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rivalsRow}>
					{/* Repeat for each rival */}
					<View style={styles.rivalAvatarContainer}>
						<View style={styles.avatar}>
							<Ionicons name="person" size={48} color="gray" />
						</View>
						<Text style={[styles.username, { color: palette.text }]}>Kaj Kennedy</Text>
					</View>

					<View style={styles.rivalAvatarContainer}>
						<View style={styles.avatar}>
							<Ionicons name="person" size={48} color="gray" />
						</View>
						<Text style={[styles.username, { color: palette.text }]}>WaWa</Text>
					</View>

					<View style={styles.rivalAvatarContainer}>
						<View style={styles.avatar}>
							<Ionicons name="person" size={48} color="gray" />
						</View>
						<Text style={[styles.username, { color: palette.text }]}>Jin Lieu</Text>
					</View>
				</ScrollView>
			</ScrollView>

		</View>
	);
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
	const palette = Colors[useColorScheme() ?? 'dark'];
	return (
		<View style={{ marginBottom: 16, width: '48%' }}>
			<View style={[styles.statCard, { height: 65, width: 170, backgroundColor: palette.surface }]}>
				<MaterialIcons name={icon as any} size={28} color={palette.primary} />
				<Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
			</View>
			<Text style={[styles.statLabel, { marginTop: 4, textAlign: 'center' }, {color: palette.text}]}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 16
	},
	profileSection: {
		alignItems: 'center',
		marginBottom: 24
	},
	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		borderWidth: 2,
		borderStyle: 'dashed',
		borderColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center'
	},
	rivalAvatarContainer: {
		alignItems: 'center',
		marginRight: 12
	},
	username: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 8
	},
	joinedText: {
		marginTop: 4
	},
	followRow: {
		flexDirection: 'row',
		marginTop: 8
	},
	linkText: {
		color: '#3b82f6',
		marginHorizontal: 8
	},
	buttonRow: {
		flexDirection: 'row',
		marginTop: 12,
		gap:6,
	},
	addButton: {
		backgroundColor: '#2563eb',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		marginRight: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 6,
	},
	addButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	shareButton: {
		backgroundColor: '#374151ff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 6,

	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
		textAlign: 'center'
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	statCard: {
		backgroundColor: '#1F2937',
		borderRadius: 16,
		padding: 16,
		width: '48%',
		marginBottom: 1,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 6,
	},
	statValue: {
		color: 'black',
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 4
	},
	statLabel: {
		color: '#000000ff'
	},
	rivalsRow: {
		paddingVertical: 8,
		paddingHorizontal: 4,
		gap: 12
	},
	badge: {
	position: 'absolute',
	top: -6,
	right: -6,
	backgroundColor: '#ef4444',
	borderRadius: 10,
	minWidth: 18,
	minHeight: 18,
	alignItems: 'center',
	justifyContent: 'center',
	paddingHorizontal: 4,
	},
	badgeText: {
	color: 'white',
	fontSize: 11,
	fontWeight: 'bold',
	},


});
