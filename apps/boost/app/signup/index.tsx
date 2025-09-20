import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpAccountScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable contentStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <View style={styles.header}>
          <View style={[styles.icon, { backgroundColor: '#1F2937' }]}>
            <MaterialIcons name="fitness-center" size={32} color={palette.primary} />
          </View>
          <Text style={[styles.title, { color: palette.text }]}>Sign up</Text>
          <Text style={[styles.subtitle, { color: palette.mutedText }]}>Create your Boost account</Text>
        </View>
        <View style={styles.form}>
          <BoostInput placeholder="User name" leadingIcon={{ name: 'person-outline' }} />
          <BoostInput placeholder="Phone number" keyboardType="phone-pad" leadingIcon={{ name: 'phone' }} />
          <BoostInput placeholder="Email" keyboardType="email-address" leadingIcon={{ name: 'alternate-email' }} />
          <BoostInput
            placeholder="Password"
            leadingIcon={{ name: 'lock-outline' }}
            trailingIcon={{ name: 'visibility-off' }}
            secureTextEntry
          />
        </View>
        <BoostButton
          label="Next"
          onPress={() => router.push('/signup/name')}
          icon={<MaterialIcons name="arrow-forward" size={20} color="#000000" />}
        />
        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: '#1F2937' }]} />
          <Text style={[styles.dividerLabel, { color: palette.mutedText }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: '#1F2937' }]} />
        </View>
        <View style={styles.socialRow}>
          <View style={[styles.socialIcon, { borderColor: '#1F2937' }]}>
            <MaterialIcons name="grain" size={22} color={palette.primary} />
          </View>
        </View>
        <Text style={[styles.footerText, { color: palette.mutedText }]}>
          Already have an account?{' '}
          <Link href="/login" style={[styles.link, { color: palette.primary }]}>Sign in</Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  header: {
    alignItems: 'center',
    gap: 12,
  },
  icon: {
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
  subtitle: {
    fontSize: 14,
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
  },
  socialIcon: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    fontWeight: '600',
  },
});
