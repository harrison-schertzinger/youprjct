// TrainingRepo: Manages training tracks, exercises, and scheduled programming

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import type { TrainingTrack, Exercise, TrainingDay } from '../training/types';
import { SEED_TRACKS, SEED_EXERCISES, generateCurrentWeekTraining } from '../training/seed';

// ========== Seed ==========

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

  console.log('Training data seeded successfully');
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
  const allDays = await getItem<TrainingDay[]>(StorageKeys.TRAINING_DAYS);
  if (!allDays) return null;

  return allDays.find((day) => day.trackId === trackId && day.dateISO === dateISO) || null;
}

export async function getTrainingWeek(
  trackId: string,
  weekStartISO: string
): Promise<TrainingDay[]> {
  const allDays = await getItem<TrainingDay[]>(StorageKeys.TRAINING_DAYS);
  if (!allDays) return [];

  // Get all 7 days for this week
  const weekDays = allDays.filter(
    (day) => day.trackId === trackId && day.weekStartISO === weekStartISO
  );

  // Sort by date
  return weekDays.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

// ========== Helper: Get Monday of current week ==========

export function getMondayOfWeek(dateISO?: string): string {
  const date = dateISO ? new Date(dateISO) : new Date();
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split('T')[0];
}

// ========== Helper: Get today's date ==========

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
