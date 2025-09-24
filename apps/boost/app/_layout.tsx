// app/_layout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  return (
    <>
      {/* Header*/}
    <View style={[styles.header, { backgroundColor: '#ffffffff' }]}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
        <View style={styles.iconValueRow}>
          <Ionicons name="flame" size={20} color="orange" />
          <Text style={styles.statValue}>112</Text>
        </View>
        <Text style={styles.statLabel}>Streak</Text>
    </View>

    <View style={styles.statItem}>
      <View style={styles.iconValueRow}>
        <Ionicons name="star" size={20} color="gold" />
        <Text style={styles.statValue}>12716</Text>
      </View>
      <Text style={styles.statLabel}>XP</Text>
    </View>

    <View style={styles.statItem}>
      <View style={styles.iconValueRow}>
        <Ionicons name="pulse" size={20} color="green" />
        <Text style={styles.statValue}>6</Text>
      </View>
      <Text style={styles.statLabel}>Stamina</Text>
      </View>
    </View>
</View>

  {/* Stack for modal screens */}
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  iconValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

