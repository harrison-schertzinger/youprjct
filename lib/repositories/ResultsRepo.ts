// ResultsRepo: Manages logged performance results and PRs

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import type { Result, Exercise, SortDirection } from '../training/types';
import { getMajorExercises, getExerciseById } from './TrainingRepo';
import { getProfile } from './ProfileRepo';

const LOCAL_USER_ID = 'local-user';

// ========== Leaderboard Entry Type ==========

export type LeaderboardEntry = {
  id: string;
  rank: number;
  userId: string;
  displayName: string;
  value: number; // weight in lbs, reps count, or time in seconds
  dateISO: string;
  isPR: boolean;
};

// ========== Log Results ==========

export async function logResult(
  exerciseId: string,
  trackId: string,
  dateISO: string,
  value: { valueNumber?: number; valueTimeSeconds?: number }
): Promise<Result> {
  const result: Result = {
    id: `result-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    userId: LOCAL_USER_ID,
    exerciseId,
    trackId,
    dateISO,
    valueNumber: value.valueNumber,
    valueTimeSeconds: value.valueTimeSeconds,
    createdAtISO: new Date().toISOString(),
  };

  const allResults = await getAllResults();
  allResults.push(result);
  await setItem(StorageKeys.RESULTS, allResults);

  return result;
}

// ========== Get Results ==========

async function getAllResults(): Promise<Result[]> {
  const results = await getItem<Result[]>(StorageKeys.RESULTS);
  return results || [];
}

export async function getResultsForExercise(
  exerciseId: string,
  options?: { limit?: number }
): Promise<Result[]> {
  const allResults = await getAllResults();

  // Filter by exercise
  let results = allResults.filter((r) => r.exerciseId === exerciseId);

  // Sort by date descending (most recent first)
  results = results.sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  // Apply limit
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

// ========== Leaderboard ==========

export async function getLeaderboardForExercise(
  exerciseId: string,
  sortDirection: SortDirection,
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  const allResults = await getAllResults();
  const profile = await getProfile();

  // Filter by exercise
  const exerciseResults = allResults.filter((r) => r.exerciseId === exerciseId);

  if (exerciseResults.length === 0) {
    return [];
  }

  // Get the exercise to determine scoreType
  const exercise = await getExerciseById(exerciseId);
  const isTimeBasedExercise = exercise?.scoreType === 'time';

  // Sort based on sortDirection
  // desc = higher is better (weight, reps)
  // asc = lower is better (time)
  const sorted = [...exerciseResults].sort((a, b) => {
    const aValue = isTimeBasedExercise
      ? a.valueTimeSeconds || Infinity
      : a.valueNumber || 0;
    const bValue = isTimeBasedExercise
      ? b.valueTimeSeconds || Infinity
      : b.valueNumber || 0;

    if (sortDirection === 'desc') {
      return bValue - aValue; // Higher first
    } else {
      return aValue - bValue; // Lower first
    }
  });

  // Find the best value (PR) for marking
  const bestValue = sorted.length > 0
    ? (isTimeBasedExercise
        ? sorted[0].valueTimeSeconds || 0
        : sorted[0].valueNumber || 0)
    : 0;

  // Map to leaderboard entries with rank
  const entries: LeaderboardEntry[] = sorted.slice(0, limit).map((result, index) => {
    const value = isTimeBasedExercise
      ? result.valueTimeSeconds || 0
      : result.valueNumber || 0;

    return {
      id: result.id,
      rank: index + 1,
      userId: result.userId,
      displayName: result.userId === LOCAL_USER_ID ? profile.displayName : 'Unknown',
      value,
      dateISO: result.dateISO,
      isPR: value === bestValue,
    };
  });

  return entries;
}

// ========== PRs (Personal Records) ==========

export type PR = {
  exerciseId: string;
  exerciseTitle: string;
  scoreType: Exercise['scoreType'];
  bestValue: number; // weight in lbs, reps count, or time in seconds
  lastLoggedDateISO: string;
};

export async function getUserPRs(): Promise<PR[]> {
  const majorExercises = await getMajorExercises();
  const allResults = await getAllResults();

  const prs: PR[] = [];

  for (const exercise of majorExercises) {
    const exerciseResults = allResults.filter((r) => r.exerciseId === exercise.id);
    if (exerciseResults.length === 0) continue;

    // Find best result based on scoreType and sortDirection
    let bestResult: Result | null = null;

    if (exercise.scoreType === 'weight' || exercise.scoreType === 'reps') {
      // Higher is better
      bestResult = exerciseResults.reduce((best, current) => {
        const bestValue = best.valueNumber || 0;
        const currentValue = current.valueNumber || 0;
        return currentValue > bestValue ? current : best;
      });
    } else if (exercise.scoreType === 'time') {
      // Lower is better
      bestResult = exerciseResults.reduce((best, current) => {
        const bestValue = best.valueTimeSeconds || Infinity;
        const currentValue = current.valueTimeSeconds || Infinity;
        return currentValue < bestValue ? current : best;
      });
    }

    if (bestResult) {
      const bestValue =
        exercise.scoreType === 'time'
          ? bestResult.valueTimeSeconds || 0
          : bestResult.valueNumber || 0;

      prs.push({
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        scoreType: exercise.scoreType,
        bestValue,
        lastLoggedDateISO: bestResult.dateISO,
      });
    }
  }

  return prs;
}
