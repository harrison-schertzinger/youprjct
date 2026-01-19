// Timer Persistence: Enables timers to survive background/foreground transitions
// Stores start timestamp in AsyncStorage and calculates elapsed time on resume

import { getItem, setItem, removeItem } from './storage';

export type TimerType = 'reading' | 'workout';

type PersistedTimerState = {
  startTime: number; // Unix timestamp when timer started
  pausedDuration: number; // Accumulated time during paused periods
  isPaused: boolean;
  pausedAt?: number; // Timestamp when paused
};

// Storage keys for each timer type
const TIMER_KEYS: Record<TimerType, string> = {
  reading: '@timer:reading:state',
  workout: '@timer:workout:state',
};

/**
 * Save timer state when starting or pausing
 */
export async function saveTimerState(
  type: TimerType,
  state: PersistedTimerState
): Promise<void> {
  await setItem(TIMER_KEYS[type], state);
}

/**
 * Load persisted timer state
 */
export async function loadTimerState(
  type: TimerType
): Promise<PersistedTimerState | null> {
  return await getItem<PersistedTimerState>(TIMER_KEYS[type]);
}

/**
 * Clear timer state when session ends
 */
export async function clearTimerState(type: TimerType): Promise<void> {
  await removeItem(TIMER_KEYS[type]);
}

/**
 * Calculate elapsed seconds from persisted state
 * Handles both running and paused states
 */
export function calculateElapsedSeconds(state: PersistedTimerState): number {
  const now = Date.now();

  if (state.isPaused && state.pausedAt) {
    // If paused, return time up until pause point
    return Math.floor((state.pausedAt - state.startTime) / 1000) + state.pausedDuration;
  }

  // If running, calculate from start time plus any accumulated paused time
  return Math.floor((now - state.startTime) / 1000) + state.pausedDuration;
}

/**
 * Start a new timer session
 */
export async function startTimer(type: TimerType): Promise<PersistedTimerState> {
  const state: PersistedTimerState = {
    startTime: Date.now(),
    pausedDuration: 0,
    isPaused: false,
  };
  await saveTimerState(type, state);
  return state;
}

/**
 * Pause the timer
 */
export async function pauseTimer(type: TimerType): Promise<PersistedTimerState | null> {
  const state = await loadTimerState(type);
  if (!state || state.isPaused) return state;

  const updatedState: PersistedTimerState = {
    ...state,
    isPaused: true,
    pausedAt: Date.now(),
  };
  await saveTimerState(type, updatedState);
  return updatedState;
}

/**
 * Resume a paused timer
 */
export async function resumeTimer(type: TimerType): Promise<PersistedTimerState | null> {
  const state = await loadTimerState(type);
  if (!state || !state.isPaused || !state.pausedAt) return state;

  // Add paused duration to accumulated time and reset
  const pausedTime = Math.floor((Date.now() - state.pausedAt) / 1000);
  const updatedState: PersistedTimerState = {
    startTime: Date.now(),
    pausedDuration: calculateElapsedSeconds(state),
    isPaused: false,
    pausedAt: undefined,
  };
  await saveTimerState(type, updatedState);
  return updatedState;
}
