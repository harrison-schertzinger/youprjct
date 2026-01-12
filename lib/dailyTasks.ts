import AsyncStorage from '@react-native-async-storage/async-storage';

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
  try {
    const raw = await AsyncStorage.getItem(getTasksKey());
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load daily tasks:', error);
    return [];
  }
}

export async function addDailyTask(title: string, goalId?: string, goalName?: string): Promise<DailyTask> {
  const tasks = await loadDailyTasks();
  const newTask: DailyTask = {
    id: `task-${Date.now()}`,
    title,
    goalId,
    goalName,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await AsyncStorage.setItem(getTasksKey(), JSON.stringify(tasks));
  return newTask;
}

export async function deleteDailyTask(id: string): Promise<void> {
  const tasks = await loadDailyTasks();
  await AsyncStorage.setItem(getTasksKey(), JSON.stringify(tasks.filter(t => t.id !== id)));
}

export async function toggleDailyTaskCompletion(id: string): Promise<DailyTask[]> {
  const tasks = await loadDailyTasks();
  const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  await AsyncStorage.setItem(getTasksKey(), JSON.stringify(updated));
  return updated;
}
