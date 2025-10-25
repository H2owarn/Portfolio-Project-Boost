import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useAuth } from '@/hooks/use-auth';
import Avatar from '@/components/ui/avatar';


export default function ProfileScreen() {
	const { authedProfile: profile, authChecked } = useAuth();
	const palette = Colors[useColorScheme() ?? 'dark'];
	const router = useRouter();

	if (!authChecked) {
		return <Text>Loading...</Text>;
	}

   if (!profile) {
		return <Redirect href="/onboarding/login" />;
	}

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
                <Avatar name={profile.name} level={profile.level} size={96} />
					<Text style={[styles.username, {color: palette.text}]}>{profile.name}</Text>
					<Text style={[styles.joinedText, { color: palette.mutedText}]}>Joined {joined}</Text>
					<View style={styles.followRow}>
                    <Text style={[styles.linkText, { color: palette.primary }]}>0 Friends</Text>
					</View>
					<View style={styles.buttonRow}>
						<TouchableOpacity style={[styles.addButton, {backgroundColor: palette.secondary}]}
						onPress={() => router.push('/screens/testfriend')}>
							<Text style={[styles.addButtonText, {color: palette.primary}]}>+ Add Friends</Text>
						</TouchableOpacity>
                    <TouchableOpacity style={[styles.shareButton, {backgroundColor: palette.secondary}]}
                    onPress={() => router.push('/screens/streaktest')}>
                        <Ionicons name="share-outline" size={20} color={palette.text} />
                    </TouchableOpacity>
					</View>
				</View>

				{/* Statistics */}
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
					value={profile.rank_divisions?.name?? "?"} label="Current league"
					/>
					<StatCard
					icon="workspace-premium"
					value="4"
					label="Badges"
					/>
				</View>

				{/* Friends Section */}
				<Text style={[styles.sectionTitle, {color: palette.text }]}>Friends</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rivalsRow}>
					{/* Repeat for each rival */}
                <View style={styles.rivalAvatarContainer}>
                    <Avatar name={'Kaj Kennedy'} size={72} />
                    <Text style={[styles.username, { color: palette.text }]}>Kaj Kennedy</Text>
                </View>

                <View style={styles.rivalAvatarContainer}>
                    <Avatar name={'WaWa'} size={72} />
                    <Text style={[styles.username, { color: palette.text }]}>WaWa</Text>
                </View>

                <View style={styles.rivalAvatarContainer}>
                    <Avatar name={'Jin Lieu'} size={72} />
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
        padding: 12
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
        marginHorizontal: 8
    },
	buttonRow: {
		flexDirection: 'row',
		marginTop: 12
	},
    addButton: {
        backgroundColor: 'transparent',
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
        fontWeight: 'bold'
    },
    shareButton: {
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4
    },
    statLabel: {
    },
	rivalsRow: {
		paddingVertical: 8,
		paddingHorizontal: 4,
		gap: 12
	}
});
