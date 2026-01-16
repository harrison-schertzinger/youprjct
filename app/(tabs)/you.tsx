import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RoutineListItem } from '@/components/ui/RoutineListItem';
import { DayWonButton } from '@/components/ui/DayWonButton';
import { DayPicker } from '@/components/ui/DayPicker';
import { AddItemModal } from '@/components/ui/AddItemModal';
import { tokens } from '@/design/tokens';
import { MonthGrid } from '@/components/dashboard/MonthGrid';
import { WeekBattery } from '@/components/ui/WeekBattery';
import { loadWins, markDayAsWin, getTotalDaysWon, getThisWeekStats, getDayOutcome } from '@/lib/dailyOutcomes';
import { getOrSetFirstOpenedAt, daysSince } from '@/lib/appStreak';
import { Routine, loadMorningRoutines, addMorningRoutine, deleteMorningRoutine, loadEveningRoutines, addEveningRoutine, deleteEveningRoutine, loadCompletedRoutines, toggleRoutineCompletion } from '@/lib/routines';
import { DailyTask, loadDailyTasks, addDailyTask, deleteDailyTask, toggleDailyTaskCompletion } from '@/lib/dailyTasks';
import { Goal, loadGoals } from '@/lib/goals';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import type { Profile } from '@/lib/training/types';
import { TimeInvestmentChart, ConsistencyChart } from '@/components/charts';

type ModalType = 'morning' | 'evening' | 'task' | null;

export default function YouScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [wins, setWins] = useState<Record<string, 'win'>>({});
  const [firstOpenedAt, setFirstOpenedAt] = useState<string | null>(null);

  const [morningRoutines, setMorningRoutines] = useState<Routine[]>([]);
  const [eveningRoutines, setEveningRoutines] = useState<Routine[]>([]);
  const [morningCompleted, setMorningCompleted] = useState<Set<string>>(new Set());
  const [eveningCompleted, setEveningCompleted] = useState<Set<string>>(new Set());

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [taskDayOffset, setTaskDayOffset] = useState(0); // 0 = today, 1 = tomorrow, etc.

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const loadAllData = useCallback(async () => {
    const [winsData, firstOpened] = await Promise.all([loadWins(), getOrSetFirstOpenedAt()]);
    setWins(winsData);
    setFirstOpenedAt(firstOpened);

    const [morning, evening, morningDone, eveningDone] = await Promise.all([
      loadMorningRoutines(), loadEveningRoutines(), loadCompletedRoutines('morning'), loadCompletedRoutines('evening')
    ]);
    setMorningRoutines(morning);
    setEveningRoutines(evening);
    setMorningCompleted(morningDone);
    setEveningCompleted(eveningDone);

    const [tasks, goalsData] = await Promise.all([loadDailyTasks(), loadGoals()]);
    setDailyTasks(tasks);
    setGoals(goalsData);

    // Load profile data
    const [localProfile, sbProfile] = await Promise.all([
      getProfile(),
      getSupabaseProfile(),
    ]);
    setProfile(localProfile);
    setSupabaseProfile(sbProfile);
  }, []);

  // Reload data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [loadAllData])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const appStreakDays = useMemo(() => firstOpenedAt ? daysSince(firstOpenedAt) + 1 : 1, [firstOpenedAt]);
  const selectedDate = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), selectedDay), [selectedDay]);
  const isSelectedDayWon = useMemo(() => getDayOutcome(selectedDate, wins) === 'win', [selectedDate, wins]);
  const totalDaysWon = useMemo(() => getTotalDaysWon(wins), [wins]);
  const { winsThisWeek, totalDaysThisWeek } = useMemo(() => getThisWeekStats(wins), [wins]);

  // Derived profile values
  const displayName = supabaseProfile?.display_name ?? profile?.displayName ?? 'Athlete';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const streakCount = profile?.onAppStreakDays ?? 0;

  const handleWinTheDay = async () => {
    await markDayAsWin(selectedDate);
    setWins(await loadWins());
  };

  const handleAddMorning = useCallback(async (title: string, label?: string) => {
    const newRoutine = await addMorningRoutine(title, label);
    setMorningRoutines(prev => [...prev, newRoutine]);
  }, []);

  const handleDeleteMorning = useCallback(async (id: string) => {
    await deleteMorningRoutine(id);
    setMorningRoutines(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleToggleMorning = useCallback(async (id: string) => {
    setMorningCompleted(await toggleRoutineCompletion('morning', id));
  }, []);

  const handleAddEvening = useCallback(async (title: string, label?: string) => {
    const newRoutine = await addEveningRoutine(title, label);
    setEveningRoutines(prev => [...prev, newRoutine]);
  }, []);

  const handleDeleteEvening = useCallback(async (id: string) => {
    await deleteEveningRoutine(id);
    setEveningRoutines(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleToggleEvening = useCallback(async (id: string) => {
    setEveningCompleted(await toggleRoutineCompletion('evening', id));
  }, []);

  const handleAddTask = useCallback(async (title: string, _label?: string, goal?: Goal) => {
    const newTask = await addDailyTask(title, goal?.id, goal?.title);
    setDailyTasks(prev => [...prev, newTask]);
  }, []);

  const handleDeleteTask = useCallback(async (id: string) => {
    await deleteDailyTask(id);
    setDailyTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleToggleTask = useCallback(async (id: string) => {
    setDailyTasks(await toggleDailyTaskCompletion(id));
  }, []);

  const handleModalSubmit = useCallback((title: string, label?: string, goal?: Goal) => {
    if (modalType === 'morning') handleAddMorning(title, label);
    else if (modalType === 'evening') handleAddEvening(title, label);
    else if (modalType === 'task') handleAddTask(title, label, goal);
  }, [modalType, handleAddMorning, handleAddEvening, handleAddTask]);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tokens.colors.muted}
          />
        }
      >
        {/* Header: Brand + Profile Avatar with Streak */}
        <View style={styles.topHeader}>
          <Text style={styles.brandText}>PERSONAL EXCELLENCE PROJECT</Text>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.avatarContainer}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakBadgeText}>🔥{streakCount}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Stats Bar */}
        <Card style={{ paddingVertical: tokens.spacing.sm }}>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>DAYS WON</Text>
              <Text style={[styles.statValue, { color: tokens.colors.action }]}>{totalDaysWon}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>CONSISTENCY</Text>
              <Text style={[styles.statValue, { color: tokens.colors.tint }]}>82%</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>THIS WEEK</Text>
              <WeekBattery wins={winsThisWeek} total={totalDaysThisWeek} />
            </View>
          </View>
        </Card>

        {/* Calendar */}
        <Card style={{ marginTop: tokens.spacing.md }}>
          <MonthGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} wins={wins} firstOpenedAt={firstOpenedAt} />
        </Card>

        {/* Day Won Button */}
        <View style={styles.dayWonContainer}>
          <DayWonButton isWon={isSelectedDayWon} onPress={handleWinTheDay} />
        </View>

        <SectionHeader title="Daily Tasks" />
        <DayPicker
          selectedOffset={taskDayOffset}
          maxOffset={3}
          onSelectOffset={setTaskDayOffset}
        />

        {/* Morning */}
        <GlowCard
          glow="amber"
          title="Morning"
          completedCount={morningRoutines.filter(r => morningCompleted.has(r.id)).length}
          totalCount={morningRoutines.length}
          onAdd={() => setModalType('morning')}
        >
          {morningRoutines.length === 0 ? (
            <Text style={styles.emptyText}>Add your first routine</Text>
          ) : (
            morningRoutines.map((r, index) => (
              <View key={r.id} style={index === morningRoutines.length - 1 ? styles.lastItem : undefined}>
                <RoutineListItem
                  title={r.title}
                  checked={morningCompleted.has(r.id)}
                  onToggle={() => handleToggleMorning(r.id)}
                  chipText={r.label}
                  onDelete={() => handleDeleteMorning(r.id)}
                />
              </View>
            ))
          )}
        </GlowCard>

        {/* Tasks */}
        <GlowCard
          glow="blue"
          title={taskDayOffset === 0 ? "Today's Tasks" : "Tasks"}
          completedCount={dailyTasks.filter(t => t.completed).length}
          totalCount={dailyTasks.length}
          onAdd={() => setModalType('task')}
          style={{ marginTop: tokens.spacing.md }}
        >
          {dailyTasks.length === 0 ? (
            <Text style={styles.emptyText}>Add a task to get started</Text>
          ) : (
            dailyTasks.map((t, index) => (
              <View key={t.id} style={index === dailyTasks.length - 1 ? styles.lastItem : undefined}>
                <RoutineListItem
                  title={t.title}
                  checked={t.completed}
                  onToggle={() => handleToggleTask(t.id)}
                  chipText={t.goalName}
                  onDelete={() => handleDeleteTask(t.id)}
                />
              </View>
            ))
          )}
        </GlowCard>

        {/* Evening */}
        <GlowCard
          glow="indigo"
          title="Evening"
          completedCount={eveningRoutines.filter(r => eveningCompleted.has(r.id)).length}
          totalCount={eveningRoutines.length}
          onAdd={() => setModalType('evening')}
          style={{ marginTop: tokens.spacing.md }}
        >
          {eveningRoutines.length === 0 ? (
            <Text style={styles.emptyText}>Add your first routine</Text>
          ) : (
            eveningRoutines.map((r, index) => (
              <View key={r.id} style={index === eveningRoutines.length - 1 ? styles.lastItem : undefined}>
                <RoutineListItem
                  title={r.title}
                  checked={eveningCompleted.has(r.id)}
                  onToggle={() => handleToggleEvening(r.id)}
                  chipText={r.label}
                  onDelete={() => handleDeleteEvening(r.id)}
                />
              </View>
            ))
          )}
        </GlowCard>

        {/* Personal Mastery Dashboard */}
        <SectionHeader title="Personal Mastery Dashboard" />

        {/* Charts */}
        <TimeInvestmentChart />
        <View style={{ height: tokens.spacing.md }} />
        <ConsistencyChart />

        <View style={{ height: tokens.spacing.xl }} />
      </ScrollView>

      <AddItemModal visible={modalType === 'morning'} onClose={() => setModalType(null)} onSubmit={handleModalSubmit} title="Add Morning Routine" placeholder="e.g., Meditation, Exercise..." showLabelInput labelPlaceholder="Duration or note (optional)" />
      <AddItemModal visible={modalType === 'evening'} onClose={() => setModalType(null)} onSubmit={handleModalSubmit} title="Add Evening Routine" placeholder="e.g., Journal, Read..." showLabelInput labelPlaceholder="Duration or note (optional)" />
      <AddItemModal visible={modalType === 'task'} onClose={() => setModalType(null)} onSubmit={handleModalSubmit} title="Add Task" placeholder="e.g., Complete project..." goals={goals} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: tokens.spacing.xl },
  dayWonContainer: {
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.sm,
  },

  // Header
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    paddingLeft: tokens.spacing.md,
  },
  brandText: {
    fontSize: 15,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 1.2,
    flex: 1,
    marginLeft: -2,
    marginTop: 1,
  },
  avatarContainer: {
    position: 'relative',
    paddingTop: 6,
    paddingLeft: 20,
  },
  streakBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    zIndex: 1,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: tokens.colors.card,
    fontSize: 15,
    fontWeight: '700',
  },

  // Stats
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statBlock: { flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: tokens.colors.border, marginHorizontal: 10 },
  statLabel: { fontSize: 11, fontWeight: '700', color: tokens.colors.muted, marginBottom: 2, letterSpacing: 0.5 },
  statValue: { fontSize: 20, fontWeight: '900' },

  // Cards
  emptyText: { fontSize: 14, color: tokens.colors.muted, paddingVertical: tokens.spacing.sm },
  lastItem: { borderBottomWidth: 0 },
});
