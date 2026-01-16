// ConsistencyChart: Whoop-style chart showing daily win/loss consistency
// Shows color-coded bars with period toggle

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/design/tokens';
import { PeriodToggle, type Period } from './PeriodToggle';
import { loadWins, getDailyWinsForPeriod, type DailyWinData } from '@/lib/dailyOutcomes';

// Colors for win/loss
const WIN_COLOR = '#22C55E'; // Green
const LOSS_COLOR = tokens.colors.border; // Muted gray

// Period to days mapping
const PERIOD_DAYS: Record<Period, number> = {
  '7D': 7,
  '1M': 30,
  '6M': 180,
};

type Props = {
  onDataLoad?: () => void;
};

export function ConsistencyChart({ onDataLoad }: Props) {
  const [period, setPeriod] = useState<Period>('7D');
  const [data, setData] = useState<DailyWinData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const days = PERIOD_DAYS[period];
    const wins = await loadWins();
    const dailyData = getDailyWinsForPeriod(wins, days);
    setData(dailyData);
    setLoading(false);
    onDataLoad?.();
  }, [period, onDataLoad]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // For longer periods, sample the data to avoid overcrowding
  const sampleData = (items: DailyWinData[], maxPoints: number): DailyWinData[] => {
    if (items.length <= maxPoints) return items;

    const step = Math.ceil(items.length / maxPoints);
    return items.filter((_, i) => i % step === 0 || i === items.length - 1);
  };

  // Calculate stats
  const totalWins = data.filter((d) => d.isWin).length;
  const winRate = data.length > 0 ? Math.round((totalWins / data.length) * 100) : 0;

  // Sample for display
  const maxPoints = period === '7D' ? 7 : period === '1M' ? 15 : 12;
  const displayData = sampleData(data, maxPoints);

  // Bar dimensions
  const BAR_HEIGHT = 80;
  const barWidth = displayData.length > 0 ? Math.max(4, Math.floor(280 / displayData.length) - 4) : 12;

  return (
    <Card style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CONSISTENCY</Text>
        <PeriodToggle selected={period} onChange={setPeriod} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalWins}</Text>
          <Text style={styles.statLabel}>WINS</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: winRate >= 70 ? WIN_COLOR : tokens.colors.text }]}>
            {winRate}%
          </Text>
          <Text style={styles.statLabel}>WIN RATE</Text>
        </View>
      </View>

      {/* Bar chart */}
      {!loading && displayData.length > 0 && (
        <View style={styles.chartContainer}>
          <View style={[styles.barsContainer, { height: BAR_HEIGHT }]}>
            {displayData.map((item, index) => {
              const barHeight = item.isWin ? BAR_HEIGHT : BAR_HEIGHT * 0.3;
              return (
                <View key={item.date} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: barWidth,
                        height: barHeight,
                        backgroundColor: item.isWin ? WIN_COLOR : LOSS_COLOR,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* X-axis labels */}
          <View style={styles.labelsContainer}>
            {displayData.map((item, index) => {
              // Only show some labels to avoid crowding
              const showLabel = period === '7D' || index === 0 || index === displayData.length - 1 || index % 3 === 0;
              return (
                <Text
                  key={item.date}
                  style={[styles.label, { width: barWidth + 4, opacity: showLabel ? 1 : 0 }]}
                >
                  {item.label}
                </Text>
              );
            })}
          </View>
        </View>
      )}

      {!loading && displayData.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No consistency data yet</Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
    marginBottom: tokens.spacing.md,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  chartContainer: {
    marginTop: tokens.spacing.xs,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    borderRadius: 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  emptyState: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
});
