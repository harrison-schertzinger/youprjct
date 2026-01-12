import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ListRow } from '@/components/ui/ListRow';
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

  useEffect(() => {
    const loadAllData = async () => {
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
    };
    loadAllData();
  }, []);

  const appStreakDays = useMemo(() => firstOpenedAt ? daysSince(firstOpenedAt) + 1 : 1, [firstOpenedAt]);
  const selectedDate = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), selectedDay), [selectedDay]);
  const isSelectedDayWon = useMemo(() => getDayOutcome(selectedDate, wins) === 'win', [selectedDate, wins]);
  const totalDaysWon = useMemo(() => getTotalDaysWon(wins), [wins]);
  const { winsThisWeek, totalDaysThisWeek } = useMemo(() => getThisWeekStats(wins), [wins]);

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
    const newTask = await addDailyTask(title, goal?.id, goal?.name);
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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header with Streak */}
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
          <MonthGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} wins={wins} />
        </Card>

        {/* Day Won Button */}
        <Card style={{ marginTop: tokens.spacing.md, padding: tokens.spacing.sm }}>
          <PrimaryButton label={isSelectedDayWon ? '✓ Day Won' : 'I Won Today'} onPress={handleWinTheDay} />
        </Card>

        <SectionHeader title="Daily Routines" />

        {/* Morning */}
        <Card style={{ position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => setModalType('morning')}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Morning</Text>
          <View style={styles.divider} />
          {morningRoutines.length === 0 ? (
            <Text style={styles.placeholder}>Add your first morning routine...</Text>
          ) : (
            morningRoutines.map(r => (
              <ListRow key={r.id} title={r.title} checked={morningCompleted.has(r.id)} onToggle={() => handleToggleMorning(r.id)} rightChipText={r.label} onDelete={() => handleDeleteMorning(r.id)} />
            ))
          )}
        </Card>

        {/* Tasks */}
        <Card style={{ marginTop: tokens.spacing.md, position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => setModalType('task')}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Today's Tasks</Text>
          <View style={styles.divider} />
          {dailyTasks.length === 0 ? (
            <Text style={styles.placeholder}>Add a task to get started...</Text>
          ) : (
            dailyTasks.map(t => (
              <ListRow key={t.id} title={t.title} checked={t.completed} onToggle={() => handleToggleTask(t.id)} rightChipText={t.goalName} onDelete={() => handleDeleteTask(t.id)} />
            ))
          )}
        </Card>

        {/* Evening */}
        <Card style={{ marginTop: tokens.spacing.md, position: 'relative' }}>
          <Pressable style={styles.addBtnCorner} onPress={() => setModalType('evening')}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
          <Text style={styles.blockTitle}>Evening</Text>
          <View style={styles.divider} />
          {eveningRoutines.length === 0 ? (
            <Text style={styles.placeholder}>Add your first evening routine...</Text>
          ) : (
            eveningRoutines.map(r => (
              <ListRow key={r.id} title={r.title} checked={eveningCompleted.has(r.id)} onToggle={() => handleToggleEvening(r.id)} rightChipText={r.label} onDelete={() => handleDeleteEvening(r.id)} />
            ))
          )}
        </Card>

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
  topHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: tokens.spacing.md },
  headerTitle: { fontSize: 38, fontWeight: '900', color: tokens.colors.text, letterSpacing: -0.6 },
  headerSubtitle: { marginTop: 6, fontSize: 16, fontWeight: '600', color: tokens.colors.muted },
  streakPill: { borderWidth: 1, borderColor: tokens.colors.border, backgroundColor: tokens.colors.card, borderRadius: tokens.radius.pill, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', minWidth: 78 },
  streakLabel: { fontSize: 12, fontWeight: '800', color: tokens.colors.muted },
  streakValue: { marginTop: 2, fontSize: 22, fontWeight: '900', color: tokens.colors.text },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statBlock: { flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: tokens.colors.border, marginHorizontal: 10 },
  statLabel: { fontSize: 11, fontWeight: '700', color: tokens.colors.muted, marginBottom: 2, letterSpacing: 0.5 },
  statValue: { fontSize: 20, fontWeight: '900' },
  blockTitle: { fontSize: 16, fontWeight: '800', color: tokens.colors.text },
  addBtnCorner: { position: 'absolute', top: 14, right: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: tokens.radius.sm, backgroundColor: '#8B8B8B', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  addBtnText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: tokens.colors.border, marginTop: tokens.spacing.md, marginBottom: tokens.spacing.sm },
  placeholder: { fontSize: 15, fontStyle: 'italic', color: tokens.colors.muted, paddingVertical: tokens.spacing.md },
});
