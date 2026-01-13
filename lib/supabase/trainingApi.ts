// Supabase API functions for training data
// Maps database rows to app domain types

import { getSupabase, isSupabaseConfigured } from './client';
import type { TrainingTrack, Exercise, TrainingDay, Workout } from '../training/types';

// ========== Database Row Types ==========

type TrackRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type ExerciseRow = {
  id: string;
  title: string;
  score_type: 'weight' | 'reps' | 'time';
  sort_direction: 'desc' | 'asc';
  is_major: boolean;
  created_at: string;
};

type TrainingDayRow = {
  id: string;
  track_id: string;
  date_iso: string;
  week_start_iso: string;
  workouts: Workout[]; // JSONB column
  created_at: string;
  updated_at: string;
};

// ========== Mappers ==========

function mapTrack(row: TrackRow): TrainingTrack {
  return {
    id: row.id,
    title: row.title,
    createdAtISO: row.created_at,
    updatedAtISO: row.updated_at,
  };
}

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    title: row.title,
    scoreType: row.score_type,
    sortDirection: row.sort_direction,
    isMajor: row.is_major,
  };
}

function mapTrainingDay(row: TrainingDayRow): TrainingDay {
  return {
    id: row.id,
    trackId: row.track_id,
    dateISO: row.date_iso,
    weekStartISO: row.week_start_iso,
    workouts: row.workouts || [],
  };
}

// ========== API Functions ==========

/**
 * Fetch all training tracks from Supabase.
 * Returns null if Supabase not configured or on error.
 */
export async function fetchTracks(): Promise<TrainingTrack[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('training_tracks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch tracks:', error.message);
      return null;
    }

    return (data as TrackRow[]).map(mapTrack);
  } catch (err) {
    console.error('Network error fetching tracks:', err);
    return null;
  }
}

/**
 * Fetch all exercises from Supabase.
 * Returns null if Supabase not configured or on error.
 */
export async function fetchExercises(): Promise<Exercise[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      console.error('Failed to fetch exercises:', error.message);
      return null;
    }

    return (data as ExerciseRow[]).map(mapExercise);
  } catch (err) {
    console.error('Network error fetching exercises:', err);
    return null;
  }
}

/**
 * Fetch training days for a specific track and week.
 * Returns null if Supabase not configured or on error.
 */
export async function fetchTrainingWeek(
  trackId: string,
  weekStartISO: string
): Promise<TrainingDay[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('training_days')
      .select('*')
      .eq('track_id', trackId)
      .eq('week_start_iso', weekStartISO)
      .order('date_iso', { ascending: true });

    if (error) {
      console.error('Failed to fetch training week:', error.message);
      return null;
    }

    return (data as TrainingDayRow[]).map(mapTrainingDay);
  } catch (err) {
    console.error('Network error fetching training week:', err);
    return null;
  }
}

/**
 * Fetch a single training day.
 * Returns null if Supabase not configured, not found, or on error.
 */
export async function fetchTrainingDay(
  trackId: string,
  dateISO: string
): Promise<TrainingDay | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('training_days')
      .select('*')
      .eq('track_id', trackId)
      .eq('date_iso', dateISO)
      .single();

    if (error) {
      // Not found is expected for days without programming
      if (error.code !== 'PGRST116') {
        console.error('Failed to fetch training day:', error.message);
      }
      return null;
    }

    return mapTrainingDay(data as TrainingDayRow);
  } catch (err) {
    console.error('Network error fetching training day:', err);
    return null;
  }
}

/**
 * Check if Supabase has any training data.
 * Used to determine if we should fall back to seed data.
 */
export async function hasRemoteTrainingData(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const tracks = await fetchTracks();
  return tracks !== null && tracks.length > 0;
}
