// Core training domain types for You.First

// ========== Training Tracks ==========

export type TrainingTrack = {
  id: string;
  title: string;
  createdAtISO: string;
  updatedAtISO: string;
};

// ========== Exercises (Movement Definitions) ==========

export type ScoreType = 'weight' | 'reps' | 'time';
export type SortDirection = 'desc' | 'asc';

export type Exercise = {
  id: string;
  title: string;
  scoreType: ScoreType;
  sortDirection: SortDirection;
  isMajor?: boolean; // Major movements show on PRs dashboard
};

// ========== Scheduled Movements ==========

export type ScheduledMovement = {
  id: string;
  exerciseId: string;
  notes?: string;
  targetText?: string; // e.g., "5x5 @ 75%", "AMRAP 10min"
  order: number;
};

// ========== Workouts ==========

export type Workout = {
  id: string;
  trackId: string;
  dateISO: string; // YYYY-MM-DD
  title: string;
  movements: ScheduledMovement[];
};

// ========== Training Days ==========

export type TrainingDay = {
  id: string;
  trackId: string;
  dateISO: string; // YYYY-MM-DD
  weekStartISO: string; // Monday of this week (YYYY-MM-DD)
  workouts: Workout[];
};

// ========== Results (Logged Performance) ==========

export type Result = {
  id: string;
  userId: string; // Local placeholder (e.g., "local-user")
  exerciseId: string;
  trackId: string;
  dateISO: string; // YYYY-MM-DD
  valueNumber?: number; // For weight/reps
  valueTimeSeconds?: number; // For time-based
  createdAtISO: string;
};

// ========== Activity Sessions (Time Tracking) ==========

export type ActivityType = 'reading' | 'workout';

export type ActivitySession = {
  id: string;
  userId: string; // Local placeholder
  type: ActivityType;
  dateISO: string; // YYYY-MM-DD
  durationSeconds: number;
  startedAtISO?: string;
  endedAtISO?: string;
  createdAtISO: string;
};

// ========== Profile ==========

export type Profile = {
  id: string; // Local placeholder
  displayName: string;
  avatarKey?: string;
  onAppStreakDays: number;
  lastOpenedISO: string; // ISO date string
  createdAtISO: string;
  updatedAtISO: string;
};
