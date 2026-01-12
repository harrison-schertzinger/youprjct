import AsyncStorage from '@react-native-async-storage/async-storage';

const MORNING_KEY = '@youprjct:routines:morning';
const EVENING_KEY = '@youprjct:routines:evening';

export type Routine = {
  id: string;
  title: string;
  label?: string;
  createdAt: string;
};

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCompletionKey(type: 'morning' | 'evening'): string {
  return `@youprjct:routines:${type}:completed:${getTodayKey()}`;
}

// Morning Routines
export async function loadMorningRoutines(): Promise<Routine[]> {
  try {
    const raw = await AsyncStorage.getItem(MORNING_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load morning routines:', error);
    return [];
  }
}

export async function addMorningRoutine(title: string, label?: string): Promise<Routine> {
  const routines = await loadMorningRoutines();
  const newRoutine: Routine = {
    id: `morning-${Date.now()}`,
    title,
    label,
    createdAt: new Date().toISOString(),
  };
  routines.push(newRoutine);
  await AsyncStorage.setItem(MORNING_KEY, JSON.stringify(routines));
  return newRoutine;
}

export async function deleteMorningRoutine(id: string): Promise<void> {
  const routines = await loadMorningRoutines();
  await AsyncStorage.setItem(MORNING_KEY, JSON.stringify(routines.filter(r => r.id !== id)));
}

// Evening Routines
export async function loadEveningRoutines(): Promise<Routine[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENING_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load evening routines:', error);
    return [];
  }
}

export async function addEveningRoutine(title: string, label?: string): Promise<Routine> {
  const routines = await loadEveningRoutines();
  const newRoutine: Routine = {
    id: `evening-${Date.now()}`,
    title,
    label,
    createdAt: new Date().toISOString(),
  };
  routines.push(newRoutine);
  await AsyncStorage.setItem(EVENING_KEY, JSON.stringify(routines));
  return newRoutine;
}

export async function deleteEveningRoutine(id: string): Promise<void> {
  const routines = await loadEveningRoutines();
  await AsyncStorage.setItem(EVENING_KEY, JSON.stringify(routines.filter(r => r.id !== id)));
}

// Daily Completion Tracking
export async function loadCompletedRoutines(type: 'morning' | 'evening'): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(getCompletionKey(type));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch (error) {
    console.error(`Failed to load ${type} completion status:`, error);
    return new Set();
  }
}

export async function toggleRoutineCompletion(type: 'morning' | 'evening', routineId: string): Promise<Set<string>> {
  const completed = await loadCompletedRoutines(type);
  if (completed.has(routineId)) {
    completed.delete(routineId);
  } else {
    completed.add(routineId);
  }
  await AsyncStorage.setItem(getCompletionKey(type), JSON.stringify([...completed]));
  return completed;
}
