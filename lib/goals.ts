import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS_KEY = '@youprjct:goals';

export type Goal = {
  id: string;
  name: string;
  createdAt: string;
};

export async function loadGoals(): Promise<Goal[]> {
  const raw = await AsyncStorage.getItem(GOALS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export async function addGoal(name: string): Promise<Goal> {
  const goals = await loadGoals();
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  await saveGoals(goals);
  return newGoal;
}

export async function deleteGoal(id: string): Promise<void> {
  const goals = await loadGoals();
  const filtered = goals.filter(g => g.id !== id);
  await saveGoals(filtered);
}
