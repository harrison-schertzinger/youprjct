// ResultsRepo: Manages logged performance results and PRs

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import type { Result, Exercise } from '../training/types';
import { getMajorExercises } from './TrainingRepo';

const LOCAL_USER_ID = 'local-user';

// ========== Log Results ==========

export async function logResult(
  exerciseId: string,
  trackId: string,
  dateISO: string,
  value: { valueNumber?: number; valueTimeSeconds?: number }
): Promise<Result> {
  const result: Result = {
    id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
