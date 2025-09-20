import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WorkoutOverviewScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.header}>
        <BoostButton
          label="Back"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth={false}
          icon={<MaterialIcons name="arrow-back-ios" size={18} color={palette.text} />}
        />
        <View style={[styles.timerChip, { backgroundColor: palette.surface }]}>
          <MaterialIcons name="timer" size={16} color={palette.primary} />
          <Text style={[styles.timerText, { color: palette.text }]}>01:45</Text>
        </View>
      </View>

      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEmAAs5f4tkJ98hUTEKZw6aB-DtdN0nOHtC8J00yslbbZNYMYpl6A43gryLworUhL6HOA0YwsIez2kEk1PkCmSfs6aaqjYlp7c7im81AOeqZb8X5RXf7671f9XItuxswDfaQ-Q58Nih2NPm4cG047DoRrReTuqOow47fGqmzDwW843YTM09PGzRSS-gSxl00xnxNVKYDNBTBC9RQdsM5zNJ4Ygnf0l-IYjmk8mWvpjRVZH7Oab0Gw0wQhTCadOHd6XRgZrCfHg9Ac',
        }}
        style={styles.hero}
      />

      <Text style={[styles.title, { color: palette.text }]}>Plank</Text>

      <View style={[styles.timerDial, { borderColor: palette.primary }]}>
        <Text style={[styles.timerValue, { color: palette.text }]}>00:30</Text>
        <BoostButton
          label="Start"
          variant="primary"
          fullWidth={false}
          icon={<MaterialIcons name="play-arrow" size={22} color="#000000" />}
          onPress={() => router.push('/workout/in-progress')}
        />
      </View>

      <View style={[styles.nextCard, { backgroundColor: palette.surface }]}>
        <View style={styles.nextInfo}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNsup395NFD7R10RHflPwPbqPHLGFYFI2jDceQfGKuAuEglavpMu4W7q2Pqow1tsfPCcXi57ZkzYL-ys8QZYTvXbV_rgDW8_flKsW5vcKuouphV4QPGB0B9O5aUh9_jCszFyEWByD4eoygjBH-kZZN7Ig7NnfrI_FNpqevjNrHrP10dC3NO8OaRhmjQ_QMxHM8JHMzzqsM_C-GZi6kLAKo6mgnyzvGGmMuy75VLDMkmrdHd1AIMNfhwM1BIx3K5Dj7vEejJwVmNIQ',
            }}
            style={styles.nextImage}
          />
          <View>
            <Text style={[styles.nextLabel, { color: palette.mutedText }]}>Next:</Text>
            <Text style={[styles.nextTitle, { color: palette.text }]}>Crossover Crunches</Text>
          </View>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={20} color={palette.mutedText} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  timerText: {
    fontWeight: '600',
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: Radii.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  timerDial: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 24,
    borderRadius: Radii.lg,
    borderWidth: 2,
  },
  timerValue: {
    fontSize: 40,
    fontWeight: '800',
  },
  nextCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radii.lg,
    padding: 16,
  },
  nextInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  nextImage: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
  },
  nextLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
