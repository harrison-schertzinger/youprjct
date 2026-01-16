import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { AccentCard } from '@/components/ui/AccentCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RoutineTileHeader } from '@/components/ui/RoutineTileHeader';
import { RoutineListItem } from '@/components/ui/RoutineListItem';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AddItemModal } from '@/components/ui/AddItemModal';
import { tokens } from '@/design/tokens';
import { MonthGrid } from '@/components/dashboard/MonthGrid';
import { WeekBattery } from '@/components/ui/WeekBattery';
import { loadWins, markDayAsWin, getTotalDaysWon, getThisWeekStats, getDayOutcome } from '@/lib/dailyOutcomes';
import { getOrSetFirstOpenedAt, daysSince } from '@/lib/appStreak';
import { Routine, loadMorningRoutines, addMorningRoutine, deleteMorningRoutine, loadEveningRoutines, addEveningRoutine, deleteEveningRoutine, loadCompletedRoutines, toggleRoutineCompletion } from '@/lib/routines';
import { DailyTask, loadDailyTasks, addDailyTask, deleteDailyTask, toggleDailyTaskCompletion } from '@/lib/dailyTasks';
import { Goal, loadGoals } from '@/lib/goals';
import { getTotalsByTypeForDate, getTotalsByTypeForWeek } from '@/lib/repositories/ActivityRepo';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import type { Profile } from '@/lib/training/types';
import { TimeInvestmentChart, ConsistencyChart } from '@/components/charts';

type ModalType = 'morning' | 'evening' | 'task' | null;

// ========== Helper Functions ==========

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekStartISO(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday is week start
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

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

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

  // Personal Mastery Dashboard state
  const [readingToday, setReadingToday] = useState(0);
  const [readingWeek, setReadingWeek] = useState(0);
  const [trainingToday, setTrainingToday] = useState(0);
  const [trainingWeek, setTrainingWeek] = useState(0);
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

    const todayISO = getTodayISO();
    const weekStartISO = getWeekStartISO();

    const [rToday, rWeek, tToday, tWeek] = await Promise.all([
      getTotalsByTypeForDate('reading', todayISO),
      getTotalsByTypeForWeek('reading', weekStartISO),
      getTotalsByTypeForDate('workout', todayISO),
      getTotalsByTypeForWeek('workout', weekStartISO),
    ]);

    setReadingToday(rToday);
    setReadingWeek(rWeek);
    setTrainingToday(tToday);
    setTrainingWeek(tWeek);
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
        <Card style={{ marginTop: tokens.spacing.md, padding: tokens.spacing.sm }}>
          <PrimaryButton label={isSelectedDayWon ? '✓ Day Won' : 'I Won Today'} onPress={handleWinTheDay} />
        </Card>

        <SectionHeader title="Daily Routines" />

        {/* Morning */}
        <AccentCard
          accent="amber"
          header={
            <RoutineTileHeader
              icon="☀️"
              title="Morning"
              completedCount={morningRoutines.filter(r => morningCompleted.has(r.id)).length}
              totalCount={morningRoutines.length}
              onAdd={() => setModalType('morning')}
            />
          }
        >
          {morningRoutines.length === 0 ? (
            <Text style={styles.placeholder}>Add your first morning routine...</Text>
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
        </AccentCard>

        {/* Tasks */}
        <AccentCard
          accent="blue"
          style={{ marginTop: tokens.spacing.md }}
          header={
            <RoutineTileHeader
              icon="🎯"
              title="Today's Tasks"
              completedCount={dailyTasks.filter(t => t.completed).length}
              totalCount={dailyTasks.length}
              onAdd={() => setModalType('task')}
            />
          }
        >
          {dailyTasks.length === 0 ? (
            <Text style={styles.placeholder}>Add a task to get started...</Text>
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
        </AccentCard>

        {/* Evening */}
        <AccentCard
          accent="indigo"
          style={{ marginTop: tokens.spacing.md }}
          header={
            <RoutineTileHeader
              icon="🌙"
              title="Evening"
              completedCount={eveningRoutines.filter(r => eveningCompleted.has(r.id)).length}
              totalCount={eveningRoutines.length}
              onAdd={() => setModalType('evening')}
            />
          }
        >
          {eveningRoutines.length === 0 ? (
            <Text style={styles.placeholder}>Add your first evening routine...</Text>
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
        </AccentCard>

        {/* Personal Mastery Dashboard */}
        <SectionHeader title="Personal Mastery Dashboard" />

        {/* Charts */}
        <TimeInvestmentChart />
        <View style={{ height: tokens.spacing.md }} />
        <ConsistencyChart />
        <View style={{ height: tokens.spacing.md }} />

        {/* TIME Group */}
        <View style={styles.dashboardGroup}>
          <Text style={styles.groupLabel}>TIME</Text>
          <View style={styles.tileRow}>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>READING</Text>
              <Text style={styles.tileValue}>{formatDuration(readingToday)}</Text>
              <Text style={styles.tileSecondary}>{formatDuration(readingWeek)} ↗</Text>
            </View>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>TRAINING</Text>
              <Text style={styles.tileValue}>{formatDuration(trainingToday)}</Text>
              <Text style={styles.tileSecondary}>{formatDuration(trainingWeek)} ↗</Text>
            </View>
          </View>
        </View>

        {/* TRACKING Group */}
        <View style={styles.dashboardGroup}>
          <Text style={styles.groupLabel}>TRACKING</Text>
          <View style={styles.tileRow}>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>DISCIPLINE</Text>
              <Text style={styles.tileValue}>—</Text>
              <Text style={styles.tileSecondary}> </Text>
            </View>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>GOALS</Text>
              <Text style={styles.tileValue}>{goals.length}</Text>
              <Text style={styles.tileSecondary}>active</Text>
            </View>
          </View>
        </View>

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
  placeholder: { fontSize: 15, fontStyle: 'italic', color: tokens.colors.muted, paddingVertical: tokens.spacing.md },
  lastItem: { borderBottomWidth: 0 },

  // Personal Mastery Dashboard
  dashboardGroup: { marginBottom: tokens.spacing.md },
  groupLabel: { fontSize: 12, fontWeight: '700', color: tokens.colors.muted, marginBottom: tokens.spacing.sm, letterSpacing: 0.5 },
  tileRow: { flexDirection: 'row', gap: tokens.spacing.sm },
  tile: { flex: 1, backgroundColor: tokens.colors.card, borderRadius: tokens.radius.md, borderWidth: 1, borderColor: tokens.colors.border, padding: tokens.spacing.md, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  tileLabel: { fontSize: 10, fontWeight: '700', color: tokens.colors.muted, marginBottom: 8, letterSpacing: 0.5 },
  tileValue: { fontSize: 24, fontWeight: '900', color: tokens.colors.text, marginBottom: 4 },
  tileSecondary: { fontSize: 13, fontWeight: '600', color: tokens.colors.muted, minHeight: 18 },
});
