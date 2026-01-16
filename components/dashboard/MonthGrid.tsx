import React, { useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

// Premium color palettes with gradients
const COLORS = {
  win: {
    gradient: ['#34D399', '#10B981', '#059669'] as const,
    shadow: '#059669',
  },
  today: {
    gradient: ['#6366F1', '#5B6EF5', '#5558E8'] as const,
    shadow: '#4338CA',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  preSignup: {
    gradient: ['#D1D5DB', '#9CA3AF', '#6B7280'] as const,
    shadow: '#6B7280',
  },
  loss: {
    light: {
      gradient: ['#FCA5A5', '#F87171', '#EF4444'] as const,
      shadow: '#EF4444',
    },
    medium: {
      gradient: ['#F87171', '#EF4444', '#DC2626'] as const,
      shadow: '#DC2626',
    },
    dark: {
      gradient: ['#EF4444', '#DC2626', '#B91C1C'] as const,
      shadow: '#B91C1C',
    },
  },
  neutral: {
    gradient: ['#FFFFFF', '#FAFAFA', '#F5F5F5'] as const,
    border: '#E5E7EB',
  },
  future: {
    gradient: ['#F9FAFB', '#F3F4F6', '#E5E7EB'] as const,
    border: '#E5E7EB',
  },
  selected: {
    gradient: ['#374151', '#1F2937', '#111827'] as const,
    shadow: '#111827',
  },
};

function getLossColors(streakLength: number) {
  if (streakLength >= 5) return COLORS.loss.dark;
  if (streakLength >= 3) return COLORS.loss.medium;
  return COLORS.loss.light;
}

function isPastDay(date: Date, today: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

function isFutureDay(date: Date, today: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() > t.getTime();
}

function isBeforeFirstOpen(date: Date, firstOpenedAt: string | null): boolean {
  if (!firstOpenedAt) return false;
  const firstOpen = new Date(firstOpenedAt);
  const firstOpenDay = new Date(firstOpen.getFullYear(), firstOpen.getMonth(), firstOpen.getDate());
  const checkDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return checkDay.getTime() < firstOpenDay.getTime();
}

type DayStyle = {
  gradient: readonly [string, string, string];
  shadow?: string;
  glow?: string;
  textColor: string;
  borderColor?: string;
};

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
    if (isCurrentMonth) return;

    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const getDayStyle = (
    isSelected: boolean,
    isToday: boolean,
    isWin: boolean,
    isPreSignup: boolean,
    isPast: boolean,
    isFuture: boolean,
    streakLen: number
  ): DayStyle => {
    // Future days are always muted (locked)
    if (isFuture) {
      return {
        gradient: COLORS.future.gradient,
        borderColor: COLORS.future.border,
        textColor: tokens.colors.muted,
      };
    }
    if (isSelected && !isToday) {
      return {
        gradient: COLORS.selected.gradient,
        shadow: COLORS.selected.shadow,
        textColor: '#FFFFFF',
      };
    }
    if (isWin) {
      return {
        gradient: COLORS.win.gradient,
        shadow: COLORS.win.shadow,
        textColor: '#FFFFFF',
      };
    }
    if (isToday) {
      return {
        gradient: COLORS.today.gradient,
        shadow: COLORS.today.shadow,
        glow: COLORS.today.glow,
        textColor: '#FFFFFF',
      };
    }
    if (isPreSignup) {
      return {
        gradient: COLORS.preSignup.gradient,
        shadow: COLORS.preSignup.shadow,
        textColor: '#FFFFFF',
      };
    }
    if (isPast) {
      const lossColors = getLossColors(streakLen);
      return {
        gradient: lossColors.gradient,
        shadow: lossColors.shadow,
        textColor: '#FFFFFF',
      };
    }
    // Neutral (shouldn't reach here normally)
    return {
      gradient: COLORS.neutral.gradient,
      borderColor: COLORS.neutral.border,
      textColor: tokens.colors.text,
    };
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
          const isToday = isSameDay(date, today);
          const isPast = isPastDay(date, today);
          const isFuture = isFutureDay(date, today);
          const isPreSignup = isBeforeFirstOpen(date, firstOpenedAt);
          // Only allow selecting today or past days (not future)
          const isSelected = isCurrentMonth && day === selectedDay && !isFuture;
          const canSelect = isCurrentMonth && !isFuture;

          const dateKey = cell.dateKey;
          const isWin = !!wins[dateKey];
          const isLoss = isPast && !isWin && !isPreSignup;
          const streakLen = isLoss ? getLossStreakLength(date, wins) : 0;

          const style = getDayStyle(isSelected, isToday, isWin, isPreSignup, isLoss, isFuture, streakLen);

          return (
            <View key={`d-${viewYear}-${viewMonth}-${day}`} style={styles.cell}>
              {/* Glow effect for today */}
              {style.glow && (
                <View style={[styles.glowOuter, { backgroundColor: style.glow }]} />
              )}
              <Pressable
                onPress={() => {
                  if (canSelect) {
                    onSelectDay(day);
                  }
                }}
                disabled={!canSelect}
                style={({ pressed }) => [
                  styles.dayBtnOuter,
                  style.shadow && {
                    shadowColor: style.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                  pressed && canSelect && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={style.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.dayBtn,
                    style.borderColor && { borderWidth: 1, borderColor: style.borderColor },
                  ]}
                >
                  <Text style={[styles.dayText, { color: style.textColor }]}>{day}</Text>
                </LinearGradient>
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
  cell: {
    width: '14.285%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.6,
  },
  dayBtnOuter: {
    borderRadius: 20,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
