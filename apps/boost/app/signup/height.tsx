import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tickMarks = Array.from({ length: 11 });

export default function SignUpHeightScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen scrollable={false} contentStyle={styles.container}>
      <View style={styles.top}>
        <Text style={[styles.heading, { color: palette.text }]}>Your Height</Text>
      </View>
      <View style={styles.center}>
        <View style={[styles.circle, { borderColor: palette.primary }]}>
          <View style={[styles.circleInner, { borderColor: palette.primary }]}>
            <Text style={[styles.heightValue, { color: palette.text }]}>180</Text>
            <Text style={[styles.unit, { color: palette.mutedText }]}>cm</Text>
          </View>
        </View>
      </View>
      <View style={styles.rulerWrapper}>
        <View style={styles.rulerLabels}>
          <Text style={[styles.rulerLabel, { color: palette.mutedText }]}>175</Text>
          <Text style={[styles.rulerLabel, { color: palette.mutedText }]}>180</Text>
          <Text style={[styles.rulerLabel, { color: palette.mutedText }]}>185</Text>
        </View>
        <View style={[styles.ruler, { borderColor: palette.primary }]}>
          {tickMarks.map((_, index) => (
            <View
              key={`tick-${index}`}
              style={[
                styles.tick,
                index === Math.floor(tickMarks.length / 2)
                  ? styles.tickActive
                  : index % 2 === 0
                    ? styles.tickMedium
                    : styles.tickSmall,
                { backgroundColor: palette.mutedText },
              ]}
            />
          ))}
          <View style={[styles.cursor, { backgroundColor: palette.primary }]} />
        </View>
      </View>
      <View style={styles.footer}>
        <BoostButton label="Next" onPress={() => router.push('/signup/weight')} />
        <BoostButton label="Skip" variant="ghost" onPress={() => router.push('/signup/weight')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  top: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  circle: {
    width: 210,
    height: 210,
    borderRadius: Radii.pill,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: Radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
  },
  heightValue: {
    fontSize: 56,
    fontWeight: '800',
  },
  unit: {
    fontSize: 20,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  rulerWrapper: {
    gap: 16,
  },
  rulerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  rulerLabel: {
    fontSize: 13,
  },
  ruler: {
    position: 'relative',
    height: 64,
    borderRadius: Radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  tick: {
    width: 2,
    borderRadius: 2,
  },
  tickSmall: {
    height: 12,
  },
  tickMedium: {
    height: 24,
  },
  tickActive: {
    height: 44,
  },
  cursor: {
    position: 'absolute',
    width: 3,
    height: '100%',
    left: '50%',
    marginLeft: -1.5,
  },
  footer: {
    gap: 12,
  },
});
