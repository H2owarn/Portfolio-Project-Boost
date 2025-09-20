import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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
          borderTopColor: 'rgba(255,255,255,0.05)',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="rocket-launch" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="event-note" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="insights" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
