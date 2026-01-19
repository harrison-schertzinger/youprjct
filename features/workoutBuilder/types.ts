// Workout Builder feature types

import type { GoalColor } from '@/features/goals/types';
import { GOAL_GRADIENTS } from '@/features/goals/types';

// Re-export color system from goals (unified design language)
export type WorkoutColor = GoalColor;
export const WORKOUT_GRADIENTS = GOAL_GRADIENTS;

// Workout template types
export type WorkoutTemplateType = 'emom' | 'amrap' | 'forTime' | 'strength';

export const TEMPLATE_LABELS: Record<WorkoutTemplateType, string> = {
  emom: 'EMOM',
  amrap: 'AMRAP',
  forTime: 'For Time',
  strength: 'Strength',
};

// Exercise within a custom workout
export type WorkoutExercise = {
  id: string;
  exerciseId: string; // References Exercise from training library
  exerciseTitle: string; // Cached for display
  sets?: number;
  reps?: string; // String to allow ranges like "8-12"
  weight?: string; // String to allow "bodyweight", "75%", etc.
  duration?: number; // Seconds (for time-based)
  notes?: string;
  order: number;
};

// Custom workout definition
export type CustomWorkout = {
  id: string;
  title: string;
  templateType: WorkoutTemplateType;
  color: WorkoutColor;
  exercises: WorkoutExercise[];
  timeCap?: number; // Total time cap in seconds (for AMRAP/For Time)
  rounds?: number; // Number of rounds (for EMOM)
  intervalSeconds?: number; // Interval duration (for EMOM)
  notes?: string;
  isTemplate: boolean; // If true, can be reused; if false, one-time scheduled
  createdAt: string;
  updatedAt: string;
};

// Scheduled instance of a workout
export type ScheduledWorkout = {
  id: string;
  workoutId: string; // References CustomWorkout
  dateISO: string; // YYYY-MM-DD
  completedAt?: string;
  actualDuration?: number; // Seconds
  notes?: string;
};

// Logged result for a workout session
export type WorkoutSessionLog = {
  id: string;
  scheduledWorkoutId: string;
  startedAt: string;
  completedAt: string;
  totalDuration: number; // Seconds
  exerciseResults: ExerciseResult[];
};

export type ExerciseResult = {
  workoutExerciseId: string;
  exerciseId: string;
  completedSets?: number;
  completedReps?: number;
  weightUsed?: number;
  timeSeconds?: number;
  calories?: number;
  distance?: number;
  notes?: string;
};

// Filter/search options for exercise picker
export type ExerciseFilter = {
  category?: string;
  equipment?: string;
  searchQuery?: string;
};
