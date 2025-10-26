// app/screens/ShareScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Share, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShareScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? "dark"];
  const { loggedWorkout } = useLocalSearchParams();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `💪 I just finished my workout! Check out my progress on Boost!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: palette.primary + '15' }]}>
            <MaterialIcons name="local-fire-department" size={120} color={palette.primary} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: palette.text }]}>
            Workout Complete 🎉
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: palette.mutedText }]}>
            Share your progress with your friends!
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.shareButton, { backgroundColor: palette.primary }]}
              onPress={handleShare}
              android_ripple={{ color: '#000' }}
            >
              <MaterialIcons name="share" size={20} color="#000" />
              <Text style={styles.shareButtonText}>Share Workout</Text>
            </Pressable>

            <Pressable 
              style={[styles.homeButton, { borderColor: palette.primary }]}
              onPress={() => router.push('/screens/testxpscreen')}
              android_ripple={{ color: palette.primary + '20' }}
            >
              <Text style={[styles.homeButtonText, { color: palette.primary }]}>
                Back to Home
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xl * 2,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
    maxWidth: 400,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: Radii.pill,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  shareButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: Radii.pill,
    borderWidth: 2,
  },
  homeButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
