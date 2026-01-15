import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { tokens } from '@/design/tokens';
import { GoalsList, AddGoalModal } from '@/features/goals';
import { Goal, GoalType, loadGoals, addGoal, deleteGoal } from '@/lib/goals';
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

  const handleAddGoal = useCallback(async (title: string, goalType: GoalType) => {
    const newGoal = await addGoal(title, goalType);
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const handleDeleteGoal = useCallback(async (id: string) => {
    await deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Goals</Text>
              <Text style={styles.headerSubtitle}>What you're aiming at</Text>
            </View>
            {goals.length > 0 && (
              <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                <Text style={styles.addBtnText}>+</Text>
              </Pressable>
            )}
          </View>

          {/* Goals List */}
          <GoalsList
            goals={goals}
            taskCounts={taskCounts}
            onAddGoal={() => setShowAddModal(true)}
            onDeleteGoal={handleDeleteGoal}
          />

          <View style={{ height: tokens.spacing.xl }} />
        </ScrollView>

        {/* Add Goal Modal */}
        <AddGoalModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGoal}
        />
      </ScreenContainer>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.lg,
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
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: '#8B8B8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
