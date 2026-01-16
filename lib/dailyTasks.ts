import { getItem, setItem } from './storage';

export type DailyTask = {
  id: string;
  title: string;
  goalId?: string;
  goalName?: string;
  completed: boolean;
  createdAt: string;
};

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getTasksKey(): string {
  return `@youprjct:dailyTasks:${getTodayKey()}`;
}

export async function loadDailyTasks(): Promise<DailyTask[]> {
  const tasks = await getItem<DailyTask[]>(getTasksKey());
  return tasks || [];
}

export async function addDailyTask(title: string, goalId?: string, goalName?: string): Promise<DailyTask> {
  const tasks = await loadDailyTasks();
  const newTask: DailyTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title,
    goalId,
    goalName,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await setItem(getTasksKey(), tasks);
  return newTask;
}

export async function deleteDailyTask(id: string): Promise<void> {
  const tasks = await loadDailyTasks();
  await setItem(getTasksKey(), tasks.filter(t => t.id !== id));
}

export async function toggleDailyTaskCompletion(id: string): Promise<DailyTask[]> {
  const tasks = await loadDailyTasks();
  const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  await setItem(getTasksKey(), updated);
  return updated;
}
