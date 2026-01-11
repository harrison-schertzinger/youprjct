import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { getCurrentMonthData } from '@/utils/calendar';
import { getLossStreakLength } from '@/lib/dailyOutcomes';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  /** Record of wins stored in AsyncStorage */
  wins: Record<string, 'win'>;
  /** ISO date string of when user first opened app (for inactive days) */
  firstOpenedAt: string | null;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return da < db;
}

function lossColorForStreak(streakLen: number): string {
  if (streakLen >= 5) return tokens.colors.calendar.loss3;
  if (streakLen >= 3) return tokens.colors.calendar.loss2;
  return tokens.colors.calendar.loss1;
}

export function MonthGrid({ selectedDay, onSelectDay, wins, firstOpenedAt }: Props) {
  const today = new Date();
  const joinDate = firstOpenedAt ? new Date(firstOpenedAt) : null;

  const monthData = useMemo(() => getCurrentMonthData(), []);

  return (
    <View>
      <Text style={[tokens.typography.h2, { color: tokens.colors.text }]}>
        {monthData.monthName}
      </Text>

      {/* Weekday header */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((w, idx) => (
          <Text key={`${w}-${idx}`} style={[styles.weekday, { color: tokens.colors.muted }]}>
            {w}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {monthData.cells.map((cell, idx) => {
          if (cell.type === 'blank') return <View key={`b-${idx}`} style={styles.cell} />;

          const day = cell.value;
          const date = cell.date;

          const isSelected = day === selectedDay;
          const isToday = isSameDay(date, today);
          const isPast = isBeforeDay(date, today);

          // Check if day is before user joined the app
          const isBeforeJoin = joinDate ? isBeforeDay(date, joinDate) : false;

          const dateKey = cell.dateKey;
          const isWin = !!wins[dateKey];

          // Loss = past day (after joining) without a win
          const isLoss = isPast && !isWin && !isBeforeJoin;

          // Future or today (not yet decided)
          const isFuture = !isPast && !isToday;
          const isNeutral = isFuture || (isToday && !isWin);

          // Determine styles
          let bgColor: string = tokens.colors.card;
          let borderColor: string = tokens.colors.border;
          let textColor: string = tokens.colors.text;

          if (isSelected) {
            bgColor = tokens.colors.text;
            borderColor = tokens.colors.text;
            textColor = '#FFFFFF';
          } else if (isBeforeJoin) {
            // Soft grey for days before joining
            bgColor = tokens.colors.calendar.inactive;
            borderColor = tokens.colors.calendar.inactive;
            textColor = tokens.colors.muted;
          } else if (isWin) {
            bgColor = tokens.colors.calendar.win;
            borderColor = tokens.colors.calendar.winBorder;
          } else if (isLoss) {
            const streakLen = getLossStreakLength(date, wins);
            bgColor = lossColorForStreak(streakLen);
            borderColor = bgColor;
          } else if (isNeutral) {
            // Keep default card/border for future days
          }

          return (
            <View key={`d-${day}-${idx}`} style={styles.cell}>
              <Pressable
                onPress={() => onSelectDay(day)}
                style={[styles.circle, { backgroundColor: bgColor, borderColor }]}
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

const SIZE = 44;

const styles = StyleSheet.create({
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  weekday: {
    width: SIZE,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cell: {
    width: SIZE,
    height: SIZE,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
