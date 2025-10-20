import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { AuthedUserProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { XpProvider } from '@/contexts/Xpcontext';
import { StaminaProvider } from '@/contexts/Staminacontext';
import { RelationshipProvider } from '@/contexts/FriendContext';
import { StreakProvider } from '@/contexts/StreakContext';

export const unstable_settings = {
	initialRouteName: '(tabs)'
};

export default function RootLayout() {
	const colorScheme = useColorScheme() ?? 'dark';
	const palette = Colors[colorScheme];

	return (
		<AuthedUserProvider>
			<StreakProvider>
			<XpProvider>
			<StaminaProvider>
			<RelationshipProvider>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
				<Stack
					screenOptions={{
						headerStyle: { backgroundColor: palette.background },
						headerTintColor: palette.text,
						headerShadowVisible: false,
						headerTitleStyle: { fontWeight: '600' },
						contentStyle: { backgroundColor: palette.background }
					}}
				>
					<Stack.Screen name="testxpscreen" options={{ headerShown: false }} />
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
					<Stack.Screen name="onboarding/login" options={{ headerShown: false, presentation: 'card' }} />
				</Stack>
			</ThemeProvider>
			</RelationshipProvider>
			</StaminaProvider>
			</XpProvider>
			</StreakProvider>
		</AuthedUserProvider>
	);
}
