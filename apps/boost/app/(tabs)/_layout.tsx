import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabs = [
    { name: "index", title: "Home", icon: "house.fill"},
    { name: "main", title: "Main", icon: "star.fill"},
    { name: "main2", title: "Main2", icon: "list.bullet"},
    { name: "explore", title: "Explore", icon: "paperplane.fill"},
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {tabs.map(({ name, title, icon}) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={icon} color={color} />
            ),
          }}
          />
      ))}
    </Tabs>
  );
}