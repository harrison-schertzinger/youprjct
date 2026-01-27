// usePersistedTimer: Hook for timer that persists across background/foreground
// Uses timestamp-based calculation instead of setInterval increments

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  type TimerType,
  loadTimerState,
  startTimer,
  pauseTimer,
  resumeTimer,
  clearTimerState,
  calculateElapsedSeconds,
} from '@/lib/timerPersistence';

export type TimerStatus = 'idle' | 'running' | 'paused';

type UsePersistedTimerOptions = {
  /** Optional key suffix for scoped timers (e.g., workoutId for workout-specific timers) */
  keySuffix?: string;
};

type UsePersistedTimerReturn = {
  status: TimerStatus;
  duration: number; // elapsed seconds
  startTime: number | null; // Unix timestamp when started
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<number>; // Returns final duration
  addManualTime: (seconds: number) => void;
};

export function usePersistedTimer(
  type: TimerType,
  options?: UsePersistedTimerOptions
): UsePersistedTimerReturn {
  const keySuffix = options?.keySuffix;

  const [status, setStatus] = useState<TimerStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [manualAddedTime, setManualAddedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Recalculate duration from persisted state
  const syncFromPersistedState = useCallback(async () => {
    const state = await loadTimerState(type, keySuffix);
    if (!state) {
      setStatus('idle');
      setDuration(0);
      setStartTime(null);
      return;
    }

    setStartTime(state.startTime);
    setStatus(state.isPaused ? 'paused' : 'running');
    setDuration(calculateElapsedSeconds(state) + manualAddedTime);
  }, [type, keySuffix, manualAddedTime]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      // Coming back to foreground
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        await syncFromPersistedState();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [syncFromPersistedState]);

  // Load persisted state on mount
  useEffect(() => {
    syncFromPersistedState();
  }, [syncFromPersistedState]);

  // Timer tick effect - only for UI updates when running
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(async () => {
        const state = await loadTimerState(type, keySuffix);
        if (state && !state.isPaused) {
          setDuration(calculateElapsedSeconds(state) + manualAddedTime);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, type, keySuffix, manualAddedTime]);

  const start = useCallback(async () => {
    const state = await startTimer(type, keySuffix);
    setStartTime(state.startTime);
    setDuration(0);
    setManualAddedTime(0);
    setStatus('running');
  }, [type, keySuffix]);

  const pause = useCallback(async () => {
    const state = await pauseTimer(type, keySuffix);
    if (state) {
      setDuration(calculateElapsedSeconds(state) + manualAddedTime);
      setStatus('paused');
    }
  }, [type, keySuffix, manualAddedTime]);

  const resume = useCallback(async () => {
    await resumeTimer(type, keySuffix);
    setStatus('running');
  }, [type, keySuffix]);

  const stop = useCallback(async (): Promise<number> => {
    const state = await loadTimerState(type, keySuffix);
    const finalDuration = state
      ? calculateElapsedSeconds(state) + manualAddedTime
      : duration;

    await clearTimerState(type, keySuffix);
    setStatus('idle');
    setDuration(0);
    setStartTime(null);
    setManualAddedTime(0);

    return finalDuration;
  }, [type, keySuffix, duration, manualAddedTime]);

  const addManualTime = useCallback((seconds: number) => {
    setManualAddedTime((prev) => prev + seconds);
    setDuration((prev) => prev + seconds);
  }, []);

  return {
    status,
    duration,
    startTime,
    start,
    pause,
    resume,
    stop,
    addManualTime,
  };
}
