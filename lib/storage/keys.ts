// Typed AsyncStorage keys for You.First

export const StorageKeys = {
  // Schema version
  SCHEMA_VERSION: '@storage:schemaVersion',

  // Training
  TRAINING_TRACKS: '@training:tracks',
  TRAINING_EXERCISES: '@training:exercises',
  TRAINING_DAYS: '@training:days',
  TRAINING_ACTIVE_TRACK_ID: '@training:activeTrackId',

  // Results
  RESULTS: '@results:all',

  // Activity sessions
  ACTIVITY_SESSIONS: '@activity:sessions',

  // Profile
  PROFILE: '@profile:current',

  // Workout session timer (persisted per workout+date)
  WORKOUT_SESSION_TIMER: '@workout:session:timer',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
