import React, { useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { generateMonthData, isSameDay } from '@/utils/calendar';
import { getLossStreakLength } from '@/lib/dailyOutcomes';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  wins: Record<string, 'win'>;
  firstOpenedAt: string | null;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Colors
const WIN_COLOR = '#10B981';
const TODAY_COLOR = '#5B8DEF'; // Marble-like blue
const PRE_SIGNUP_COLOR = '#9CA3AF'; // Darker grey for days before signup
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

function isPastDay(date: Date, today: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

function isBeforeFirstOpen(date: Date, firstOpenedAt: string | null): boolean {
  if (!firstOpenedAt) return false;
  const firstOpen = new Date(firstOpenedAt);
  const firstOpenDay = new Date(firstOpen.getFullYear(), firstOpen.getMonth(), firstOpen.getDate());
  const checkDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return checkDay.getTime() < firstOpenDay.getTime();
}

export function MonthGrid({ selectedDay, onSelectDay, wins, firstOpenedAt }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthData = useMemo(() => generateMonthData(viewYear, viewMonth), [viewYear, viewMonth]);

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    // Don't allow navigating past current month
    if (isCurrentMonth) return;

    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <View>
      {/* Month Header with Navigation */}
      <View style={styles.header}>
        <Pressable onPress={goToPrevMonth} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>←</Text>
        </Pressable>
        <Text style={[tokens.typography.h2, { color: tokens.colors.text }]}>
          {monthData.monthName} {viewYear !== today.getFullYear() ? viewYear : ''}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          style={[styles.arrowBtn, isCurrentMonth && styles.arrowDisabled]}
        >
          <Text style={[styles.arrowText, isCurrentMonth && styles.arrowTextDisabled]}>→</Text>
        </Pressable>
      </View>

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
          const isSelected = isCurrentMonth && day === selectedDay;
          const isToday = isSameDay(date, today);
          const isPast = isPastDay(date, today);
          const isPreSignup = isBeforeFirstOpen(date, firstOpenedAt);

          const dateKey = cell.dateKey;
          const isWin = !!wins[dateKey];

          // Determine day state
          let bgColor: string | undefined;
          let borderColor: string = tokens.colors.border;
          let textColor: string = tokens.colors.text;

          if (isSelected && !isToday) {
            // Selected (but not today) - dark text background
            bgColor = tokens.colors.text;
            borderColor = tokens.colors.text;
            textColor = '#FFFFFF';
          } else if (isWin) {
            // Win - green
            bgColor = WIN_COLOR;
            borderColor = WIN_COLOR;
            textColor = '#FFFFFF';
          } else if (isToday) {
            // Today (not won yet) - marble blue
            bgColor = TODAY_COLOR;
            borderColor = TODAY_COLOR;
            textColor = '#FFFFFF';
          } else if (isPreSignup) {
            // Before user signed up - darker grey
            bgColor = PRE_SIGNUP_COLOR;
            borderColor = PRE_SIGNUP_COLOR;
            textColor = '#FFFFFF';
          } else if (isPast && !isWin) {
            // Loss (past day, after signup, not won) - red gradient
            const streakLen = getLossStreakLength(date, wins);
            bgColor = getLossColor(streakLen);
            borderColor = bgColor;
            textColor = '#FFFFFF';
          } else {
            // Future days - white/neutral
            bgColor = tokens.colors.card;
            borderColor = tokens.colors.border;
            textColor = tokens.colors.text;
          }

          return (
            <View key={`d-${viewYear}-${viewMonth}-${day}`} style={styles.cell}>
              <Pressable
                onPress={() => {
                  if (isCurrentMonth) {
                    onSelectDay(day);
                  }
                }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  arrowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  arrowTextDisabled: {
    color: tokens.colors.muted,
  },
  weekdays: { flexDirection: 'row', marginTop: 10, marginBottom: 6 },
  weekday: { width: '14.285%', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  cell: { width: '14.285%', paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  dayBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 16, fontWeight: '700' },
});
