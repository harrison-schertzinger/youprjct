import { getItem, setItem } from './storage';

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
  const routines = await getItem<Routine[]>(MORNING_KEY);
  return routines || [];
}

export async function addMorningRoutine(title: string, label?: string): Promise<Routine> {
  const routines = await loadMorningRoutines();
  const newRoutine: Routine = {
    id: `morning-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title,
    label,
    createdAt: new Date().toISOString(),
  };
  routines.push(newRoutine);
  await setItem(MORNING_KEY, routines);
  return newRoutine;
}

export async function deleteMorningRoutine(id: string): Promise<void> {
  const routines = await loadMorningRoutines();
  await setItem(MORNING_KEY, routines.filter(r => r.id !== id));
}

// Evening Routines
export async function loadEveningRoutines(): Promise<Routine[]> {
  const routines = await getItem<Routine[]>(EVENING_KEY);
  return routines || [];
}

export async function addEveningRoutine(title: string, label?: string): Promise<Routine> {
  const routines = await loadEveningRoutines();
  const newRoutine: Routine = {
    id: `evening-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title,
    label,
    createdAt: new Date().toISOString(),
  };
  routines.push(newRoutine);
  await setItem(EVENING_KEY, routines);
  return newRoutine;
}

export async function deleteEveningRoutine(id: string): Promise<void> {
  const routines = await loadEveningRoutines();
  await setItem(EVENING_KEY, routines.filter(r => r.id !== id));
}

// Daily Completion Tracking
export async function loadCompletedRoutines(type: 'morning' | 'evening'): Promise<Set<string>> {
  const completed = await getItem<string[]>(getCompletionKey(type));
  return new Set(completed || []);
}

export async function toggleRoutineCompletion(type: 'morning' | 'evening', routineId: string): Promise<Set<string>> {
  const completed = await loadCompletedRoutines(type);
  if (completed.has(routineId)) {
    completed.delete(routineId);
  } else {
    completed.add(routineId);
  }
  await setItem(getCompletionKey(type), [...completed]);
  return completed;
}
