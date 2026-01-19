// Workout Builder storage layer - AsyncStorage persistence

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CustomWorkout,
  ScheduledWorkout,
  WorkoutSessionLog,
  WorkoutExercise,
  WorkoutColor,
  WorkoutTemplateType,
} from './types';

// Storage keys
const WORKOUTS_KEY = '@youprjct:custom_workouts';
const SCHEDULED_KEY = '@youprjct:scheduled_workouts';
const SESSION_LOGS_KEY = '@youprjct:workout_session_logs';

// ============================================================
// Custom Workouts (Templates)
// ============================================================

export async function loadWorkouts(): Promise<CustomWorkout[]> {
  try {
    const raw = await AsyncStorage.getItem(WORKOUTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load custom workouts:', error);
    return [];
  }
}

export async function saveWorkouts(workouts: CustomWorkout[]): Promise<void> {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save custom workouts:', error);
  }
}

export async function createWorkout(
  title: string,
  templateType: WorkoutTemplateType,
  color: WorkoutColor,
  exercises: WorkoutExercise[],
  options?: {
    timeCap?: number;
    rounds?: number;
    intervalSeconds?: number;
    notes?: string;
    isTemplate?: boolean;
  }
): Promise<CustomWorkout> {
  const workouts = await loadWorkouts();

  const workout: CustomWorkout = {
    id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title,
    templateType,
    color,
    exercises,
    timeCap: options?.timeCap,
    rounds: options?.rounds,
    intervalSeconds: options?.intervalSeconds,
    notes: options?.notes,
    isTemplate: options?.isTemplate ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  workouts.push(workout);
  await saveWorkouts(workouts);
  return workout;
}

export async function updateWorkout(
  id: string,
  updates: Partial<Omit<CustomWorkout, 'id' | 'createdAt'>>
): Promise<CustomWorkout | null> {
  const workouts = await loadWorkouts();
  const index = workouts.findIndex((w) => w.id === id);

  if (index === -1) return null;

  workouts[index] = {
    ...workouts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveWorkouts(workouts);
  return workouts[index];
}

export async function deleteWorkout(id: string): Promise<void> {
  const workouts = await loadWorkouts();
  const filtered = workouts.filter((w) => w.id !== id);
  await saveWorkouts(filtered);

  // Also delete any scheduled instances
  const scheduled = await loadScheduledWorkouts();
  const filteredScheduled = scheduled.filter((s) => s.workoutId !== id);
  await saveScheduledWorkouts(filteredScheduled);
}

export async function getWorkoutById(id: string): Promise<CustomWorkout | null> {
  const workouts = await loadWorkouts();
  return workouts.find((w) => w.id === id) || null;
}

export async function getWorkoutTemplates(): Promise<CustomWorkout[]> {
  const workouts = await loadWorkouts();
  return workouts.filter((w) => w.isTemplate);
}

// ============================================================
// Scheduled Workouts
// ============================================================

export async function loadScheduledWorkouts(): Promise<ScheduledWorkout[]> {
  try {
    const raw = await AsyncStorage.getItem(SCHEDULED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load scheduled workouts:', error);
    return [];
  }
}

export async function saveScheduledWorkouts(scheduled: ScheduledWorkout[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
  } catch (error) {
    console.error('Failed to save scheduled workouts:', error);
  }
}

export async function scheduleWorkout(
  workoutId: string,
  dateISO: string,
  notes?: string
): Promise<ScheduledWorkout> {
  const scheduled = await loadScheduledWorkouts();

  const instance: ScheduledWorkout = {
    id: `scheduled-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    workoutId,
    dateISO,
    notes,
  };

  scheduled.push(instance);
  await saveScheduledWorkouts(scheduled);
  return instance;
}

export async function getScheduledForDate(dateISO: string): Promise<ScheduledWorkout[]> {
  const scheduled = await loadScheduledWorkouts();
  return scheduled.filter((s) => s.dateISO === dateISO);
}

export async function completeScheduledWorkout(
  id: string,
  duration: number
): Promise<void> {
  const scheduled = await loadScheduledWorkouts();
  const index = scheduled.findIndex((s) => s.id === id);

  if (index !== -1) {
    scheduled[index] = {
      ...scheduled[index],
      completedAt: new Date().toISOString(),
      actualDuration: duration,
    };
    await saveScheduledWorkouts(scheduled);
  }
}

export async function deleteScheduledWorkout(id: string): Promise<void> {
  const scheduled = await loadScheduledWorkouts();
  const filtered = scheduled.filter((s) => s.id !== id);
  await saveScheduledWorkouts(filtered);
}

// ============================================================
// Session Logs
// ============================================================

export async function loadSessionLogs(): Promise<WorkoutSessionLog[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load session logs:', error);
    return [];
  }
}

export async function saveSessionLog(log: WorkoutSessionLog): Promise<void> {
  try {
    const logs = await loadSessionLogs();
    logs.push(log);
    await AsyncStorage.setItem(SESSION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save session log:', error);
  }
}

// ============================================================
// Date helpers
// ============================================================

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
