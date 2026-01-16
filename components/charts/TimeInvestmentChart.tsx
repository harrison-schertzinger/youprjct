// TimeInvestmentChart: Whoop-style chart for reading and training time
// Shows dual lines with period toggle

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/design/tokens';
import { LineChart, type DataSeries, type DataPoint } from './LineChart';
import { PeriodToggle, type Period } from './PeriodToggle';
import { getDailyTotalsForPeriod, type DailyTotal } from '@/lib/repositories/ActivityRepo';

// Colors for the chart lines
const READING_COLOR = tokens.colors.tint; // Blue
const TRAINING_COLOR = tokens.colors.action; // Green/emerald

// Period to days mapping
const PERIOD_DAYS: Record<Period, number> = {
  '7D': 7,
  '1M': 30,
  '6M': 180,
};

// Format seconds to minutes for display
function formatMinutes(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
}

// Get color based on target achievement (30min = green, 15-30 = yellow, <15 = red)
function getColorForValue(seconds: number): string {
  const mins = seconds / 60;
  if (mins >= 30) return '#22C55E'; // Green
  if (mins >= 15) return '#EAB308'; // Yellow
  if (mins > 0) return '#EF4444'; // Red
  return tokens.colors.muted; // No data
}

type Props = {
  onDataLoad?: () => void;
};

export function TimeInvestmentChart({ onDataLoad }: Props) {
  const [period, setPeriod] = useState<Period>('7D');
  const [readingData, setReadingData] = useState<DailyTotal[]>([]);
  const [trainingData, setTrainingData] = useState<DailyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const days = PERIOD_DAYS[period];

    const [reading, training] = await Promise.all([
      getDailyTotalsForPeriod('reading', days),
      getDailyTotalsForPeriod('workout', days),
    ]);

    setReadingData(reading);
    setTrainingData(training);
    setLoading(false);
    onDataLoad?.();
  }, [period, onDataLoad]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // For longer periods, sample the data to avoid overcrowding
  const sampleData = (data: DailyTotal[], maxPoints: number): DailyTotal[] => {
    if (data.length <= maxPoints) return data;

    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  };

  // Convert to chart data format
  const maxPoints = period === '7D' ? 7 : period === '1M' ? 10 : 12;
  const sampledReading = sampleData(readingData, maxPoints);
  const sampledTraining = sampleData(trainingData, maxPoints);

  const readingSeries: DataSeries = {
    label: 'Reading',
    color: READING_COLOR,
    data: sampledReading.map((d): DataPoint => ({
      label: d.label,
      value: Math.round(d.seconds / 60), // Convert to minutes for chart
      color: getColorForValue(d.seconds),
    })),
  };

  const trainingSeries: DataSeries = {
    label: 'Training',
    color: TRAINING_COLOR,
    data: sampledTraining.map((d): DataPoint => ({
      label: d.label,
      value: Math.round(d.seconds / 60),
      color: getColorForValue(d.seconds),
    })),
  };

  // Calculate totals for the period
  const readingTotal = readingData.reduce((sum, d) => sum + d.seconds, 0);
  const trainingTotal = trainingData.reduce((sum, d) => sum + d.seconds, 0);

  return (
    <Card style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TIME INVESTMENT</Text>
        <PeriodToggle selected={period} onChange={setPeriod} />
      </View>

      {/* Legend with totals */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: READING_COLOR }]} />
          <Text style={styles.legendLabel}>Reading</Text>
          <Text style={[styles.legendValue, { color: READING_COLOR }]}>
            {formatMinutes(readingTotal)}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TRAINING_COLOR }]} />
          <Text style={styles.legendLabel}>Training</Text>
          <Text style={[styles.legendValue, { color: TRAINING_COLOR }]}>
            {formatMinutes(trainingTotal)}
          </Text>
        </View>
      </View>

      {/* Chart */}
      {!loading && readingSeries.data.length > 0 && (
        <LineChart
          series={[readingSeries, trainingSeries]}
          height={160}
          showValues={false}
          valueFormatter={(v) => `${v}m`}
        />
      )}

      {!loading && readingSeries.data.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No activity data yet</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 0.5,
  },
  legend: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
});
