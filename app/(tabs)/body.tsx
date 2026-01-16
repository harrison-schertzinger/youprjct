import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { KPIBar, type KPIStat } from '@/components/ui/KPIBar';
import { PageLabel } from '@/components/ui/PageLabel';
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

const BODY_BENEFITS = [
  {
    title: 'Training Tracks',
    description: 'Structured programming designed for progressive overload and long-term gains.',
  },
  {
    title: 'Movement Library',
    description: 'Track your major lifts with detailed exercise logging and PR tracking.',
  },
  {
    title: 'Workout Sessions',
    description: 'Guided workout timer with automatic rest periods and set tracking.',
  },
];

export default function BodyScreen() {
  const [view, setView] = useState<BodyView>('training');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayISO());

  // Data hooks
  const { tracks, activeTrack, activeTrackId, setActiveTrackId, loading: tracksLoading, refreshing, refresh } = useActiveTrack();
  const { enrichedWorkouts, loading: workoutsLoading, reload: reloadWorkouts } = useTrainingDay(activeTrackId, selectedDate);
  const { movements: majorMovements, loading: movementsLoading } = useMajorMovements();

  // Modals
  const [trackPickerVisible, setTrackPickerVisible] = useState(false);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
      reloadWorkouts();
    }, [refresh, reloadWorkouts])
  );

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'training' : 'profile');
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

  const handleRefresh = async () => {
    await refresh();
    reloadWorkouts();
  };

  // Calculate KPI stats
  // Note: Full workout history stats could be added via a dedicated hook
  const kpiStats = useMemo((): [KPIStat, KPIStat, KPIStat] => {
    const workoutsToday = enrichedWorkouts.length;
    return [
      { label: 'STREAK', value: '—', color: tokens.colors.action },
      { label: 'THIS WEEK', value: `${workoutsToday}`, color: tokens.colors.tint },
      { label: 'TOTAL TIME', value: '—' },
    ];
  }, [enrichedWorkouts]);

  return (
    <PremiumGate
      feature="Body"
      tagline="Training, recovery, readiness"
      benefits={BODY_BENEFITS}
    >
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.muted}
            />
          }
        >
          <PageLabel label="BODY" />
          <KPIBar stats={kpiStats} />

          <SegmentedControl
            segments={['Training', 'Profile']}
            selectedIndex={view === 'training' ? 0 : 1}
            onChange={handleViewChange}
          />

          {view === 'training' ? (
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
          ) : (
            <View>
              <ProfileHeader name="You" streak={12} />
              <MajorMovementsTiles movements={majorMovements} />
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
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
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
