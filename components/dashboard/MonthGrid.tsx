import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { getCurrentMonthData, formatDateKey } from '@/utils/calendar';

type DayActivity = {
  hasWinLoss?: boolean;
  hasCompletedRoutines?: boolean;
};

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  /**
   * Map of date keys (YYYY-MM-DD) to activity indicators.
   * Use this to show visual indicators on days with recorded data.
   */
  dayActivities?: Record<string, DayActivity>;
  /**
   * Map of date keys (YYYY-MM-DD) to daily outcomes.
   * Shows colored dots: black for 'win', light gray for 'loss'.
   */
  outcomeDays?: Record<string, 'win' | 'loss'>;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday-first UI

export function MonthGrid({ selectedDay, onSelectDay, dayActivities = {}, outcomeDays = {} }: Props) {
  // Generate dynamic month data based on current date
  const monthData = useMemo(() => getCurrentMonthData(), []);

  return (
    <View>
      <Text style={[tokens.typography.h2, { color: tokens.colors.text }]}>
        {monthData.monthName}
      </Text>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((w, idx) => (
          <Text key={`${w}-${idx}`} style={[styles.weekday, { color: tokens.colors.muted }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {monthData.cells.map((cell, idx) => {
          if (cell.type === 'blank') return <View key={`b-${idx}`} style={styles.cell} />;

          const day = cell.value;
          const dateKey = formatDateKey(cell.date);
          const activity = dayActivities[dateKey];
          const outcome = outcomeDays[dateKey];
          const hasActivity = activity?.hasWinLoss || activity?.hasCompletedRoutines;
          const isSelected = day === selectedDay;

          // Determine indicator color based on outcome
          let indicatorColor: string | undefined;
          if (outcome === 'win') {
            indicatorColor = tokens.colors.text; // black for win
          } else if (outcome === 'loss') {
            indicatorColor = tokens.colors.muted; // light gray for loss
          } else if (hasActivity) {
            indicatorColor = tokens.colors.text; // fallback to existing behavior
          }

          return (
            <View key={`d-${day}`} style={styles.cell}>
              <Pressable
                onPress={() => onSelectDay(day)}
                style={[
                  styles.dayBtn,
                  isSelected && { backgroundColor: tokens.colors.text },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: tokens.colors.text },
                    isSelected && { color: tokens.colors.bg },
                  ]}
                >
                  {day}
                </Text>
                {indicatorColor && !isSelected && (
                  <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekdays: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 6,
  },
  weekday: {
    width: '14.285%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  cell: {
    width: '14.285%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
