import AsyncStorage from '@react-native-async-storage/async-storage';

export type DailyTask = {
  id: string;
  title: string;
  goalId?: string;    // linked goal ID
  goalName?: string;  // cached goal name for display
  completed: boolean;
  createdAt: string;
};

// Get today's date key
function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getTasksKey(): string {
  return `@youprjct:dailyTasks:${getTodayKey()}`;
}

export async function loadDailyTasks(): Promise<DailyTask[]> {
  const key = getTasksKey();
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function saveDailyTasks(tasks: DailyTask[]): Promise<void> {
  const key = getTasksKey();
  await AsyncStorage.setItem(key, JSON.stringify(tasks));
}

export async function addDailyTask(
  title: string,
  goalId?: string,
  goalName?: string
): Promise<DailyTask> {
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
  await saveDailyTasks(tasks);
  return newTask;
}

export async function deleteDailyTask(id: string): Promise<void> {
  const tasks = await loadDailyTasks();
  await saveDailyTasks(tasks.filter(t => t.id !== id));
}

export async function toggleDailyTaskCompletion(id: string): Promise<DailyTask[]> {
  const tasks = await loadDailyTasks();
  const updated = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  await saveDailyTasks(updated);
  return updated;
}
