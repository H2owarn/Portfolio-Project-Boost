import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = Colors[colorScheme];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: palette.background },
        }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Log in', presentation: 'card' }} />
        <Stack.Screen name="signup/index" options={{ title: 'Sign up' }} />
        <Stack.Screen name="signup/name" options={{ title: 'Your name' }} />
        <Stack.Screen name="signup/birthday" options={{ title: 'Your birthday' }} />
        <Stack.Screen name="signup/height" options={{ title: 'Your height' }} />
        <Stack.Screen name="signup/weight" options={{ title: 'Your weight' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile/view" options={{ title: 'Community Profile' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="workout/overview" options={{ title: 'Workout Preview' }} />
        <Stack.Screen name="workout/in-progress" options={{ title: 'Workout' }} />
        <Stack.Screen name="workout/completed" options={{ title: 'Great job!' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
