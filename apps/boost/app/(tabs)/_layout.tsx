import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AppHeader from '@/components/layout/appheader';

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? 'dark';
	const palette = Colors[colorScheme];
	const insets = useSafeAreaInsets();
	// Ensure minimum padding for web platforms where safe area might be 0
	const tabBarBottomPadding = Platform.OS === 'web' ? Math.max(insets.bottom, 20) : Math.max(insets.bottom, 12);
	const baseTabBarHeight = 45;
	const tabBarHeight = baseTabBarHeight + tabBarBottomPadding;
	const questButtonSize = 72;
	// Move the entire button up more to align text with other tabs
	const questLift = Math.max((questButtonSize - baseTabBarHeight) / 2 + 8, 0);
	const sideTabSpacing = 16;
	const baseTabItemStyle = {
		paddingTop: 1,
	};

	function QuestTabButton({ accessibilityState, onLongPress, onPress }: BottomTabBarButtonProps) {
		const isSelected = Boolean(accessibilityState?.selected);

		return (
			<Pressable
				onPress={onPress}
				onLongPress={onLongPress}
				accessibilityRole="button"
				accessibilityState={accessibilityState}
				style={({ pressed }) => [
					styles.questButtonWrapper,
					{ marginTop: -questLift },
					pressed && { transform: [{ scale: 0.95 }] },
				]}
			>
				<View
					style={[
						styles.questButton,
						{ backgroundColor: palette.primary },
						isSelected && styles.questButtonActive,
					]}
				>
					<MaterialIcons
						name="local-fire-department"
						size={40}
						color={palette.secondary}
						style={styles.questIcon}
					/>
					<Text
						style={[
							styles.questLabel,
							{ color: palette.secondary },
							isSelected && styles.questLabelActive,
						]}
					>
						Go!
					</Text>
				</View>
			</Pressable>
		);
	}

	return (
		<View style={{ flex: 1}}>
			<AppHeader />
		<Tabs
			initialRouteName="home"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: palette.primary,
				tabBarInactiveTintColor: palette.mutedText,
			tabBarStyle: {
				backgroundColor: palette.background,
				borderTopColor: 'rgba(255,255,255,0.05)',
				height: tabBarHeight,
				paddingBottom: tabBarBottomPadding,
				paddingTop: 12, 
				marginBottom: 8,
			},
			tabBarItemStyle: baseTabItemStyle,
			tabBarLabelStyle: {
				marginBottom: 0,
			},
		}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="muscles"
				options={{
					title: 'Rivals',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="fitness-center" color={color} size={size} />,
					tabBarItemStyle: {
						...baseTabItemStyle,
						marginRight: sideTabSpacing,
					},
				}}
			/>
			<Tabs.Screen
				name="go"
				options={{
					title: 'Go',
					tabBarLabel: '',
					tabBarButton: (props) => <QuestTabButton {...props} />,
					tabBarIcon: () => null,
				}}
			/>
			<Tabs.Screen
				name="quest"
				options={{
					title: 'Quests',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="auto-awesome" color={color} size={size} />,
					tabBarItemStyle: {
						...baseTabItemStyle,
						marginLeft: sideTabSpacing,
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="exercises/[muscle]"
				options={{
					href: null, // Hide from tab bar
				}}
			/>
		</Tabs>
	</View>
	);
}

const styles = StyleSheet.create({
	questButtonWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	questButton: {
		width: 72,
		height: 72,
		borderRadius: 36,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 8,
		boxShadow: '0px 14px 28px rgba(125, 248, 67, 0.3)',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	questButtonActive: {
		borderColor: 'rgba(31, 41, 55, 0.35)',
	},
	questIcon: {
		marginBottom: 2,
	},
	questLabel: {
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 0.4,
	},
	questLabelActive: {
		textTransform: 'uppercase',
	},
});
