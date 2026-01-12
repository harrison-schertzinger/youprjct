import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { getCurrentMonthData } from '@/utils/calendar';
import { getLossStreakLength } from '@/lib/dailyOutcomes';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  wins: Record<string, 'win'>;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WIN_COLOR = '#10B981';
const LOSS_COLORS = {
  light: '#FCA5A5',
  medium: '#F87171',
  dark: '#EF4444',
};

function getLossColor(streakLength: number): string {
  if (streakLength >= 5) return LOSS_COLORS.dark;
  if (streakLength >= 3) return LOSS_COLORS.medium;
  return LOSS_COLORS.light;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isPastDay(date: Date, today: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

export function MonthGrid({ selectedDay, onSelectDay, wins }: Props) {
  const today = new Date();
  const monthData = useMemo(() => getCurrentMonthData(), []);

  return (
    <View>
      <Text style={[tokens.typography.h2, { color: tokens.colors.text }]}>
        {monthData.monthName}
      </Text>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((w, idx) => (
          <Text key={`${w}-${idx}`} style={[styles.weekday, { color: tokens.colors.muted }]}>{w}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {monthData.cells.map((cell, idx) => {
          if (cell.type === 'blank') return <View key={`b-${idx}`} style={styles.cell} />;

          const day = cell.value;
          const date = cell.date;
          const isSelected = day === selectedDay;
          const isToday = isSameDay(date, today);
          const isPast = isPastDay(date, today);

          const dateKey = cell.dateKey;
          const isWin = !!wins[dateKey];

          // Only past days without wins are losses
          const isLoss = isPast && !isWin;

          // Future days and today (if not won) are neutral
          const isNeutral = !isWin && !isPast;

          let bgColor: string | undefined;
          let borderColor: string = tokens.colors.border;
          let textColor: string = tokens.colors.text;

          if (isSelected) {
            bgColor = tokens.colors.text;
            borderColor = tokens.colors.text;
            textColor = '#FFFFFF';
          } else if (isWin) {
            bgColor = WIN_COLOR;
            borderColor = WIN_COLOR;
            textColor = '#FFFFFF';
          } else if (isLoss) {
            const streakLen = getLossStreakLength(date, wins);
            bgColor = getLossColor(streakLen);
            borderColor = bgColor;
            textColor = '#FFFFFF';
          } else if (isNeutral || isToday) {
            // White with subtle border
            bgColor = tokens.colors.card;
            borderColor = tokens.colors.border;
            textColor = tokens.colors.text;
          }

          return (
            <View key={`d-${day}`} style={styles.cell}>
              <Pressable
                onPress={() => onSelectDay(day)}
                style={[styles.dayBtn, { backgroundColor: bgColor, borderColor, borderWidth: 1 }]}
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
  weekdays: { flexDirection: 'row', marginTop: 10, marginBottom: 6 },
  weekday: { width: '14.285%', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  cell: { width: '14.285%', paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  dayBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 16, fontWeight: '700' },
});
