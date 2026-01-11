import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { getCurrentMonthData, formatDateKey } from '@/utils/calendar';
import { getDayOutcome, getLossStreakLength } from '@/lib/dailyOutcomes';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  /**
   * Record of wins stored in AsyncStorage.
   * Any day without a win is treated as a loss.
   */
  wins: Record<string, 'win'>;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday-first UI

// Premium green for wins
const WIN_COLOR = '#10B981'; // emerald-500

// Loss streak shading: 3+ levels of darkness
const LOSS_COLORS = {
  light: '#FCA5A5',    // red-300 (1-2 day streak)
  medium: '#F87171',   // red-400 (3-4 day streak)
  dark: '#EF4444',     // red-500 (5+ day streak)
};

/**
 * Get the background color for a loss based on streak length.
 * Consecutive losses get progressively darker red.
 */
function getLossColor(streakLength: number): string {
  if (streakLength >= 5) return LOSS_COLORS.dark;
  if (streakLength >= 3) return LOSS_COLORS.medium;
  return LOSS_COLORS.light;
}

export function MonthGrid({ selectedDay, onSelectDay, wins }: Props) {
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
          const outcome = getDayOutcome(cell.date, wins);
          const isWin = outcome === 'win';
          const isSelected = day === selectedDay;

          // Determine background color
          let bgColor: string | undefined;
          if (!isSelected) {
            if (isWin) {
              bgColor = WIN_COLOR;
            } else {
              const streakLength = getLossStreakLength(cell.date, wins);
              bgColor = getLossColor(streakLength);
            }
          }

          // Determine text color
          const textColor = isSelected
            ? tokens.colors.bg
            : bgColor
            ? '#FFFFFF'
            : tokens.colors.text;

          return (
            <View key={`d-${day}`} style={styles.cell}>
              <Pressable
                onPress={() => onSelectDay(day)}
                style={[
                  styles.dayBtn,
                  isSelected && { backgroundColor: tokens.colors.text },
                  !isSelected && bgColor && { backgroundColor: bgColor },
                ]}
              >
                <Text style={[styles.dayText, { color: textColor }]}>{day}</Text>
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
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
