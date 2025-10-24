import { MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Shadow, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

interface SettingsButtonProps {
	label: string;
	icon: ReactNode;
	onPress: () => void;
}
function SettingsButton({ label, icon, onPress }: SettingsButtonProps) {
	const { palette } = useTheme();
	return (
		<Pressable
			accessibilityRole="button"
			style={({ pressed }) => [styles.button, pressed && { backgroundColor: palette.surfaceElevated }]}
			onPress={onPress}
		>
			{icon}
			<Text style={[styles.buttonText, { color: palette.text }]}>{label}</Text>
		</Pressable>
	);
}

export default function SettingsPage() {
	const { logout } = useAuth();
	const { palette, toggleTheme } = useTheme();

	async function deleteAccount() {
		try {
			await supabase.rpc('delete_account');
			await logout();
		} catch (error) {
			alert('There was an error while trying to delete your account.');
		}
	}

	return (
		<ScrollView style={[styles.container, { backgroundColor: palette.background }]}>
			<View style={[styles.card, { backgroundColor: palette.surface }]}>
				<ThemedText style={styles.title}>App Settings</ThemedText>
				<SettingsButton
					icon={
						<MaterialIcons
							name="sunny"
							style={[styles.buttonIcon, { color: palette.text, backgroundColor: palette.surfaceElevated }]}
							size={24}
						/>
					}
					label="Toggle Theme"
					onPress={() => toggleTheme()}
				/>
			</View>

			<View style={[styles.card, { backgroundColor: palette.surface }]}>
				<ThemedText style={styles.title}>Account</ThemedText>
				<SettingsButton
					icon={
						<MaterialIcons
							name="person"
							style={[styles.buttonIcon, { color: palette.text, backgroundColor: palette.surfaceElevated }]}
							size={24}
						/>
					}
					label="Change username"
					onPress={() => {}}
				/>
				<SettingsButton
					icon={
						<MaterialIcons
							name="logout"
							style={[styles.buttonIcon, { color: palette.text, backgroundColor: palette.surfaceElevated }]}
							size={24}
						/>
					}
					label="Logout"
					onPress={logout}
				/>
				<SettingsButton
					icon={
						<MaterialIcons
							name="delete-forever"
							style={[styles.buttonIcon, { color: palette.error, backgroundColor: palette.surfaceElevated }]}
							size={24}
						/>
					}
					label="Delete Account"
					onPress={deleteAccount}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.md
	},
	card: {
		...Shadow.card,
		padding: Spacing.md,
		borderRadius: Radii.md,
		marginBottom: Spacing.md
	},
	title: {
		fontSize: 18,
		lineHeight: 28,
		paddingLeft: Spacing.sm,
		marginBottom: Spacing.sm
	},
	button: {
		alignItems: 'center',
		flexDirection: 'row',
		marginHorizontal: Spacing.md * -1,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	buttonIcon: {
		borderRadius: Radii.pill,
		backgroundColor: 'red',
		padding: Spacing.sm
	},
	buttonText: {
		fontSize: 16
	}
});
