import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { StaminaProvider } from '@/contexts/Staminacontext';
import { AuthedUserProvider } from '@/contexts/UserContext';
import { XpProvider } from '@/contexts/Xpcontext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
	initialRouteName: '(tabs)'
};

export default function RootLayout() {
	const colorScheme = useColorScheme() ?? 'dark';
	const palette = Colors[colorScheme];

	return (
		<AuthedUserProvider>
			<XpProvider>
				<StaminaProvider>
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
							{/* <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} /> */}
							<Stack.Screen name="onboarding/login" options={{ headerShown: false, presentation: 'card' }} />
							<Stack.Screen name="onboarding/signup" options={{ headerShown: false, presentation: 'card' }} />
						</Stack>
					</ThemeProvider>
				</StaminaProvider>
			</XpProvider>
		</AuthedUserProvider>
	);
}
