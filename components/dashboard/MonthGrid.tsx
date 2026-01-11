import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday-first UI

export function MonthGrid({ selectedDay, onSelectDay }: Props) {
  // For now: show January with 31 days (matches your mock).
  // Later we’ll make it dynamic by month/year.
  const monthName = 'January';
  const daysInMonth = 31;

  // January mock: assume Jan 1 falls on Thursday (Mon-first index = 3)
  // If your month differs, we’ll make this dynamic next.
  const firstDayOfWeekMonFirst = 3; // 0=Mon ... 6=Sun

  const cells = useMemo(() => {
    const arr: Array<{ type: 'blank' } | { type: 'day'; value: number }> = [];
    for (let i = 0; i < firstDayOfWeekMonFirst; i++) arr.push({ type: 'blank' });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ type: 'day', value: d });

    // pad to complete final week (multiple of 7)
    while (arr.length % 7 !== 0) arr.push({ type: 'blank' });
    return arr;
  }, []);

  return (
    <View>
      <Text style={[tokens.typography.h2, { color: tokens.colors.text }]}>{monthName}</Text>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((w, idx) => (
          <Text key={`${w}-${idx}`} style={[styles.weekday, { color: tokens.colors.muted }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, idx) => {
          if (cell.type === 'blank') return <View key={`b-${idx}`} style={styles.cell} />;

          const day = cell.value;
          const isSelected = day === selectedDay;

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
                    isSelected && { color: tokens.colors.background },
                  ]}
                >
                  {day}
                </Text>
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
