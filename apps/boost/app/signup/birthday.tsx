import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { BoostInput } from '@/components/boost-input';
import { Screen } from '@/components/layout/screen';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpBirthdayScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: palette.text }]}>Your Birthday</Text>
        <Text style={[styles.subtitle, { color: palette.text }]}>When is your birthday?</Text>
        <View style={styles.row}>
          <BoostInput
            placeholder="Year"
            keyboardType="number-pad"
            style={styles.inlineInput}
            containerStyle={styles.inlineContainer}
            defaultValue="1995"
          />
          <BoostInput
            placeholder="Month"
            keyboardType="number-pad"
            style={styles.inlineInput}
            containerStyle={styles.inlineContainer}
          />
          <BoostInput
            placeholder="Day"
            keyboardType="number-pad"
            style={styles.inlineInput}
            containerStyle={styles.inlineContainer}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <BoostButton label="Next" onPress={() => router.push('/signup/height')} />
        <BoostButton label="Skip" variant="ghost" onPress={() => router.push('/signup/height')} />
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
    gap: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineContainer: {
    flex: 1,
  },
  inlineInput: {
    textAlign: 'center',
  },
  footer: {
    gap: 12,
  },
});
