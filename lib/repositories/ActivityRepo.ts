// ActivityRepo: Manages time-tracked activity sessions (reading, workouts)

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import type { ActivitySession, ActivityType } from '../training/types';

const LOCAL_USER_ID = 'local-user';

// ========== Log Session ==========

export async function logSession(
  type: ActivityType,
  dateISO: string,
  durationSeconds: number,
  options?: { startedAtISO?: string; endedAtISO?: string }
): Promise<ActivitySession> {
  const session: ActivitySession = {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: LOCAL_USER_ID,
    type,
    dateISO,
    durationSeconds,
    startedAtISO: options?.startedAtISO,
    endedAtISO: options?.endedAtISO,
    createdAtISO: new Date().toISOString(),
  };

  const allSessions = await getAllSessions();
  allSessions.push(session);
  await setItem(StorageKeys.ACTIVITY_SESSIONS, allSessions);

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

// ========== Helpers ==========

function getWeekDates(weekStartISO: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStartISO);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}
