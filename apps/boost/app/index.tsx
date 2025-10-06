import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function hexToRgba(hex: string, alpha: number) {
	const sanitized = hex.replace('#', '');
	const normalized =
		sanitized.length === 3
			? sanitized
					.split('')
					.map((char) => char + char)
					.join('')
			: sanitized;
	const int = parseInt(normalized, 16);
	const r = (int >> 16) & 255;
	const g = (int >> 8) & 255;
	const b = int & 255;

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function WelcomeScreen() {
	const router = useRouter();
	const palette = Colors[useColorScheme() ?? 'dark'];
	const glowShadow = `0px 12px 24px ${hexToRgba(palette.primary, 0.35)}`;

	return (
		<Screen scrollable={false} contentStyle={styles.content}>
			<View style={[styles.heroIcon, { backgroundColor: palette.primary, boxShadow: [glowShadow] }]}>
				<MaterialIcons name="local-fire-department" size={64} color={palette.background} />
			</View>
			<View style={styles.copy}>
				<Text style={[styles.heading, { color: palette.text }]}>Welcome to</Text>
				<Text style={[styles.heading, styles.headingAccent, { color: palette.primary }]}>Boost</Text>
			</View>
			<BoostButton
				label="Get Started"
				onPress={() => router.push('/onboarding/login')}
				icon={<MaterialIcons name="arrow-forward" size={20} color="#000000" />}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 48,
		paddingHorizontal: 32
	},
	heroIcon: {
		width: 120,
		height: 120,
		borderRadius: Radii.pill,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 12
	},
	copy: {
		alignItems: 'center'
	},
	heading: {
		fontSize: 36,
		fontWeight: '800'
	},
	headingAccent: {
		fontSize: 44
	}
});
