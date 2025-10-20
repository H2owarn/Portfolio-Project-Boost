import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Alert } from '@/components/ui/alert';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import type { SignUpBody } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpScreen() {
	const palette = Colors[useColorScheme() ?? 'dark'];
	const { register } = useAuth();
	const [errors, setErrors] = useState<Record<string, any> | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const [email, setEmail] = useState('me@gibbu.dev');
	const [name, setName] = useState('Gibbu');
	const [password, setPassword] = useState('testing123');
	const [repeatPassword, setRepeatPassword] = useState('testing123');
	const [weight, setWeight] = useState('100');

	const submit = async (body: SignUpBody) => {
		// Prevent from sending multiple requests.
		if (submitted) return;

		setSubmitted(true);
		const { type, data } = await register(body);
		setSubmitted(false);

		if (type === 'error') {
			console.error(data);
			return;
		}

		if (type === 'validation') {
			console.log(data);
			if (data) setErrors(data);
			return;
		}

		router.replace('/(tabs)/home');
	};

	return (
		<Screen scrollable contentStyle={styles.container} style={{ backgroundColor: palette.surface }}>
			<View style={styles.content}>
				<View style={styles.header}>
					<View style={[styles.icon, { backgroundColor: palette.surfaceElevated }]}>
						<MaterialIcons name="local-fire-department" size={50} color={palette.primary} />
					</View>
					<Text style={[styles.title, { color: palette.text }]}>Sign Up</Text>
					<Text style={[styles.subtitle, { color: palette.mutedText }]}>Welcome to Boost!</Text>
				</View>

				<View style={styles.form}>
					{errors?.code === 'empty_fields' && (
						<Alert type="error" message="All fields must be filled." />
					)}
					{errors?.code === 'passwords_not_match' && (
						<Alert type="error" message="Your passwords do not match." />
					)}
					{errors?.code === 'name_taken' && (
						<Alert type="error" message="Username is already taken." />
					)}
					{errors?.code === 'user_already_exists' && (
						<Alert type="error" message="An account with that email already exists." />
					)}

					<BoostInput
						placeholder="Email"
						keyboardType="email-address"
						leadingIcon={{ name: 'alternate-email' }}
						autoCapitalize="none"
						onChangeText={(value) => setEmail(value)}
						value={email}
						containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
					/>
					<BoostInput
						placeholder="Username"
						leadingIcon={{ name: 'person' }}
						onChangeText={(value) => setName(value)}
						value={name}
						containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
					/>
					<BoostInput
						placeholder="Weight"
						leadingIcon={{ name: 'monitor-weight' }}
						onChangeText={(value) => setWeight(value)}
						keyboardType="number-pad"
						value={weight}
						containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
					/>
					<BoostInput
						placeholder="Password"
						leadingIcon={{ name: 'lock-outline' }}
						trailingIcon={{ name: 'visibility-off' }}
						secureTextEntry
						autoCapitalize="none"
						onChangeText={(value) => setPassword(value)}
						value={password}
						containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
					/>
					<BoostInput
						placeholder="Repeat Password"
						leadingIcon={{ name: 'lock-outline' }}
						trailingIcon={{ name: 'visibility-off' }}
						secureTextEntry
						autoCapitalize="none"
						onChangeText={(value) => setRepeatPassword(value)}
						value={repeatPassword}
						containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
					/>
				</View>

				<BoostButton
					label="Sign Up"
					submitted={submitted}
					onPress={() => submit({ email, name, password, repeatPassword, weight })}
					trailingIcon={<MaterialIcons name="arrow-forward" color="#000000" size={20} />}
				/>

				<View style={styles.dividerRow}>
					<View style={[styles.divider, { backgroundColor: palette.borderColorAlt }]} />
					<Text style={[styles.dividerLabel, { color: palette.mutedText }]}>or</Text>
					<View style={[styles.divider, { backgroundColor: palette.borderColorAlt }]} />
				</View>

				<View style={[styles.socialRow, submitted && { pointerEvents: 'none', opacity: 0.6 }]}>
					<View style={[styles.socialButton, { backgroundColor: palette.surfaceElevated }]}>
						<MaterialIcons name="photo-camera" size={24} color={palette.text} />
					</View>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={[styles.footerText, { color: palette.mutedText }]}>
					Already have an account?{' '}
					<Link href="/onboarding/login" style={[styles.link, { color: palette.primary }]}>
						Login
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
