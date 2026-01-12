// Body feature types

export type BodyView = 'profile' | 'training';

export type ScoreType = 'weight' | 'rounds-reps' | 'time' | 'completed';

export type Track = {
  id: string;
  name: string;
  description: string;
};

export type WorkoutItem = {
  id: string;
  name: string;
  scoreType: ScoreType;
  description?: string;
};

export type Workout = {
  id: string;
  title: string;
  description?: string;
  items: WorkoutItem[];
};

export type WorkoutDay = {
  date: string; // YYYY-MM-DD
  trackId: string;
  workouts: Workout[];
};

export type Result = {
  id: string;
  workoutItemId: string;
  userId: string; // placeholder
  userName: string; // placeholder
  score: ScoreValue;
  createdAt: string;
  isPR: boolean;
};

export type ScoreValue =
  | { type: 'weight'; value: number } // lbs
  | { type: 'rounds-reps'; rounds: number; reps: number }
  | { type: 'time'; seconds: number } // stored as total seconds
  | { type: 'completed'; value: boolean };

export type MajorMovement = {
  id: string;
  name: string;
  lastLogged?: string; // date string or null
  bestWeight?: number; // PR in lbs
  trend: 'up' | 'down' | 'stable';
};

export type WorkoutSession = {
  id: string;
  startTime?: number; // timestamp
  endTime?: number; // timestamp
  duration: number; // seconds
};
