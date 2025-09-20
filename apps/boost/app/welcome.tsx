import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable={false} contentStyle={styles.content}>
      <View style={[styles.heroIcon, { backgroundColor: palette.primary, shadowColor: palette.primary }]}>
        <MaterialIcons name="local-fire-department" size={64} color={palette.background} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.heading, { color: palette.text }]}>Welcome to</Text>
        <Text style={[styles.heading, styles.headingAccent, { color: palette.primary }]}>Boost</Text>
      </View>
      <BoostButton
        label="Get Started"
        onPress={() => router.push('/login')}
        icon={<MaterialIcons name="arrow-forward" size={20} color="#000000" />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    paddingHorizontal: 32,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: Radii.pill,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  copy: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
  },
  headingAccent: {
    fontSize: 44,
  },
});
