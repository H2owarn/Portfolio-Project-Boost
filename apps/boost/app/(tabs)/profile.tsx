import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radii, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useAuth } from '@/hooks/use-auth';
import Avatar from '@/components/ui/avatar';


export default function ProfileScreen() {
	const { authedProfile: profile, authChecked } = useAuth();
	const palette = Colors[useColorScheme() ?? 'dark'];
	const router = useRouter();

	const joined = useMemo(() => {
		if (!profile?.created_at) return '';
		const d = new Date(profile.created_at);
		return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
	}, [profile?.created_at]);

	if (!authChecked) {
		return <Text>Loading...</Text>;
	}

   if (!profile) {
		return <Redirect href="/onboarding/login" />;
	}

	return (
		<ScrollView 
			style={{ backgroundColor: palette.background }}
			contentContainerStyle={styles.container}
		>
			{/* Profile Header Card */}
			<View style={[styles.profileCard, { backgroundColor: palette.surface }]}>
				<View style={styles.profileSection}>
					<Avatar name={profile.name} level={profile.level} size={96} />
					<Text style={[styles.username, {color: palette.text}]}>{profile.name}</Text>
					<Text style={[styles.joinedText, { color: palette.mutedText}]}>Joined {joined}</Text>
					<Text style={[styles.friendsText, { color: palette.text }]}>0 Friends</Text>
					
					<View style={styles.buttonRow}>
						<TouchableOpacity 
							style={[styles.addButton, {backgroundColor: palette.primary}]}
							onPress={() => router.push('/screens/testfriend')}
						>
							<Text style={[styles.addButtonText, {color: palette.secondary}]}>+ Add Friends</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.shareButton, {backgroundColor: palette.surfaceElevated}]}
							onPress={() => router.push('/screens/streaktest')}
						>
							<Ionicons name="share-outline" size={20} color={palette.text} />
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/* Overview Section */}
			<View style={[styles.section, { backgroundColor: palette.surface }]}>
				<Text style={[styles.sectionTitle, { color: palette.text }]}>Overview</Text>
				<View style={styles.statsGrid}>
					<StatCard
						icon="local-fire-department"
						value="112"
						label="Streak"
					/>
					<StatCard
						icon="star"
						value={profile.exp}
						label="Total XP"
					/>
					<StatCard
						icon="shield"
						value={profile.rank_divisions?.name ?? "IRON_2"} 
						label="Current league"
					/>
					<StatCard
						icon="workspace-premium"
						value="4"
						label="Badges"
					/>
				</View>
			</View>

			{/* Friends Section */}
			<View style={[styles.section, { backgroundColor: palette.surface }]}>
				<Text style={[styles.sectionTitle, {color: palette.text }]}>Friends</Text>
				<ScrollView 
					horizontal 
					showsHorizontalScrollIndicator={false} 
					contentContainerStyle={styles.friendsRow}
				>
					<View style={styles.friendCard}>
						<Avatar name={'Kaj Kennedy'} size={64} />
						<Text style={[styles.friendName, { color: palette.text }]}>Kaj Kennedy</Text>
					</View>

					<View style={styles.friendCard}>
						<Avatar name={'WaWa'} size={64} />
						<Text style={[styles.friendName, { color: palette.text }]}>WaWa</Text>
					</View>

					<View style={styles.friendCard}>
						<Avatar name={'Jin Lieu'} size={64} />
						<Text style={[styles.friendName, { color: palette.text }]}>Jin Lieu</Text>
					</View>
				</ScrollView>
			</View>
		</ScrollView>
	);
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
	const palette = Colors[useColorScheme() ?? 'dark'];
	return (
		<View style={styles.statCardContainer}>
			<View style={[styles.statCard, { backgroundColor: palette.surfaceElevated }]}>
				<MaterialIcons name={icon as any} size={24} color={palette.primary} />
				<Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
			</View>
			<Text style={[styles.statLabel, {color: palette.text}]}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 12,
		gap: 12,
	},
	profileCard: {
		borderRadius: Radii.lg,
		padding: 16,
		...Shadow.card,
	},
	profileSection: {
		alignItems: 'center',
		gap: 8,
	},
	username: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 8,
	},
	joinedText: {
		fontSize: 13,
	},
	friendsText: {
		fontSize: 14,
		marginTop: 4,
	},
	buttonRow: {
		flexDirection: 'row',
		marginTop: 12,
		gap: 8,
	},
	addButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: Radii.md,
		...Shadow.card,
	},
	addButtonText: {
		fontWeight: 'bold',
		fontSize: 14,
	},
	shareButton: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: Radii.md,
		...Shadow.card,
	},
	section: {
		borderRadius: Radii.lg,
		padding: 16,
		gap: 12,
		...Shadow.card,
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		width: '100%',
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
		width: '100%',
	},
	statCardContainer: {
		width: '48%',
		alignItems: 'center',
		gap: 6,
	},
	statCard: {
		borderRadius: Radii.md,
		padding: 12,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		...Shadow.card,
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	statLabel: {
		fontSize: 12,
		textAlign: 'center',
	},
	friendsRow: {
		paddingVertical: 4,
		gap: 12,
	},
	friendCard: {
		alignItems: 'center',
		gap: 8,
	},
	friendName: {
		fontSize: 13,
		fontWeight: '600',
	},
});
