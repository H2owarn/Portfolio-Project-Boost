import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable contentStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatar, { backgroundColor: '#111827' }]}>
            <MaterialIcons name="fitness-center" size={36} color={palette.primary} />
          </View>
          <Text style={[styles.title, { color: palette.text }]}>Log in</Text>
        </View>
        <View style={styles.form}>
          <BoostInput
            placeholder="Email"
            keyboardType="email-address"
            leadingIcon={{ name: 'alternate-email' }}
            autoCapitalize="none"
          />
          <BoostInput
            placeholder="Password"
            leadingIcon={{ name: 'lock-outline' }}
            trailingIcon={{ name: 'visibility-off' }}
            secureTextEntry
          />
        </View>
        <BoostButton
          label="Get Started"
          onPress={() => router.replace('/(tabs)')}
          icon={<MaterialIcons name="arrow-forward" color="#000000" size={20} />}
        />
        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: '#1F2937' }]} />
          <Text style={[styles.dividerLabel, { color: palette.mutedText }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: '#1F2937' }]} />
        </View>
        <View style={styles.socialRow}>
          <View style={[styles.socialButton, { borderColor: '#1F2937' }]}>
            <MaterialIcons name="photo-camera" size={24} color={palette.primary} />
          </View>
        </View>
        <Text style={[styles.footerText, { color: palette.mutedText }]}>
          Don’t have an account?{' '}
          <Link href="/signup" style={[styles.link, { color: palette.primary }]}>Sign up</Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radii.lg,
    padding: 24,
    gap: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  form: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontWeight: '600',
  },
});
