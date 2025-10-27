import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import type { GestureResponderEvent } from 'react-native';
import { Redirect, Tabs } from 'expo-router';

import AppHeader from '@/components/layout/appheader';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { playPreloaded, playSound } from '@/utils/sound';

// ✅ Reusable sound wrapper for tab buttons
function SoundTabButton({
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityRole,
  children,
  style,
  sound = 'click',
}: BottomTabBarButtonProps & { sound?: string }) {
  const handlePress = async (e: GestureResponderEvent) => {
    try {
      await playPreloaded(sound);
    } catch {
      await playSound(require('@/assets/sound/tap.wav'));
    }
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={style}
      android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
    >
      {children}
    </Pressable>
  );
}

export default function TabLayout() {
  const { authedUser } = useAuth();
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  if (!authedUser) return <Redirect href="/onboarding/login" />;

  const baseTabBarHeight = 45;
  const tabBarBottomPadding = Math.max(insets.bottom, Platform.OS === 'web' ? 20 : 12);
  const tabBarHeight = baseTabBarHeight + tabBarBottomPadding;
  const questButtonSize = 72;
  const questLift = Math.max((questButtonSize - baseTabBarHeight) / 2 + 8, 0);
  const sideTabSpacing = 16;
  const baseTabItemStyle = { paddingTop: 1 };

  // ✅ Custom "Go!" middle tab button
  function QuestTabButton({ accessibilityState, onPress, onLongPress }: BottomTabBarButtonProps) {
    const isSelected = Boolean(accessibilityState?.selected);

    const handlePress = async (e: GestureResponderEvent) => {
      try {
        await playPreloaded('enter');
      } catch {
        await playSound(require('@/assets/sound/entering.wav'));
      }
      onPress?.(e);
    };

    return (
      <Pressable
        onPress={handlePress}
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
        {/* 🏠 HOME */}
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarButton: (props) => <SoundTabButton {...props} sound="click" />,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />

        {/* 💪 LEADERBOARD */}
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rivals',
            tabBarButton: (props) => <SoundTabButton {...props} sound="click" />,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="fitness-center" color={color} size={size} />
            ),
            tabBarItemStyle: { ...baseTabItemStyle, marginRight: sideTabSpacing },
          }}
        />

        {/* 🚀 GO BUTTON (Custom middle) */}
        <Tabs.Screen
          name="go"
          options={{
            title: 'Go',
            tabBarLabel: '',
            tabBarButton: (props) => <QuestTabButton {...props} />,
            tabBarIcon: () => null,
          }}
        />

        {/* 🧭 QUESTS */}
        <Tabs.Screen
          name="quest"
          options={{
            title: 'Quests',
            tabBarButton: (props) => <SoundTabButton {...props} sound="click" />,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="auto-awesome" color={color} size={size} />
            ),
            tabBarItemStyle: { ...baseTabItemStyle, marginLeft: sideTabSpacing },
          }}
        />

        {/* 👤 PROFILE */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarButton: (props) => <SoundTabButton {...props} sound="click" />,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
          }}
        />

        {/* Hidden route */}
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
