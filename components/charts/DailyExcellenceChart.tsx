// DailyExcellenceChart: Premium holistic score combining Wins + Routines + Tasks
// Shows daily excellence score (0-100%) with dot-line graph and trend indicator

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/design/tokens';
import { PeriodToggle, type Period } from './PeriodToggle';
import { LineChart, type DataSeries } from './LineChart';
import {
  loadExcellenceData,
  calculateExcellenceStats,
  sampleExcellenceData,
  type DailyExcellenceData,
} from '@/lib/dailyExcellence';

// Signature blue for the chart
const EXCELLENCE_COLOR = '#3B82F6';

// Period to days mapping
const PERIOD_DAYS: Record<Period, number> = {
  '7D': 7,
  '1M': 30,
  '6M': 180,
};

// Max chart points per period
const MAX_POINTS: Record<Period, number> = {
  '7D': 7,
  '1M': 15,
  '6M': 12,
};

type Props = {
  onDataLoad?: () => void;
};

export function DailyExcellenceChart({ onDataLoad }: Props) {
  const [period, setPeriod] = useState<Period>('7D');
  const [data, setData] = useState<DailyExcellenceData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const days = PERIOD_DAYS[period];
    const excellenceData = await loadExcellenceData(days);
    setData(excellenceData);
    setLoading(false);
    onDataLoad?.();
  }, [period, onDataLoad]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate stats
  const stats = calculateExcellenceStats(data);

  // Sample data for chart display
  const displayData = sampleExcellenceData(data, MAX_POINTS[period]);

  // Prepare chart series
  const chartSeries: DataSeries[] = [
    {
      label: 'Excellence',
      color: EXCELLENCE_COLOR,
      data: displayData.map((d) => ({
        label: d.label,
        value: d.score,
      })),
    },
  ];

  // Trend indicator
  const getTrendIcon = () => {
    if (stats.trendDirection === 'up') return '↑';
    if (stats.trendDirection === 'down') return '↓';
    return '→';
  };

  const getTrendColor = () => {
    if (stats.trendDirection === 'up') return '#22C55E';
    if (stats.trendDirection === 'down') return '#EF4444';
    return tokens.colors.muted;
  };

  return (
    <Card style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DAILY EXCELLENCE</Text>
        <PeriodToggle selected={period} onChange={setPeriod} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.todayScore}%</Text>
          <Text style={styles.statLabel}>TODAY</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.average}%</Text>
          <Text style={styles.statLabel}>AVERAGE</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.trendContainer}>
            <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
              {getTrendIcon()}
            </Text>
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {Math.abs(stats.trend)}%
            </Text>
          </View>
          <Text style={styles.statLabel}>TREND</Text>
        </View>
      </View>

      {/* Chart */}
      {!loading && displayData.length > 0 && (
        <Animated.View entering={FadeIn.duration(150)} style={styles.chartContainer}>
          <LineChart
            series={chartSeries}
            height={140}
            yAxisMax={100}
            valueFormatter={(v) => `${v}%`}
          />
        </Animated.View>
      )}

      {/* Loading skeleton */}
      {loading && (
        <View style={styles.skeleton}>
          <View style={styles.skeletonLine} />
        </View>
      )}

      {/* Empty state */}
      {!loading && displayData.length === 0 && (
        <Animated.View entering={FadeIn.duration(150)} style={styles.emptyState}>
          <Text style={styles.emptyText}>Start winning days to track excellence</Text>
        </Animated.View>
      )}

      {/* Score breakdown legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Win 40%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={styles.legendText}>Routines 30%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>Tasks 30%</Text>
        </View>
      </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: tokens.colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: tokens.colors.muted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 2,
  },
  trendValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  chartContainer: {
    marginTop: tokens.spacing.xs,
  },
  skeleton: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonLine: {
    width: '100%',
    height: 2,
    backgroundColor: tokens.colors.border,
    opacity: 0.5,
  },
  emptyState: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
});
