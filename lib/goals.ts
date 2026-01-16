import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, GoalType, GoalColor, GoalStep } from '@/features/goals/types';

const GOALS_KEY = '@youprjct:goals';

export type { Goal, GoalType, GoalColor, GoalStep };

/**
 * Migrate legacy goals to new schema.
 * Adds default values for new fields if missing.
 */
function migrateGoal(goal: Partial<Goal> & { id: string; title: string }): Goal {
  return {
    id: goal.id,
    title: goal.title,
    outcome: goal.outcome || '',
    whys: goal.whys || [],
    steps: goal.steps || [],
    goalType: goal.goalType || 'other',
    color: goal.color || 'ocean',
    createdAt: goal.createdAt || new Date().toISOString(),
    isCompleted: goal.isCompleted || false,
    completedAt: goal.completedAt,
  };
}

export async function loadGoals(): Promise<Goal[]> {
  try {
    const raw = await AsyncStorage.getItem(GOALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Migrate any legacy goals
    return parsed.map(migrateGoal);
  } catch (error) {
    console.error('Failed to load goals:', error);
    return [];
  }
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  try {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
}

export async function addGoal(
  title: string,
  outcome: string,
  whys: string[],
  goalType: GoalType = 'other',
  color: GoalColor = 'ocean'
): Promise<Goal> {
  const goals = await loadGoals();
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    title,
    outcome,
    whys,
    steps: [],
    goalType,
    color,
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };
  goals.push(newGoal);
  await saveGoals(goals);
  return newGoal;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
  const goals = await loadGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;

  goals[index] = { ...goals[index], ...updates };
  await saveGoals(goals);
  return goals[index];
}

export async function completeGoal(id: string): Promise<Goal | null> {
  return updateGoal(id, {
    isCompleted: true,
    completedAt: new Date().toISOString(),
  });
}

export async function uncompleteGoal(id: string): Promise<Goal | null> {
  return updateGoal(id, {
    isCompleted: false,
    completedAt: undefined,
  });
}

export async function deleteGoal(id: string): Promise<void> {
  const goals = await loadGoals();
  await saveGoals(goals.filter(g => g.id !== id));
}

/**
 * Calculate days since goal was created
 */
export function getGoalAge(goal: Goal): number {
  const created = new Date(goal.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// ========== Step CRUD Functions ==========

/**
 * Add a step to a goal
 */
export async function addStep(goalId: string, title: string): Promise<Goal | null> {
  const goals = await loadGoals();
  const index = goals.findIndex(g => g.id === goalId);
  if (index === -1) return null;

  const newStep: GoalStep = {
    id: `step-${Date.now()}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  goals[index].steps.push(newStep);
  await saveGoals(goals);
  return goals[index];
}

/**
 * Toggle a step's completion status
 */
export async function toggleStep(goalId: string, stepId: string): Promise<Goal | null> {
  const goals = await loadGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) return null;

  const stepIndex = goals[goalIndex].steps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return null;

  goals[goalIndex].steps[stepIndex].completed = !goals[goalIndex].steps[stepIndex].completed;
  await saveGoals(goals);
  return goals[goalIndex];
}

/**
 * Delete a step from a goal
 */
export async function deleteStep(goalId: string, stepId: string): Promise<Goal | null> {
  const goals = await loadGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) return null;

  goals[goalIndex].steps = goals[goalIndex].steps.filter(s => s.id !== stepId);
  await saveGoals(goals);
  return goals[goalIndex];
}

/**
 * Calculate step progress for a goal
 */
export function getStepProgress(goal: Goal): { completed: number; total: number; percentage: number } {
  const total = goal.steps.length;
  const completed = goal.steps.filter(s => s.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}
