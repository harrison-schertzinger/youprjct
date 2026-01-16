import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { KPIBar, type KPIStat } from '@/components/ui/KPIBar';
import { PageLabel } from '@/components/ui/PageLabel';
import { tokens } from '@/design/tokens';
import { GoalsList, AddGoalModal, EditGoalModal } from '@/features/goals';
import {
  Goal,
  GoalType,
  GoalColor,
  loadGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  uncompleteGoal,
  addStep,
  toggleStep,
  deleteStep,
} from '@/lib/goals';
import { loadDailyTasks, DailyTask } from '@/lib/dailyTasks';

const GOALS_BENEFITS = [
  {
    title: 'Goal Setting',
    description: 'Define clear objectives with categorization for work, health, learning, and more.',
  },
  {
    title: 'Daily Task Linking',
    description: 'Connect daily tasks to larger goals and track progress automatically.',
  },
  {
    title: 'Progress Tracking',
    description: 'See how your daily actions compound toward meaningful outcomes.',
  },
];

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [goalsData, tasksData] = await Promise.all([
      loadGoals(),
      loadDailyTasks(),
    ]);
    setGoals(goalsData);
    setDailyTasks(tasksData);
  }, []);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Calculate task counts per goal
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dailyTasks.forEach((task) => {
      if (task.goalId && task.completed) {
        counts[task.goalId] = (counts[task.goalId] || 0) + 1;
      }
    });
    return counts;
  }, [dailyTasks]);

  const handleAddGoal = useCallback(
    async (
      title: string,
      outcome: string,
      whys: string[],
      goalType: GoalType,
      color: GoalColor
    ) => {
      const newGoal = await addGoal(title, outcome, whys, goalType, color);
      setGoals((prev) => [...prev, newGoal]);
    },
    []
  );

  const handleDeleteGoal = useCallback(async (id: string) => {
    await deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleCompleteGoal = useCallback(async (id: string) => {
    const updated = await completeGoal(id);
    if (updated) {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? updated : g))
      );
    }
  }, []);

  const handleUncompleteGoal = useCallback(async (id: string) => {
    const updated = await uncompleteGoal(id);
    if (updated) {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? updated : g))
      );
    }
  }, []);

  const handleEditGoal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  }, []);

  const handleUpdateGoal = useCallback(
    async (
      id: string,
      updates: { title: string; outcome: string; whys: string[]; color: GoalColor }
    ) => {
      const updated = await updateGoal(id, updates);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      }
      setShowEditModal(false);
      setEditingGoal(null);
    },
    []
  );

  const handleAddStep = useCallback(async (goalId: string, title: string) => {
    const updated = await addStep(goalId, title);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    }
  }, []);

  const handleToggleStep = useCallback(async (goalId: string, stepId: string) => {
    const updated = await toggleStep(goalId, stepId);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    }
  }, []);

  const handleDeleteStep = useCallback(async (goalId: string, stepId: string) => {
    const updated = await deleteStep(goalId, stepId);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    }
  }, []);

  // Count goals for KPIs
  const activeGoalsCount = goals.filter((g) => !g.isCompleted).length;
  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;
  const tasksCompletedThisWeek = dailyTasks.filter((t) => t.completed).length;

  // Calculate KPI stats
  const kpiStats = useMemo((): [KPIStat, KPIStat, KPIStat] => {
    return [
      { label: 'ACTIVE', value: activeGoalsCount, color: tokens.colors.action },
      { label: 'COMPLETED', value: completedGoalsCount, color: tokens.colors.tint },
      { label: 'THIS WEEK', value: tasksCompletedThisWeek },
    ];
  }, [activeGoalsCount, completedGoalsCount, tasksCompletedThisWeek]);

  return (
    <PremiumGate
      feature="Goals"
      tagline="What you're aiming at"
      benefits={GOALS_BENEFITS}
    >
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
          <PageLabel
            label="GOALS"
            action={goals.length > 0 ? { icon: '+', onPress: () => setShowAddModal(true) } : undefined}
          />
          <KPIBar stats={kpiStats} />

          {/* Goals List */}
          <GoalsList
            goals={goals}
            taskCounts={taskCounts}
            onAddGoal={() => setShowAddModal(true)}
            onDeleteGoal={handleDeleteGoal}
            onCompleteGoal={handleCompleteGoal}
            onUncompleteGoal={handleUncompleteGoal}
            onEditGoal={handleEditGoal}
            onAddStep={handleAddStep}
            onToggleStep={handleToggleStep}
            onDeleteStep={handleDeleteStep}
          />

          <View style={{ height: tokens.spacing.xl }} />
        </ScrollView>

        {/* Add Goal Modal */}
        <AddGoalModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGoal}
        />

        {/* Edit Goal Modal */}
        <EditGoalModal
          visible={showEditModal}
          goal={editingGoal}
          onClose={() => {
            setShowEditModal(false);
            setEditingGoal(null);
          }}
          onSubmit={handleUpdateGoal}
        />
      </ScreenContainer>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: tokens.spacing.xl,
  },
});
