import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { tokens } from '@/design/tokens';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import type { Profile } from '@/lib/training/types';
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

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

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
      // Load profile data
      Promise.all([getProfile(), getSupabaseProfile()])
        .then(([localProfile, sbProfile]) => {
          setProfile(localProfile);
          setSupabaseProfile(sbProfile);
        })
        .catch((error) => {
          console.error('Failed to load profile:', error);
        });
    }, [loadData])
  );

  // Derived profile values
  const displayName = supabaseProfile?.display_name ?? profile?.displayName ?? 'Athlete';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const streakCount = profile?.onAppStreakDays ?? 0;

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
          contentInsetAdjustmentBehavior="never"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tokens.colors.muted}
            />
          }
        >
          {/* Unified Header: Profile + KPI Bar + Add Button */}
          <View style={styles.headerRow}>
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.profileContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>🔥{streakCount}</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <View style={styles.kpiBar}>
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>ACTIVE</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.action }]}>{activeGoalsCount}</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>COMPLETED</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.tint }]}>{completedGoalsCount}</Text>
              </View>
            </View>
            <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

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

  // Unified Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
    marginHorizontal: 8,
    gap: tokens.spacing.sm,
  },
  profileContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: tokens.colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    minWidth: 28,
    alignItems: 'center',
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  kpiBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingVertical: tokens.spacing.xs + 2,
    paddingHorizontal: tokens.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiBlock: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.xs,
  },
  // Add button scaled to match KPI bar height
  addButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
