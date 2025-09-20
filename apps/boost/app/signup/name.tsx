import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpNameScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: palette.text }]}>Welcome</Text>
        <Text style={[styles.paragraph, { color: palette.text }]}>Thank you for choosing us...</Text>
        <Text style={[styles.paragraph, { color: palette.text }]}>Let us get you started in <Text style={{ color: palette.primary }}>Boost!</Text></Text>
        <BoostInput
          label="How should we call you?"
          placeholder="Your name"
          autoCapitalize="words"
        />
      </View>
      <View style={styles.footer}>
        <BoostButton
          label="Next"
          onPress={() => router.push('/signup/birthday')}
        />
        <BoostButton
          label="Skip"
          variant="ghost"
          onPress={() => router.push('/signup/birthday')}
          fullWidth
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  body: {
    gap: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    gap: 12,
  },
});
