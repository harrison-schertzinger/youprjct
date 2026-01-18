import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { tokens } from '@/design/tokens';
import type { EnrichedMovement } from '@/features/body/hooks';
import { useTrainingDay } from '@/features/body/hooks';
import {
  LogResultModal,
  CompactSessionTimer,
  ExpandableMovementTile,
  ExerciseLeaderboardModal,
  TimerState,
} from '@/features/body';
import type { ScoreValue, WorkoutItem } from '@/features/body/types';
import { logSession } from '@/lib/repositories/ActivityRepo';
import { logResult, getLeaderboardForExercise, LeaderboardEntry } from '@/lib/repositories/ResultsRepo';
import { getItem, setItem } from '@/lib/storage';
import { StorageKeys } from '@/lib/storage/keys';

// Timer persistence type
type PersistedTimerState = {
  workoutId: string;
  dateISO: string;
  elapsedSeconds: number;
  timerState: TimerState;
  lastTickISO: string;
};

// Generate storage key for specific workout+date
function getTimerStorageKey(workoutId: string, dateISO: string): string {
  return `${StorageKeys.WORKOUT_SESSION_TIMER}:${workoutId}:${dateISO}`;
}

export default function WorkoutSessionScreen() {
  const params = useLocalSearchParams<{
    workoutId: string;
    date: string;
    trackId: string;
  }>();

  const { workoutId, date, trackId } = params;

  const { enrichedWorkouts, loading } = useTrainingDay(trackId, date);
  const workout = enrichedWorkouts.find((w) => w.id === workoutId);

  // Timer state
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerRestored, setTimerRestored] = useState(false);

  // Expanded movements (track which ones are expanded)
  const [expandedMovements, setExpandedMovements] = useState<Set<string>>(new Set());

  // Log result modal
  const [logResultVisible, setLogResultVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<EnrichedMovement | null>(null);

  // Leaderboard modal
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [leaderboardMovement, setLeaderboardMovement] = useState<EnrichedMovement | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Restore timer state on mount
  useEffect(() => {
    if (workoutId && date) {
      restoreTimerState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId, date]);

  // Timer tick effect
  useEffect(() => {
    if (timerState === 'running') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newValue = prev + 1;
          // Persist every tick
          persistTimerState(newValue, 'running');
          return newValue;
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState]);

  const restoreTimerState = async () => {
    try {
      const key = getTimerStorageKey(workoutId, date);
      const persisted = await getItem<PersistedTimerState>(key);

      if (persisted && persisted.workoutId === workoutId && persisted.dateISO === date) {
        // Calculate elapsed time if timer was running
        if (persisted.timerState === 'running') {
          const lastTick = new Date(persisted.lastTickISO).getTime();
          const now = Date.now();
          const additionalSeconds = Math.floor((now - lastTick) / 1000);
          setElapsedSeconds(persisted.elapsedSeconds + additionalSeconds);
          setTimerState('running');
        } else {
          setElapsedSeconds(persisted.elapsedSeconds);
          setTimerState(persisted.timerState);
        }
      }
    } catch (error) {
      console.error('Failed to restore timer state:', error);
    } finally {
      setTimerRestored(true);
    }
  };

  const persistTimerState = async (seconds: number, state: TimerState) => {
    try {
      const key = getTimerStorageKey(workoutId, date);
      const persisted: PersistedTimerState = {
        workoutId,
        dateISO: date,
        elapsedSeconds: seconds,
        timerState: state,
        lastTickISO: new Date().toISOString(),
      };
      await setItem(key, persisted);
    } catch (error) {
      console.error('Failed to persist timer state:', error);
    }
  };

  const clearTimerState = async () => {
    try {
      const key = getTimerStorageKey(workoutId, date);
      await setItem(key, null);
    } catch (error) {
      console.error('Failed to clear timer state:', error);
    }
  };

  // Timer handlers
  const handleStart = useCallback(() => {
    setTimerState('running');
    persistTimerState(elapsedSeconds, 'running');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds]);

  const handlePause = useCallback(() => {
    setTimerState('paused');
    persistTimerState(elapsedSeconds, 'paused');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds]);

  const handleResume = useCallback(() => {
    setTimerState('running');
    persistTimerState(elapsedSeconds, 'running');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds]);

  const handleFinish = useCallback(async () => {
    // Log activity session
    if (elapsedSeconds > 0) {
      try {
        await logSession('workout', date, elapsedSeconds);
      } catch (error) {
        console.error('Failed to log workout session:', error);
      }
    }

    // Reset timer
    setTimerState('idle');
    setElapsedSeconds(0);
    await clearTimerState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds, date]);

  // Movement expansion toggle
  const toggleMovementExpanded = useCallback((movementId: string) => {
    setExpandedMovements((prev) => {
      const next = new Set(prev);
      if (next.has(movementId)) {
        next.delete(movementId);
      } else {
        next.add(movementId);
      }
      return next;
    });
  }, []);

  // Log result handlers
  const handleLogResultPress = useCallback((movement: EnrichedMovement) => {
    setSelectedMovement(movement);
    setLogResultVisible(true);
  }, []);

  const handleSubmitResult = useCallback(async (score: ScoreValue) => {
    if (!selectedMovement) return;

    try {
      // Map ScoreValue to repository format
      let value: { valueNumber?: number; valueTimeSeconds?: number } = {};

      if (score.type === 'weight') {
        value.valueNumber = score.value;
      } else if (score.type === 'time') {
        value.valueTimeSeconds = score.seconds;
      } else if (score.type === 'completed') {
        // For completed, we use valueNumber as 1 or 0
        value.valueNumber = score.value ? 1 : 0;
      } else if (score.type === 'rounds-reps') {
        // Store as total reps (rounds * assumed reps per round + extra reps)
        value.valueNumber = score.rounds * 100 + score.reps;
      }

      await logResult(selectedMovement.exercise.id, trackId, date, value);
    } catch (error) {
      console.error('Failed to log result:', error);
    }

    setLogResultVisible(false);
    setSelectedMovement(null);
  }, [selectedMovement, trackId, date]);

  // Leaderboard handlers
  const handleViewResultsPress = useCallback(async (movement: EnrichedMovement) => {
    setLeaderboardMovement(movement);

    try {
      const entries = await getLeaderboardForExercise(
        movement.exercise.id,
        movement.exercise.sortDirection,
        10
      );
      setLeaderboardEntries(entries);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLeaderboardEntries([]);
    }

    setLeaderboardVisible(true);
  }, []);

  const handleCloseLeaderboard = useCallback(() => {
    setLeaderboardVisible(false);
    setLeaderboardMovement(null);
    setLeaderboardEntries([]);
  }, []);

  // Map exercise scoreType to WorkoutItem scoreType
  const mapScoreType = (exerciseScoreType: string): WorkoutItem['scoreType'] => {
    switch (exerciseScoreType) {
      case 'weight':
        return 'weight';
      case 'time':
        return 'time';
      case 'reps':
        return 'completed';
      default:
        return 'weight';
    }
  };

  if (loading || !timerRestored) {
    return (
      <ScreenContainer>
        <LoadingState fullScreen />
      </ScreenContainer>
    );
  }

  if (!workout) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <PrimaryButton label="Go Back" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹ Back</Text>
          </Pressable>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.date}>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Compact Session Timer */}
        <CompactSessionTimer
          state={timerState}
          duration={elapsedSeconds}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onFinish={handleFinish}
        />

        {/* Movements */}
        <Text style={styles.sectionTitle}>Movements</Text>
        {workout.movements.length === 0 ? (
          <View style={styles.noMovements}>
            <Text style={styles.noMovementsText}>No movements scheduled</Text>
          </View>
        ) : (
          workout.movements.map((movement) => (
            <ExpandableMovementTile
              key={movement.id}
              exerciseTitle={movement.exercise.title}
              targetText={movement.targetText}
              notes={movement.notes}
              scoreType={movement.exercise.scoreType}
              isExpanded={expandedMovements.has(movement.id)}
              onToggle={() => toggleMovementExpanded(movement.id)}
              onLogResult={() => handleLogResultPress(movement)}
              onViewResults={() => handleViewResultsPress(movement)}
            />
          ))
        )}
      </ScrollView>

      {/* Log Result Modal */}
      <LogResultModal
        visible={logResultVisible}
        item={
          selectedMovement
            ? {
                id: selectedMovement.id,
                name: selectedMovement.exercise.title,
                scoreType: mapScoreType(selectedMovement.exercise.scoreType),
                description: selectedMovement.targetText,
              }
            : null
        }
        onClose={() => {
          setLogResultVisible(false);
          setSelectedMovement(null);
        }}
        onSubmit={handleSubmitResult}
      />

      {/* Exercise Leaderboard Modal */}
      {leaderboardMovement && (
        <ExerciseLeaderboardModal
          visible={leaderboardVisible}
          exerciseTitle={leaderboardMovement.exercise.title}
          scoreType={leaderboardMovement.exercise.scoreType}
          sortDirection={leaderboardMovement.exercise.sortDirection}
          entries={leaderboardEntries}
          onClose={handleCloseLeaderboard}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.lg,
  },
  errorText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  backButton: {
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...tokens.typography.body,
    color: tokens.colors.tint,
    fontWeight: '600',
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  date: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  noMovements: {
    paddingVertical: tokens.spacing.xl * 2,
    alignItems: 'center',
  },
  noMovementsText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
});
