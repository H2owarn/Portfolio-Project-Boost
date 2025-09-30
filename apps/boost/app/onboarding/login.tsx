import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// import { api } from '@/utils/api';

async function submit(email: string, password: string) {
	// const req = await api('POST', '/auth/login', { email, password });
	// console.log('API REQUEST RESULT', req);

	router.replace('/(tabs)/home');
}

export default function LoginScreen() {
	const palette = Colors[useColorScheme() ?? 'dark'];

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<Screen scrollable contentStyle={styles.container}>
			<View style={styles.content}>
				<View style={styles.header}>
					<View style={[styles.icon, { backgroundColor: palette.surfaceElevated }]}>
						<MaterialIcons name="fitness-center" size={36} color={palette.primary} />
					</View>
					<Text style={[styles.title, { color: palette.text }]}>Log in</Text>
					<Text style={[styles.subtitle, { color: palette.mutedText }]}>Welcome back to Boost</Text>
				</View>
				<View style={styles.form}>
					<BoostInput
						placeholder="Email"
						keyboardType="email-address"
						leadingIcon={{ name: 'alternate-email' }}
						autoCapitalize="none"
						onChangeText={(value) => setEmail(value)}
					/>
					<BoostInput
						placeholder="Password"
						leadingIcon={{ name: 'lock-outline' }}
						trailingIcon={{ name: 'visibility-off' }}
						secureTextEntry
						onChangeText={(value) => setPassword(value)}
					/>
				</View>
				<BoostButton
					label="Login"
					onPress={() => submit(email, password)}
					trailingIcon={<MaterialIcons name="arrow-forward" color="#000000" size={20} />}
				/>
				<View style={styles.dividerRow}>
					<View style={[styles.divider, { backgroundColor: palette.borderColorAlt }]} />
					<Text style={[styles.dividerLabel, { color: palette.mutedText }]}>or</Text>
					<View style={[styles.divider, { backgroundColor: palette.borderColorAlt }]} />
				</View>
				<View style={styles.socialRow}>
					<View style={[styles.socialButton, { backgroundColor: palette.surfaceElevated }]}>
						<MaterialIcons name="photo-camera" size={24} color={palette.primary} />
					</View>
				</View>
			</View>
			<View style={styles.footer}>
				<Text style={[styles.footerText, { color: palette.mutedText }]}>
					New here?{' '}
					<Link href="/signup" style={[styles.link, { color: palette.primary }]}>
						Sign up
					</Link>
				</Text>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: Spacing.xl,
		paddingBottom: Spacing.xl,
		paddingTop: Spacing.xl,
		flexGrow: 1
	},
	content: {
		gap: Spacing.lg
	},
	header: {
		alignItems: 'center',
		gap: Spacing.md
	},
	icon: {
		width: 64,
		height: 64,
		borderRadius: Radii.md,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: Font.title,
	subtitle: Font.subTitle,
	form: {
		gap: Spacing.md
	},
	dividerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.md
	},
	divider: {
		flex: 1,
		height: 1
	},
	dividerLabel: {
		fontSize: 13,
		textTransform: 'uppercase',
		letterSpacing: 1
	},
	socialRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 12
	},
	socialButton: {
		width: 48,
		height: 48,
		borderRadius: Radii.md,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerText: {
		fontSize: 14,
		textAlign: 'center'
	},
	link: {
		fontWeight: '600'
	},
	footer: {
		alignItems: 'center',
		marginTop: 'auto'
	}
});
