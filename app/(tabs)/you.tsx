import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import { MonthGrid } from '@/components/dashboard/MonthGrid';
import {
  loadWins,
  markDayAsWin,
  getTotalDaysWon,
  getThisWeekStats,
  getDayOutcome,
} from '@/lib/dailyOutcomes';
import { getOrSetFirstOpenedAt, daysSince } from '@/lib/appStreak';

export default function YouScreen() {
  const [morning, setMorning] = useState([false, false, false]);
  const [tasks, setTasks] = useState([false, false, false, false]);
  const [evening, setEvening] = useState([false, false]);

  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [wins, setWins] = useState<Record<string, 'win'>>({});

  // App streak (days on app)
  const [firstOpenedAt, setFirstOpenedAt] = useState<string | null>(null);

  useEffect(() => {
    // Load wins
    loadWins().then(setWins);

    // Set first opened date (once)
    getOrSetFirstOpenedAt().then(setFirstOpenedAt);
  }, []);

  const appStreakDays = useMemo(() => {
    if (!firstOpenedAt) return 1;
    return daysSince(firstOpenedAt) + 1; // inclusive
  }, [firstOpenedAt]);

  // Selected date object (current month/year)
  const selectedDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), selectedDay);
  }, [selectedDay]);

  // Is selected day won?
  const isSelectedDayWon = useMemo(
    () => getDayOutcome(selectedDate, wins) === 'win',
    [selectedDate, wins]
  );

  // Compute stats from wins
  const totalDaysWon = useMemo(() => getTotalDaysWon(wins), [wins]);
  const { winsThisWeek, totalDaysThisWeek } = useMemo(() => getThisWeekStats(wins), [wins]);

  // Handle "I Won Today"
  const handleWinTheDay = async () => {
    await markDayAsWin(selectedDate);
    const updatedWins = await loadWins();
    setWins(updatedWins);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header (Whoop-like: title left, streak right) */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>Today</Text>
            <Text style={styles.headerSubtitle}>Winning the day</Text>
          </View>

          <View style={styles.streakPill}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>🔥 {appStreakDays}</Text>
          </View>
        </View>

        {/* Stats Bar */}
        <Card style={{ paddingVertical: tokens.spacing.sm }}>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Days Won</Text>
              <Text style={[styles.statValue, { color: tokens.colors.action }]}>{totalDaysWon}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Consistency</Text>
              <Text style={[styles.statValue, { color: tokens.colors.tint }]}>82%</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>This Week</Text>
              <Text style={[styles.statValue, { color: tokens.colors.action }]}>
                {winsThisWeek}/{totalDaysThisWeek}
              </Text>
            </View>
          </View>
        </Card>

        {/* Calendar Card */}
        <Card style={{ marginTop: tokens.spacing.md }}>
          <MonthGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} wins={wins} firstOpenedAt={firstOpenedAt} />
        </Card>

        {/* Day Won Tile */}
        <Card style={{ marginTop: tokens.spacing.md, padding: tokens.spacing.sm }}>
          <PrimaryButton
            label={isSelectedDayWon ? '✓ Day Won' : 'I Won Today'}
            onPress={handleWinTheDay}
            size="large"
          />
        </Card>

        <SectionHeader title="Daily Routines" />

        {/* Morning */}
        <Card style={{ position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => {}}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Morning</Text>
          <View style={styles.divider} />

          <ListRow
            title="Prayer"
            checked={morning[0]}
            onToggle={() => setMorning([!morning[0], morning[1], morning[2]])}
            onDelete={() => {}}
          />
          <ListRow
            title="Read"
            checked={morning[1]}
            onToggle={() => setMorning([morning[0], !morning[1], morning[2]])}
            rightChipText="10 min"
            onDelete={() => {}}
          />
          <ListRow
            title="Plan the day"
            checked={morning[2]}
            onToggle={() => setMorning([morning[0], morning[1], !morning[2]])}
            onDelete={() => {}}
          />
        </Card>

        {/* Tasks */}
        <Card style={{ marginTop: tokens.spacing.md, position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => {}}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Today's Tasks</Text>
          <View style={styles.divider} />

          <ListRow
            title="First deep work block"
            checked={tasks[0]}
            onToggle={() => setTasks([!tasks[0], tasks[1], tasks[2], tasks[3]])}
            rightChipText="Goal: Build YouPrjct"
            onDelete={() => {}}
          />
          <ListRow
            title="Train"
            checked={tasks[1]}
            onToggle={() => setTasks([tasks[0], !tasks[1], tasks[2], tasks[3]])}
            rightChipText="Body"
            onDelete={() => {}}
          />
          <ListRow
            title="Nutrition"
            checked={tasks[2]}
            onToggle={() => setTasks([tasks[0], tasks[1], !tasks[2], tasks[3]])}
            onDelete={() => {}}
          />
          <ListRow
            title="Reach out to 1 person"
            checked={tasks[3]}
            onToggle={() => setTasks([tasks[0], tasks[1], tasks[2], !tasks[3]])}
            onDelete={() => {}}
          />
        </Card>

        {/* Evening */}
        <Card style={{ marginTop: tokens.spacing.md, position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => {}}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Evening</Text>
          <View style={styles.divider} />

          <ListRow
            title="Reflection"
            checked={evening[0]}
            onToggle={() => setEvening([!evening[0], evening[1]])}
            onDelete={() => {}}
          />
          <ListRow
            title="Plan tomorrow"
            checked={evening[1]}
            onToggle={() => setEvening([evening[0], !evening[1]])}
            onDelete={() => {}}
          />
        </Card>

        <View style={{ height: tokens.spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: tokens.spacing.xl,
  },

  topHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: tokens.spacing.md,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: tokens.colors.text,
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
  },

  streakPill: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 78,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: tokens.colors.muted,
  },
  streakValue: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '900',
    color: tokens.colors.text,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: tokens.colors.border,
    marginHorizontal: 10,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },

  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  addBtnCorner: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
});
