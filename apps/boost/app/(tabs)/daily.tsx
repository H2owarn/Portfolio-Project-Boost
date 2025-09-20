import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const weeklyLine = [40, 80, 55, 70, 45, 85, 65];
const weeklyBars = [40, 80, 30, 90, 50, 70, 95];

export default function DailyTabScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen contentStyle={styles.container}>
      <Text style={[styles.title, { color: palette.text }]}>Daily</Text>

      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Weekly Activity</Text>
          <View style={styles.metricLabel}>
            <Text style={[styles.metricValue, { color: palette.primary }]}>45</Text>
            <Text style={[styles.metricUnit, { color: palette.text }]}>min</Text>
          </View>
        </View>
        <View style={styles.chartArea}>
          <View style={styles.lineChart}>
            {weeklyLine.map((height, index) => (
              <View key={weekDays[index]} style={styles.lineColumn}>
                <View style={[styles.lineMarker, { height, backgroundColor: palette.primary }]} />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {weekDays.map((day) => (
              <Text key={day} style={[styles.chartLabel, { color: palette.mutedText }]}>{day}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Weekly Energy</Text>
          <Text style={[styles.metricValue, { color: palette.primary }]}>5</Text>
        </View>
        <View style={styles.chartArea}>
          <View style={styles.barChart}>
            {weeklyBars.map((value, index) => (
              <View key={weekDays[index]} style={styles.barWrapper}>
                <View style={[styles.bar, { height: value, backgroundColor: palette.primary }]} />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {weekDays.map((day) => (
              <Text key={day} style={[styles.chartLabel, { color: palette.mutedText }]}>{day}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: palette.surface }]}>
          <View style={styles.metricCardHeader}>
            <Text style={[styles.metricCardTitle, { color: palette.text }]}>Water</Text>
            <Text style={[styles.metricCardValue, { color: palette.primary }]}>3/8</Text>
          </View>
          <View style={[styles.waterGraphic, { borderColor: palette.primary }]}>
            <View style={[styles.waterFill, { backgroundColor: palette.primary }]} />
          </View>
          <BoostButton label="Drink" onPress={() => {}} fullWidth={false} variant="secondary" />
        </View>

        <View style={[styles.metricCard, { backgroundColor: palette.surface }]}>
          <View style={styles.metricCardHeader}>
            <Text style={[styles.metricCardTitle, { color: palette.text }]}>Weight</Text>
            <Text style={[styles.metricCardValue, { color: palette.primary }]}>87.6 kg</Text>
          </View>
          <View style={[styles.weightRing, { borderColor: palette.primary }]}>
            <View style={[styles.weightRingInner, { borderColor: palette.primary }]}>
              <MaterialIcons name="monitor-weight" size={32} color={palette.primary} />
            </View>
          </View>
          <BoostButton label="Change" onPress={() => {}} fullWidth={false} variant="secondary" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  card: {
    borderRadius: Radii.lg,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  metricLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartArea: {
    gap: 12,
  },
  lineChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  lineColumn: {
    width: 16,
    justifyContent: 'flex-end',
  },
  lineMarker: {
    width: 6,
    borderRadius: 3,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: {
    width: 18,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  metricCardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricCardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  waterGraphic: {
    width: 120,
    height: 120,
    borderRadius: Radii.pill,
    borderWidth: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  waterFill: {
    width: '100%',
    height: '50%',
    opacity: 0.4,
  },
  weightRing: {
    width: 120,
    height: 120,
    borderRadius: Radii.pill,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightRingInner: {
    width: 80,
    height: 80,
    borderRadius: Radii.pill,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
