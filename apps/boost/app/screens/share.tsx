// app/screens/ShareScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function ShareScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? "dark"];
  const { loggedWorkout } = useLocalSearchParams();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `💪 I just finished my workout: ${loggedWorkout || 'Check out my session!'}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: palette.background}]}>
      <MaterialIcons name="local-fire-department" size={200} color={palette.primary}/>
      <Text style={[styles.title, {color: palette.text}]}>Workout Complete 🎉</Text>
      <Text style={[styles.subtitle, {color: palette.mutedText}]}>Share your progress with your friends!</Text>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Share Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/testxpscreen')}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#37d137',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  shareText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    color: '#37d137',
    fontSize: 16,
  },
});
