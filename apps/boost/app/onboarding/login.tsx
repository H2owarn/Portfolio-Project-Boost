import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { ThemedText } from '@/components/themed-text';
import { Alert } from '@/components/ui/alert';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playPreloaded, playSound } from '@/utils/sound';


export default function LoginScreen() {
	const palette = Colors[useColorScheme() ?? 'dark'];
	const { login } = useAuth();
	const [errors, setErrors] = useState<Record<string, any> | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const submit = async (email: string, password: string) => {
  if (submitted) return;
  setSubmitted(true);

  try {
	await playPreloaded('click');
  } catch {
	await playSound(require('@/assets/sound/tap.wav'));
  }

  const { type, data } = await login({ email, password });
  setSubmitted(false);

  if (type === 'error') {
    console.error(data);
    return;
  }

  if (type === 'validation') {
    if (data) setErrors(data);
    return;
  }

  // Wait a moment to make sure auth context updates
  setTimeout(async () => {
    try {
      const hideTutorial = await AsyncStorage.getItem('hideTutorial');
      if (hideTutorial === 'true') {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding'); // show tutorial once
      }
    } catch (error) {
      console.error('Error checking tutorial flag:', error);
      router.replace('/onboarding');
    }
  }, 300); // small delay ensures useAuth() has updated
};



	const [email, setEmail] = useState('me@gibbu.dev');
	const [password, setPassword] = useState('testing123');

	return (
	<Screen
		scrollable
		contentStyle={styles.container}
		style={{ backgroundColor: palette.surface }}
	>
		<View style={styles.content}>
			<View style={styles.header}>
				<View style={[styles.icon, { backgroundColor: palette.surfaceElevated}]}>
					<MaterialIcons name="local-fire-department" size={50} color={palette.primary} />
				</View>
				<Text style={[styles.title, { color: palette.text }]}>Login</Text>
				<Text style={[styles.subtitle, { color: palette.mutedText }]}>Welcome back to Boost</Text>
			</View>

			<View style={styles.form}>
				{errors?.code === 'email_not_confirmed' && (
					<Alert type="error" message="You must confirm your email before logging in." />
				)}
				{errors?.code === 'invalid_credentials' && (
					<Alert type="error" message="Email or password are incorrect." />
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
					placeholder="Password"
					leadingIcon={{ name: 'lock-outline' }}
					trailingIcon={{ name: 'visibility-off' }}
					secureTextEntry
					autoCapitalize="none"
					onChangeText={(value) => setPassword(value)}
					value={password}
					containerStyle={submitted && { opacity: 0.6, pointerEvents: 'none' }}
				/>
			</View>

			<BoostButton
				label="Login"
				submitted={submitted}
				onPress={() => submit(email, password)}
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
				New here?{' '}
				<Link href="/onboarding/signup" style={[styles.link, { color: palette.primary }]}>
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
