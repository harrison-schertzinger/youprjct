// Workout Builder hooks

import { useState, useEffect, useCallback } from 'react';
import type { CustomWorkout, ScheduledWorkout } from './types';
import {
  loadWorkouts,
  getWorkoutTemplates,
  loadScheduledWorkouts,
  getScheduledForDate,
  deleteWorkout,
  deleteScheduledWorkout,
} from './storage';
import { getAllExercises } from '@/lib/repositories/TrainingRepo';
import type { Exercise } from '@/lib/training/types';

// ============================================================
// Custom Workouts Hook
// ============================================================

export function useCustomWorkouts() {
  const [workouts, setWorkouts] = useState<CustomWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    loadData();
  }, [reloadTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load custom workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteWorkout(id);
    reload();
  }, [reload]);

  return {
    workouts,
    templates: workouts.filter((w) => w.isTemplate),
    loading,
    reload,
    remove,
  };
}

// ============================================================
// Scheduled Workouts Hook
// ============================================================

export function useScheduledWorkouts(dateISO?: string) {
  const [scheduled, setScheduled] = useState<ScheduledWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    loadData();
  }, [dateISO, reloadTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (dateISO) {
        const data = await getScheduledForDate(dateISO);
        setScheduled(data);
      } else {
        const data = await loadScheduledWorkouts();
        setScheduled(data);
      }
    } catch (error) {
      console.error('Failed to load scheduled workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteScheduledWorkout(id);
    reload();
  }, [reload]);

  return {
    scheduled,
    loading,
    reload,
    remove,
  };
}

// ============================================================
// Exercise Library Hook
// ============================================================

export function useExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllExercises();
      setExercises(data);
    } catch (error) {
      console.error('Failed to load exercise library:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = useCallback(
    (query?: string, category?: string, equipment?: string) => {
      let filtered = [...exercises];

      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter((e) =>
          e.title.toLowerCase().includes(lowerQuery)
        );
      }

      if (category) {
        filtered = filtered.filter((e) => e.category === category);
      }

      if (equipment) {
        filtered = filtered.filter((e) =>
          e.equipmentTags?.includes(equipment as any)
        );
      }

      return filtered;
    },
    [exercises]
  );

  return {
    exercises,
    loading,
    filterExercises,
  };
}

// ============================================================
// Enriched Scheduled Workout
// ============================================================

export type EnrichedScheduledWorkout = ScheduledWorkout & {
  workout: CustomWorkout;
};

export function useEnrichedScheduledWorkouts(dateISO: string) {
  const [enriched, setEnriched] = useState<EnrichedScheduledWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    loadData();
  }, [dateISO, reloadTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scheduledList, workoutsList] = await Promise.all([
        getScheduledForDate(dateISO),
        loadWorkouts(),
      ]);

      const workoutsMap = new Map(workoutsList.map((w) => [w.id, w]));

      const enrichedList: EnrichedScheduledWorkout[] = scheduledList
        .map((s) => {
          const workout = workoutsMap.get(s.workoutId);
          if (!workout) return null;
          return { ...s, workout };
        })
        .filter((e): e is EnrichedScheduledWorkout => e !== null);

      setEnriched(enrichedList);
    } catch (error) {
      console.error('Failed to load enriched scheduled workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    scheduledWorkouts: enriched,
    loading,
    reload,
  };
}
