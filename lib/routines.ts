import { getItem, setItem } from './storage';

const MORNING_KEY = '@youprjct:routines:morning';
const EVENING_KEY = '@youprjct:routines:evening';

export type Routine = {
  id: string;
  title: string;
  label?: string;
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

/**
 * Get storage key for routine completions on a specific day.
 * @param type - 'morning' or 'evening'
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
function getCompletionKey(type: 'morning' | 'evening', dayOffset: number = 0): string {
  return `@youprjct:routines:${type}:completed:${getDateKey(dayOffset)}`;
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

/**
 * Load completed routine IDs for a specific day.
 * @param type - 'morning' or 'evening'
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function loadCompletedRoutines(
  type: 'morning' | 'evening',
  dayOffset: number = 0
): Promise<Set<string>> {
  const completed = await getItem<string[]>(getCompletionKey(type, dayOffset));
  return new Set(completed || []);
}

/**
 * Toggle routine completion for a specific day.
 * @param type - 'morning' or 'evening'
 * @param routineId - The routine ID to toggle
 * @param dayOffset - 0 for today (default), -1 for yesterday, 1 for tomorrow
 */
export async function toggleRoutineCompletion(
  type: 'morning' | 'evening',
  routineId: string,
  dayOffset: number = 0
): Promise<Set<string>> {
  const completed = await loadCompletedRoutines(type, dayOffset);
  if (completed.has(routineId)) {
    completed.delete(routineId);
  } else {
    completed.add(routineId);
  }
  await setItem(getCompletionKey(type, dayOffset), [...completed]);
  return completed;
}
