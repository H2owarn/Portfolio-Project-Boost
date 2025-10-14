import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/layout/appheader';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { authedUser } = useAuth();
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const baseTabBarHeight = 45;
  const tabBarBottomPadding = Math.max(insets.bottom, Platform.OS === 'web' ? 20 : 12);
  const tabBarHeight = baseTabBarHeight + tabBarBottomPadding;

  const questButtonSize = 72;
  const questLift = Math.max((questButtonSize - baseTabBarHeight) / 2 + 8, 0);

  const sideTabSpacing = 16;
  const baseTabItemStyle = { paddingTop: 1 };

  if (!authedUser) return <Redirect href="/onboarding/login" />;

  function QuestTabButton({ accessibilityState, onPress, onLongPress }: BottomTabBarButtonProps) {
    const isSelected = Boolean(accessibilityState?.selected);

    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityState={accessibilityState}
        style={({ pressed }) => [
          styles.questButtonWrapper,
          { top: -questLift },
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
    <View style={{ flex: 1 }}>
      <AppHeader />
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.mutedText,
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: 'rgba(255,255,255,0.05)',
            height: tabBarHeight,
            paddingBottom: tabBarBottomPadding,
            paddingTop: 12,
            overflow: 'visible', 
          },
          tabBarItemStyle: baseTabItemStyle,
          tabBarLabelStyle: { marginBottom: 0 },
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
          name="leaderboard"
          options={{
            title: 'Rivals',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="fitness-center" color={color} size={size} />
            ),
            tabBarItemStyle: { ...baseTabItemStyle, marginRight: sideTabSpacing },
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
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="auto-awesome" color={color} size={size} />
            ),
            tabBarItemStyle: { ...baseTabItemStyle, marginLeft: sideTabSpacing },
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
            href: null,
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
