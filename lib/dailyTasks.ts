import { getItem, setItem } from './storage';
import type { GoalColor } from '@/features/goals/types';

export type DailyTask = {
  id: string;
  title: string;
  goalId?: string;
  goalName?: string;
  goalColor?: GoalColor;
  completed: boolean;
  createdAt: string;
};

/**
 * Get date key for a specific day offset from today.
 * @param dayOffset - 0 for today, -1 for yesterday, 1 for tomorrow
 */
function getDateKey(dayOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getTasksKey(dayOffset: number = 0): string {
  return `@youprjct:dailyTasks:${getDateKey(dayOffset)}`;
}

/**
 * Load tasks for a specific day.
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function loadDailyTasks(dayOffset: number = 0): Promise<DailyTask[]> {
  const tasks = await getItem<DailyTask[]>(getTasksKey(dayOffset));
  return tasks || [];
}

/**
 * Add a task to a specific day.
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function addDailyTask(
  title: string,
  goalId?: string,
  goalName?: string,
  goalColor?: GoalColor,
  dayOffset: number = 0
): Promise<DailyTask> {
  const tasks = await loadDailyTasks(dayOffset);
  const newTask: DailyTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title,
    goalId,
    goalName,
    goalColor,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await setItem(getTasksKey(dayOffset), tasks);
  return newTask;
}

/**
 * Delete a task from a specific day.
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function deleteDailyTask(id: string, dayOffset: number = 0): Promise<void> {
  const tasks = await loadDailyTasks(dayOffset);
  await setItem(getTasksKey(dayOffset), tasks.filter(t => t.id !== id));
}

/**
 * Toggle task completion for a specific day.
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function toggleDailyTaskCompletion(id: string, dayOffset: number = 0): Promise<DailyTask[]> {
  const tasks = await loadDailyTasks(dayOffset);
  const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  await setItem(getTasksKey(dayOffset), updated);
  return updated;
}
