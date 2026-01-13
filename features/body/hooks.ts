// Body feature hooks for data fetching

import { useState, useEffect, useCallback } from 'react';
import type { TrainingTrack, Exercise, TrainingDay, Workout, ScheduledMovement } from '@/lib/training/types';
import {
  getTracks,
  getActiveTrackId,
  setActiveTrackId as repoSetActiveTrackId,
  getTrainingDay,
  getAllExercises,
  getMajorExercises,
  getTodayISO,
  getMondayOfWeek,
  forceRefreshFromSupabase,
} from '@/lib/repositories/TrainingRepo';
import type { MajorMovement } from './types';

// ========== Enriched Movement Type ==========

export type EnrichedMovement = {
  id: string;
  exercise: Exercise;
  targetText?: string;
  notes?: string;
  order: number;
};

export type EnrichedWorkout = {
  id: string;
  title: string;
  movements: EnrichedMovement[];
};

// ========== Active Track Hook ==========

export function useActiveTrack() {
  const [tracks, setTracks] = useState<TrainingTrack[]>([]);
  const [activeTrackId, setActiveTrackIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTracksAndActiveId();
  }, []);

  const loadTracksAndActiveId = async () => {
    try {
      const [fetchedTracks, fetchedActiveId] = await Promise.all([
        getTracks(),
        getActiveTrackId(),
      ]);
      setTracks(fetchedTracks);
      setActiveTrackIdState(fetchedActiveId);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const setActiveTrackId = async (trackId: string) => {
    try {
      await repoSetActiveTrackId(trackId);
      setActiveTrackIdState(trackId);
    } catch (error) {
      console.error('Failed to set active track:', error);
    }
  };

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await forceRefreshFromSupabase();
      await loadTracksAndActiveId();
    } catch (error) {
      console.error('Failed to refresh from Supabase:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  return {
    tracks,
    activeTrack,
    activeTrackId,
    setActiveTrackId,
    loading,
    refreshing,
    refresh,
  };
}

// ========== Training Day Hook ==========

export function useTrainingDay(trackId: string | null, dateISO: string) {
  const [trainingDay, setTrainingDay] = useState<TrainingDay | null>(null);
  const [enrichedWorkouts, setEnrichedWorkouts] = useState<EnrichedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    loadTrainingDay();
  }, [trackId, dateISO, reloadTrigger]);

  const loadTrainingDay = async () => {
    setLoading(true);
    try {
      if (!trackId) {
        setTrainingDay(null);
        setEnrichedWorkouts([]);
        return;
      }

      const [day, exercises] = await Promise.all([
        getTrainingDay(trackId, dateISO),
        getAllExercises(),
      ]);

      setTrainingDay(day);

      if (day) {
        // Enrich workouts with exercise details
        const enriched = day.workouts.map((workout) => ({
          id: workout.id,
          title: workout.title,
          movements: workout.movements
            .map((movement): EnrichedMovement | null => {
              const exercise = exercises.find((ex) => ex.id === movement.exerciseId);
              if (!exercise) return null;
              return {
                id: movement.id,
                exercise,
                targetText: movement.targetText,
                notes: movement.notes,
                order: movement.order,
              };
            })
            .filter((m): m is EnrichedMovement => m !== null)
            .sort((a, b) => a.order - b.order),
        }));
        setEnrichedWorkouts(enriched);
      } else {
        setEnrichedWorkouts([]);
      }
    } catch (error) {
      console.error('Failed to load training day:', error);
      setTrainingDay(null);
      setEnrichedWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    trainingDay,
    enrichedWorkouts,
    loading,
    reload,
  };
}

// ========== Exercises Hook ==========

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const fetchedExercises = await getAllExercises();
      setExercises(fetchedExercises);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    exercises,
    loading,
  };
}

// ========== Major Movements Hook ==========

export function useMajorMovements(): { movements: MajorMovement[]; loading: boolean } {
  const [movements, setMovements] = useState<MajorMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMajorMovements();
  }, []);

  const loadMajorMovements = async () => {
    try {
      const exercises = await getMajorExercises();

      // Map to MajorMovement type (without real data for lastLogged, bestWeight, trend yet)
      const mapped: MajorMovement[] = exercises.map((ex) => ({
        id: ex.id,
        name: ex.title,
        lastLogged: undefined,
        bestWeight: undefined,
        trend: 'stable',
      }));

      setMovements(mapped);
    } catch (error) {
      console.error('Failed to load major movements:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    movements,
    loading,
  };
}

// ========== Helper: Get Current Week Dates ==========

export function getCurrentWeekDates(): string[] {
  const today = new Date();
  const mondayISO = getMondayOfWeek();
  const monday = new Date(mondayISO);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}
