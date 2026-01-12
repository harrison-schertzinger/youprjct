import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import type { EnrichedWorkout, EnrichedMovement } from '@/features/body/hooks';
import { useTrainingDay } from '@/features/body/hooks';
import { LogResultModal } from '@/features/body';
import type { ScoreValue } from '@/features/body/types';

export default function WorkoutSessionScreen() {
  const params = useLocalSearchParams<{
    workoutId: string;
    date: string;
    trackId: string;
  }>();

  const { workoutId, date, trackId } = params;

  const { enrichedWorkouts, loading } = useTrainingDay(trackId, date);
  const workout = enrichedWorkouts.find((w) => w.id === workoutId);

  // Session timer
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Result logging
  const [logResultVisible, setLogResultVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<EnrichedMovement | null>(null);

  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
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
  }, [sessionActive]);

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionDuration(0);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    console.log('Session ended. Duration:', sessionDuration);
  };

  const handleLogResult = (movement: EnrichedMovement) => {
    setSelectedMovement(movement);
    setLogResultVisible(true);
  };

  const handleSubmitResult = (score: ScoreValue) => {
    console.log('Result submitted:', { movement: selectedMovement, score });
    // In production, save to repository
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
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

        {/* Session Timer */}
        <Card style={styles.sessionTimer}>
          <View style={styles.sessionTimerContent}>
            <View>
              <Text style={styles.sessionTimerLabel}>Workout Session</Text>
              {sessionActive && (
                <Text style={styles.sessionTimerDuration}>{formatTime(sessionDuration)}</Text>
              )}
            </View>
            <PrimaryButton
              label={sessionActive ? 'End' : 'Start'}
              onPress={sessionActive ? handleEndSession : handleStartSession}
              style={styles.sessionTimerButton}
            />
          </View>
        </Card>

        {/* Movements */}
        <View>
          <Text style={styles.sectionTitle}>Movements</Text>
          {workout.movements.map((movement) => (
            <MovementCard
              key={movement.id}
              movement={movement}
              onLogResult={() => handleLogResult(movement)}
            />
          ))}
        </View>

        {workout.movements.length === 0 && (
          <View style={styles.noMovements}>
            <Text style={styles.noMovementsText}>No movements scheduled</Text>
          </View>
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
                scoreType: selectedMovement.exercise.scoreType === 'reps' ? 'completed' : selectedMovement.exercise.scoreType,
                description: selectedMovement.targetText,
              }
            : null
        }
        onClose={() => setLogResultVisible(false)}
        onSubmit={handleSubmitResult}
      />
    </ScreenContainer>
  );
}

type MovementCardProps = {
  movement: EnrichedMovement;
  onLogResult: () => void;
};

function MovementCard({ movement, onLogResult }: MovementCardProps) {
  return (
    <Card style={styles.movementCard}>
      <View style={styles.movementHeader}>
        <View style={styles.movementInfo}>
          <Text style={styles.movementName}>{movement.exercise.title}</Text>
          {movement.targetText && (
            <Text style={styles.movementTarget}>{movement.targetText}</Text>
          )}
          {movement.notes && (
            <Text style={styles.movementNotes}>{movement.notes}</Text>
          )}
        </View>
        <Pressable style={styles.logButton} onPress={onLogResult}>
          <Text style={styles.logButtonText}>Log</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
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
    marginBottom: tokens.spacing.xl,
  },
  backButton: {
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
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
  sessionTimer: {
    marginBottom: tokens.spacing.xl,
  },
  sessionTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionTimerLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: 2,
  },
  sessionTimerDuration: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
  },
  sessionTimerButton: {
    width: 100,
    height: 44,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  movementCard: {
    marginBottom: tokens.spacing.md,
  },
  movementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  movementInfo: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  movementName: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: 2,
  },
  movementTarget: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    marginBottom: 2,
  },
  movementNotes: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    fontStyle: 'italic',
  },
  logButton: {
    paddingHorizontal: tokens.spacing.md,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.tint,
    borderRadius: tokens.radius.sm,
  },
  logButtonText: {
    ...tokens.typography.small,
    color: '#FFFFFF',
    fontWeight: '700',
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
