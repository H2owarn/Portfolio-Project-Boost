import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? 'dark';
	const palette = Colors[colorScheme];

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: palette.primary,
				tabBarInactiveTintColor: palette.mutedText,
				tabBarStyle: {
					backgroundColor: palette.background,
					borderTopColor: 'rgba(255,255,255,0.05)'
				}
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Exercises',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="fitness-center" color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Explore',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="explore" color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name="exercises/[muscle]"
				options={{
					href: null // Hide from tab bar
				}}
			/>
		</Tabs>
	);
}
