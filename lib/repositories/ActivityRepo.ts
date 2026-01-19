// ActivityRepo: Manages time-tracked activity sessions (reading, workouts)

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import { formatDateKey } from '@/utils/calendar';
import type { ActivitySession, ActivityType } from '../training/types';

const LOCAL_USER_ID = 'local-user';

// Simple mutex to prevent race conditions on concurrent writes
let writeQueue: Promise<void> = Promise.resolve();

// ========== Log Session ==========

export async function logSession(
  type: ActivityType,
  dateISO: string,
  durationSeconds: number,
  options?: { startedAtISO?: string; endedAtISO?: string }
): Promise<ActivitySession> {
  const session: ActivitySession = {
    id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    userId: LOCAL_USER_ID,
    type,
    dateISO,
    durationSeconds,
    startedAtISO: options?.startedAtISO,
    endedAtISO: options?.endedAtISO,
    createdAtISO: new Date().toISOString(),
  };

  // Queue write to prevent race conditions
  writeQueue = writeQueue.then(async () => {
    const allSessions = await getAllSessions();
    allSessions.push(session);
    await setItem(StorageKeys.ACTIVITY_SESSIONS, allSessions);
  });
  await writeQueue;

  return session;
}

// ========== Get Sessions ==========

async function getAllSessions(): Promise<ActivitySession[]> {
  const sessions = await getItem<ActivitySession[]>(StorageKeys.ACTIVITY_SESSIONS);
  return sessions || [];
}

export async function getSessionsForDate(dateISO: string): Promise<ActivitySession[]> {
  const allSessions = await getAllSessions();
  return allSessions.filter((s) => s.dateISO === dateISO);
}

// ========== Totals by Type ==========

export async function getTotalsByTypeForDate(
  type: ActivityType,
  dateISO: string
): Promise<number> {
  const sessions = await getSessionsForDate(dateISO);
  const typeSessions = sessions.filter((s) => s.type === type);

  return typeSessions.reduce((total, s) => total + s.durationSeconds, 0);
}

export async function getTotalsByTypeForWeek(
  type: ActivityType,
  weekStartISO: string
): Promise<number> {
  const weekDates = getWeekDates(weekStartISO);
  const allSessions = await getAllSessions();

  const weekSessions = allSessions.filter(
    (s) => s.type === type && weekDates.includes(s.dateISO)
  );

  return weekSessions.reduce((total, s) => total + s.durationSeconds, 0);
}

// ========== Daily Totals for Charts ==========

export type DailyTotal = {
  date: string;
  label: string;
  seconds: number;
};

export async function getDailyTotalsForPeriod(
  type: ActivityType,
  days: number
): Promise<DailyTotal[]> {
  const allSessions = await getAllSessions();
  const result: DailyTotal[] = [];

  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Use formatDateKey for consistent local timezone handling
    const dateISO = formatDateKey(date);

    // Get day label based on period length (local timezone)
    let label: string;
    if (days <= 7) {
      label = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
    } else if (days <= 31) {
      label = String(date.getDate());
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3);
    }

    const dayTotal = allSessions
      .filter((s) => s.type === type && s.dateISO === dateISO)
      .reduce((sum, s) => sum + s.durationSeconds, 0);

    result.push({
      date: dateISO,
      label,
      seconds: dayTotal,
    });
  }

  return result;
}

// ========== Training Stats ==========

export type TrainingStats = {
  totalSessions: number;
  sessionsThisWeek: number;
  totalTimeSeconds: number;
  avgSessionSeconds: number;
};

export async function getTrainingStats(): Promise<TrainingStats> {
  const allSessions = await getAllSessions();
  const workoutSessions = allSessions.filter((s) => s.type === 'workout');

  // Get this week's dates (Monday to Sunday) using local timezone
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  const weekStartISO = formatDateKey(monday);
  const weekDates = getWeekDates(weekStartISO);

  const sessionsThisWeek = workoutSessions.filter((s) =>
    weekDates.includes(s.dateISO)
  ).length;

  const totalTimeSeconds = workoutSessions.reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  );

  const avgSessionSeconds =
    workoutSessions.length > 0
      ? Math.round(totalTimeSeconds / workoutSessions.length)
      : 0;

  return {
    totalSessions: workoutSessions.length,
    sessionsThisWeek,
    totalTimeSeconds,
    avgSessionSeconds,
  };
}

// ========== Helpers ==========

function getWeekDates(weekStartISO: string): string[] {
  const dates: string[] = [];
  // Parse the date string and create date at noon to avoid timezone edge cases
  const [year, month, day] = weekStartISO.split('-').map(Number);
  const start = new Date(year, month - 1, day, 12, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDateKey(date));
  }

  return dates;
}
