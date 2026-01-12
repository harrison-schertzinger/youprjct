import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { tokens } from '@/design/tokens';
import {
  ProfileHeader,
  MajorMovementsTiles,
  TrackPickerButton,
  TrackPickerModal,
  WeekStrip,
  WorkoutSessionTimer,
  WorkoutTile,
  LogResultModal,
  LeaderboardModal,
} from '@/features/body';
import {
  mockTracks,
  mockWorkoutDays,
  mockMajorMovements,
  mockResults,
} from '@/features/body/mock';
import type {
  BodyView,
  Track,
  WorkoutItem,
  ScoreValue,
} from '@/features/body/types';

export default function BodyScreen() {
  const [view, setView] = useState<BodyView>('profile');
  const [activeTrack, setActiveTrack] = useState<Track | null>(mockTracks[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<Set<string>>(
    new Set()
  );

  // Modals
  const [trackPickerVisible, setTrackPickerVisible] = useState(false);
  const [logResultVisible, setLogResultVisible] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [selectedWorkoutItem, setSelectedWorkoutItem] =
    useState<WorkoutItem | null>(null);

  // Session timer
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'profile' : 'training');
  };

  const handleSelectTrack = (track: Track) => {
    setActiveTrack(track);
  };

  const handleToggleWorkout = (workoutId: string) => {
    setExpandedWorkoutIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const handleLogResult = (item: WorkoutItem) => {
    setSelectedWorkoutItem(item);
    setLogResultVisible(true);
  };

  const handleViewLeaderboard = (item: WorkoutItem) => {
    setSelectedWorkoutItem(item);
    setLeaderboardVisible(true);
  };

  const handleSubmitResult = (score: ScoreValue) => {
    // In v1 scaffold, we just log to console
    console.log('Result submitted:', { item: selectedWorkoutItem, score });
    // In production, this would save to backend/local storage
  };

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionDuration(0);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    // In production, save session duration to storage
    console.log('Session ended. Duration:', sessionDuration);
  };

  // Get workouts for selected date
  const workoutsForDate = mockWorkoutDays.find(
    (day) => day.date === selectedDate
  );

  // Filter results for selected workout item
  const resultsForItem = mockResults.filter(
    (result) => result.workoutItemId === selectedWorkoutItem?.id
  );

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Body</Text>
        <Text style={styles.subtitle}>Training, recovery, readiness</Text>

        <SegmentedControl
          segments={['Profile', 'Training']}
          selectedIndex={view === 'profile' ? 0 : 1}
          onChange={handleViewChange}
        />

        {view === 'profile' ? (
          <View>
            <ProfileHeader name="You" streak={12} />
            <MajorMovementsTiles movements={mockMajorMovements} />
          </View>
        ) : (
          <View>
            <TrackPickerButton
              activeTrack={activeTrack}
              onPress={() => setTrackPickerVisible(true)}
            />

            <WeekStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <WorkoutSessionTimer
              isActive={sessionActive}
              duration={sessionDuration}
              onStart={handleStartSession}
              onEnd={handleEndSession}
            />

            {workoutsForDate ? (
              <View>
                <Text style={styles.workoutsHeader}>
                  Workouts for{' '}
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                {workoutsForDate.workouts.map((workout) => (
                  <WorkoutTile
                    key={workout.id}
                    workout={workout}
                    isExpanded={expandedWorkoutIds.has(workout.id)}
                    onToggle={() => handleToggleWorkout(workout.id)}
                    onLogResult={handleLogResult}
                    onViewLeaderboard={handleViewLeaderboard}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noWorkouts}>
                <Text style={styles.noWorkoutsText}>
                  No workouts scheduled for this day
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <TrackPickerModal
        visible={trackPickerVisible}
        tracks={mockTracks}
        selectedTrackId={activeTrack?.id || null}
        onSelect={handleSelectTrack}
        onClose={() => setTrackPickerVisible(false)}
      />

      <LogResultModal
        visible={logResultVisible}
        item={selectedWorkoutItem}
        onClose={() => setLogResultVisible(false)}
        onSubmit={handleSubmitResult}
      />

      <LeaderboardModal
        visible={leaderboardVisible}
        item={selectedWorkoutItem}
        results={resultsForItem}
        onClose={() => setLeaderboardVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xl,
  },
  workoutsHeader: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.md,
  },
  noWorkouts: {
    paddingVertical: tokens.spacing.xl * 2,
    alignItems: 'center',
  },
  noWorkoutsText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
});
