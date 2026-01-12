import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { tokens } from '@/design/tokens';
import {
  ProfileHeader,
  MajorMovementsTiles,
  TrackPickerButton,
  TrackPickerModal,
  WeekStrip,
  WorkoutTile,
} from '@/features/body';
import {
  useActiveTrack,
  useTrainingDay,
  useMajorMovements,
} from '@/features/body/hooks';
import type { BodyView } from '@/features/body/types';
import type { TrainingTrack } from '@/lib/training/types';
import { getTodayISO } from '@/lib/repositories/TrainingRepo';

export default function BodyScreen() {
  const [view, setView] = useState<BodyView>('profile');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayISO());

  // Data hooks
  const { tracks, activeTrack, activeTrackId, setActiveTrackId, loading: tracksLoading } = useActiveTrack();
  const { enrichedWorkouts, loading: workoutsLoading } = useTrainingDay(activeTrackId, selectedDate);
  const { movements: majorMovements, loading: movementsLoading } = useMajorMovements();

  // Modals
  const [trackPickerVisible, setTrackPickerVisible] = useState(false);

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'profile' : 'training');
  };

  const handleSelectTrack = async (track: TrainingTrack) => {
    await setActiveTrackId(track.id);
  };

  const handleWorkoutPress = (workoutId: string) => {
    if (!activeTrackId) return;
    router.push({
      pathname: '/workout-session',
      params: {
        workoutId,
        date: selectedDate,
        trackId: activeTrackId,
      },
    });
  };

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
            <MajorMovementsTiles movements={majorMovements} />
          </View>
        ) : (
          <View>
            <TrackPickerButton
              activeTrack={
                activeTrack
                  ? {
                      id: activeTrack.id,
                      name: activeTrack.title,
                      description: '',
                    }
                  : null
              }
              onPress={() => setTrackPickerVisible(true)}
            />

            <WeekStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {workoutsLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading workouts...</Text>
              </View>
            ) : enrichedWorkouts.length > 0 ? (
              <View>
                <Text style={styles.workoutsHeader}>
                  Workouts for{' '}
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                {enrichedWorkouts.map((workout) => (
                  <WorkoutTile
                    key={workout.id}
                    workout={{
                      id: workout.id,
                      title: workout.title,
                      description: `${workout.movements.length} movement${workout.movements.length !== 1 ? 's' : ''}`,
                      items: [],
                    }}
                    onPress={() => handleWorkoutPress(workout.id)}
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
        tracks={tracks.map((t) => ({
          id: t.id,
          name: t.title,
          description: '',
        }))}
        selectedTrackId={activeTrackId}
        onSelect={(track) => {
          const realTrack = tracks.find((t) => t.id === track.id);
          if (realTrack) {
            handleSelectTrack(realTrack);
          }
        }}
        onClose={() => setTrackPickerVisible(false)}
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
  loadingContainer: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
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
