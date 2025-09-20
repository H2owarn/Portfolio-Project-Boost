import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpWeightScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: palette.text }]}>Your Weight</Text>
        <View style={[styles.weightGraphic, { borderColor: palette.primary }]}>
          <View style={[styles.weightGraphicInner, { borderColor: palette.primary }]}>
            <Text style={[styles.weightValue, { color: palette.text }]}>80</Text>
            <Text style={[styles.unit, { color: palette.mutedText }]}>kg</Text>
          </View>
        </View>
        <View style={styles.scaleLabels}>
          <Text style={[styles.scaleLabel, { color: palette.mutedText }]}>75</Text>
          <Text style={[styles.scaleLabel, { color: palette.mutedText }]}>80</Text>
          <Text style={[styles.scaleLabel, { color: palette.mutedText }]}>85</Text>
        </View>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderProgress, { backgroundColor: palette.primary }]} />
          <View style={[styles.sliderThumb, { borderColor: palette.primary, backgroundColor: palette.background }]} />
        </View>
      </View>
      <View style={styles.footer}>
        <BoostButton label="Finish" onPress={() => router.replace('/(tabs)')} />
        <BoostButton label="Skip" variant="ghost" onPress={() => router.replace('/(tabs)')} />
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
    alignItems: 'center',
    gap: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  weightGraphic: {
    width: 220,
    height: 220,
    borderRadius: Radii.pill,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightGraphicInner: {
    width: 180,
    height: 180,
    borderRadius: Radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
  },
  weightValue: {
    fontSize: 56,
    fontWeight: '800',
  },
  unit: {
    fontSize: 20,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  scaleLabel: {
    fontSize: 14,
  },
  sliderTrack: {
    width: '100%',
    height: 12,
    borderRadius: Radii.lg,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
  },
  sliderProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    borderRadius: Radii.lg,
  },
  sliderThumb: {
    position: 'absolute',
    right: '40%',
    transform: [{ translateX: 12 }],
    width: 24,
    height: 24,
    borderRadius: Radii.pill,
    borderWidth: 2,
  },
  footer: {
    gap: 12,
  },
});
