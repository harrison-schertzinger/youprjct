// TrainingRepo: Manages training tracks, exercises, and scheduled programming
// Hybrid local-first + Supabase backend with caching

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import { isTrainingCacheStale, setTrainingCacheMetadata } from '../storage/cache';
import { isSupabaseConfigured } from '../supabase/client';
import {
  fetchTracks as fetchRemoteTracks,
  fetchExercises as fetchRemoteExercises,
  fetchTrainingWeek as fetchRemoteTrainingWeek,
  fetchTrainingDay as fetchRemoteTrainingDay,
  hasRemoteTrainingData,
} from '../supabase/trainingApi';
import type { TrainingTrack, Exercise, TrainingDay } from '../training/types';
import { SEED_TRACKS, SEED_EXERCISES, generateCurrentWeekTraining } from '../training/seed';
import { formatDateKey } from '@/utils/calendar';

// ========== Initialization ==========

/**
 * Initialize training data on app start.
 * - Returns cached data immediately
 * - Triggers background refresh if Supabase is configured
 * - Falls back to seed data if no cache and no Supabase
 */
export async function initializeTraining(): Promise<void> {
  const tracks = await getItem<TrainingTrack[]>(StorageKeys.TRAINING_TRACKS);

  // If we have cached data, we're good for immediate use
  if (tracks && tracks.length > 0) {
    // Trigger background refresh if Supabase is configured
    if (isSupabaseConfigured()) {
      const weekStart = getMondayOfWeek();
      refreshTrainingDataInBackground(weekStart);
    }
    return;
  }

  // No cached data - try to fetch from Supabase
  if (isSupabaseConfigured()) {
    const hasRemote = await hasRemoteTrainingData();
    if (hasRemote) {
      await syncFromSupabase();
      return;
    }
  }

  // No cache, no Supabase (or empty) - fall back to seed
  await seedIfEmpty();
}

/**
 * Refresh training data from Supabase in the background.
 * Does not block the UI.
 */
function refreshTrainingDataInBackground(weekStartISO: string): void {
  // Fire and forget - don't await
  isTrainingCacheStale(weekStartISO).then((isStale) => {
    if (isStale) {
      syncFromSupabase().catch((err) => {
        console.error('Background sync failed:', err);
      });
    }
  });
}

/**
 * Sync all training data from Supabase to local cache.
 */
async function syncFromSupabase(): Promise<void> {
  const weekStart = getMondayOfWeek();

  // Fetch tracks, exercises, and current week in parallel
  const [tracks, exercises] = await Promise.all([
    fetchRemoteTracks(),
    fetchRemoteExercises(),
  ]);

  // Only update cache if we got valid data
  if (tracks && tracks.length > 0) {
    await setItem(StorageKeys.TRAINING_TRACKS, tracks);

    // Set default active track if not set
    const activeTrackId = await getActiveTrackId();
    if (!activeTrackId) {
      await setItem(StorageKeys.TRAINING_ACTIVE_TRACK_ID, tracks[0].id);
    }
  }

  if (exercises && exercises.length > 0) {
    await setItem(StorageKeys.TRAINING_EXERCISES, exercises);
  }

  // Fetch training days for all tracks
  if (tracks && tracks.length > 0) {
    const allDays: TrainingDay[] = [];

    for (const track of tracks) {
      const weekDays = await fetchRemoteTrainingWeek(track.id, weekStart);
      if (weekDays) {
        allDays.push(...weekDays);
      }
    }

    if (allDays.length > 0) {
      // Merge with existing days (keep days from other weeks)
      const existingDays = await getItem<TrainingDay[]>(StorageKeys.TRAINING_DAYS) || [];
      const otherWeekDays = existingDays.filter((day) => day.weekStartISO !== weekStart);
      await setItem(StorageKeys.TRAINING_DAYS, [...otherWeekDays, ...allDays]);
    }
  }

  // Update cache metadata
  await setTrainingCacheMetadata(weekStart);

  console.log('Training data synced from Supabase');
}

// ========== Seed (Fallback) ==========

/**
 * Seed local data if empty.
 * Only used when Supabase is not configured or returns empty.
 */
export async function seedIfEmpty(): Promise<void> {
  const tracks = await getTracks();
  if (tracks.length > 0) return; // Already seeded

  // Seed tracks
  await setItem(StorageKeys.TRAINING_TRACKS, SEED_TRACKS);

  // Seed exercises
  await setItem(StorageKeys.TRAINING_EXERCISES, SEED_EXERCISES);

  // Seed current week training
  const trainingDays = generateCurrentWeekTraining();
  await setItem(StorageKeys.TRAINING_DAYS, trainingDays);

  // Set default active track
  await setItem(StorageKeys.TRAINING_ACTIVE_TRACK_ID, SEED_TRACKS[0].id);

  console.log('Training data seeded (local fallback)');
}

// ========== Tracks ==========

export async function getTracks(): Promise<TrainingTrack[]> {
  const tracks = await getItem<TrainingTrack[]>(StorageKeys.TRAINING_TRACKS);
  return tracks || [];
}

export async function getActiveTrackId(): Promise<string | null> {
  return await getItem<string>(StorageKeys.TRAINING_ACTIVE_TRACK_ID);
}

export async function setActiveTrackId(trackId: string): Promise<void> {
  await setItem(StorageKeys.TRAINING_ACTIVE_TRACK_ID, trackId);
}

// ========== Exercises ==========

export async function getAllExercises(): Promise<Exercise[]> {
  const exercises = await getItem<Exercise[]>(StorageKeys.TRAINING_EXERCISES);
  return exercises || [];
}

export async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  const exercises = await getAllExercises();
  return exercises.find((ex) => ex.id === exerciseId) || null;
}

export async function getMajorExercises(): Promise<Exercise[]> {
  const exercises = await getAllExercises();
  return exercises.filter((ex) => ex.isMajor === true);
}

// ========== Training Days ==========

export async function getTrainingDay(
  trackId: string,
  dateISO: string
): Promise<TrainingDay | null> {
  // First check local cache
  const allDays = await getItem<TrainingDay[]>(StorageKeys.TRAINING_DAYS);
  if (allDays) {
    const cached = allDays.find((day) => day.trackId === trackId && day.dateISO === dateISO);
    if (cached) return cached;
  }

  // If Supabase configured, try to fetch this specific day
  if (isSupabaseConfigured()) {
    const remoteDay = await fetchRemoteTrainingDay(trackId, dateISO);
    if (remoteDay) {
      // Add to cache
      const existingDays = allDays || [];
      await setItem(StorageKeys.TRAINING_DAYS, [...existingDays, remoteDay]);
      return remoteDay;
    }
  }

  return null;
}

export async function getTrainingWeek(
  trackId: string,
  weekStartISO: string
): Promise<TrainingDay[]> {
  // First check local cache
  const allDays = await getItem<TrainingDay[]>(StorageKeys.TRAINING_DAYS);
  const cachedWeek = allDays?.filter(
    (day) => day.trackId === trackId && day.weekStartISO === weekStartISO
  ) || [];

  // If we have cached data for this week, return it
  // Background refresh will update if stale
  if (cachedWeek.length > 0) {
    // Trigger background refresh if stale
    if (isSupabaseConfigured()) {
      refreshTrainingDataInBackground(weekStartISO);
    }
    return cachedWeek.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }

  // No cached data - try to fetch from Supabase
  if (isSupabaseConfigured()) {
    const remoteWeek = await fetchRemoteTrainingWeek(trackId, weekStartISO);
    if (remoteWeek && remoteWeek.length > 0) {
      // Add to cache
      const existingDays = allDays || [];
      const otherDays = existingDays.filter(
        (day) => !(day.trackId === trackId && day.weekStartISO === weekStartISO)
      );
      await setItem(StorageKeys.TRAINING_DAYS, [...otherDays, ...remoteWeek]);
      await setTrainingCacheMetadata(weekStartISO);
      return remoteWeek.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    }
  }

  return [];
}

// ========== Force Refresh ==========

/**
 * Force a refresh from Supabase, bypassing cache staleness check.
 * Use sparingly (e.g., pull-to-refresh).
 */
export async function forceRefreshFromSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    await syncFromSupabase();
    return true;
  } catch (err) {
    console.error('Force refresh failed:', err);
    return false;
  }
}

// ========== Helper: Get Monday of current week ==========

export function getMondayOfWeek(dateISO?: string): string {
  const date = dateISO ? new Date(dateISO) : new Date();
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split('T')[0];
}

// ========== Helper: Get today's date (local timezone) ==========

export function getTodayISO(): string {
  return formatDateKey(new Date());
}
