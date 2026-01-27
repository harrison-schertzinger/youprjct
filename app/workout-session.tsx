import React, { useState, useCallback } from 'react';
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
} from '@/features/body';
import type { ScoreValue, WorkoutItem } from '@/features/body/types';
import { logSession } from '@/lib/repositories/ActivityRepo';
import { logResult, getLeaderboardForExercise, LeaderboardEntry } from '@/lib/repositories/ResultsRepo';
import { usePersistedTimer } from '@/hooks/usePersistedTimer';

export default function WorkoutSessionScreen() {
  const params = useLocalSearchParams<{
    workoutId: string;
    date: string;
    trackId: string;
  }>();

  const { workoutId, date, trackId } = params;

  const { enrichedWorkouts, loading } = useTrainingDay(trackId, date);
  const workout = enrichedWorkouts.find((w) => w.id === workoutId);

  // Timer using the persisted timer hook with workout-specific key
  // Key suffix scopes the timer to this specific workout on this date
  const timerKeySuffix = workoutId && date ? `${workoutId}:${date}` : undefined;
  const timer = usePersistedTimer('workout', { keySuffix: timerKeySuffix });

  // Expanded movements (track which ones are expanded)
  const [expandedMovements, setExpandedMovements] = useState<Set<string>>(new Set());

  // Log result modal
  const [logResultVisible, setLogResultVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<EnrichedMovement | null>(null);

  // Leaderboard modal
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [leaderboardMovement, setLeaderboardMovement] = useState<EnrichedMovement | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Timer handlers
  const handleStart = useCallback(async () => {
    await timer.start();
  }, [timer]);

  const handlePause = useCallback(async () => {
    await timer.pause();
  }, [timer]);

  const handleResume = useCallback(async () => {
    await timer.resume();
  }, [timer]);

  const handleFinish = useCallback(async () => {
    const finalDuration = await timer.stop();

    // Log activity session if there was any time tracked
    if (finalDuration > 0) {
      await logSession('workout', date, finalDuration);
    }
  }, [timer, date]);

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

    setLogResultVisible(false);
    setSelectedMovement(null);
  }, [selectedMovement, trackId, date]);

  // Leaderboard handlers
  const handleViewResultsPress = useCallback(async (movement: EnrichedMovement) => {
    setLeaderboardMovement(movement);

    const entries = await getLeaderboardForExercise(
      movement.exercise.id,
      movement.exercise.sortDirection,
      10
    );
    setLeaderboardEntries(entries);

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

  if (loading) {
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
          state={timer.status}
          duration={timer.duration}
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
