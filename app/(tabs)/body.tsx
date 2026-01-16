import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { tokens } from '@/design/tokens';
import {
  TrainingStatsSection,
  MajorMovementsTiles,
  TrackPickerButton,
  TrackPickerModal,
  WeekStrip,
  SessionTimer,
  MovementCard,
  InlineLogModal,
  ExerciseLeaderboardModal,
  PRInputModal,
  type TimerState,
} from '@/features/body';
import type { MajorMovement } from '@/features/body/types';
import {
  useActiveTrack,
  useTrainingDay,
  useMajorMovements,
  useTrainingStats,
  type EnrichedMovement,
} from '@/features/body/hooks';
import type { BodyView } from '@/features/body/types';
import type { TrainingTrack } from '@/lib/training/types';
import { getTodayISO } from '@/lib/repositories/TrainingRepo';
import { logSession } from '@/lib/repositories/ActivityRepo';
import { logResult, getLeaderboardForExercise, type LeaderboardEntry } from '@/lib/repositories/ResultsRepo';
import { useToast } from '@/components/ui/Toast';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import type { Profile } from '@/lib/training/types';

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
  const [weekOffset, setWeekOffset] = useState(0);
  const { showToast } = useToast();

  // Data hooks
  const { tracks, activeTrack, activeTrackId, setActiveTrackId, loading: tracksLoading, refreshing, refresh } = useActiveTrack();
  const { enrichedWorkouts, loading: workoutsLoading, reload: reloadWorkouts } = useTrainingDay(activeTrackId, selectedDate);
  const { movements: majorMovements, loading: movementsLoading } = useMajorMovements();
  const { stats: trainingStats, reload: reloadStats } = useTrainingStats();

  // Modals
  const [trackPickerVisible, setTrackPickerVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [prModalVisible, setPrModalVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<EnrichedMovement | null>(null);
  const [selectedPRMovement, setSelectedPRMovement] = useState<MajorMovement | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

  // Timer state
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timerDuration, setTimerDuration] = useState(0);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (timerState === 'running') {
      timerRef.current = setInterval(() => {
        setTimerDuration((prev) => prev + 1);
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
  }, [timerState]);

  // Timer handlers
  const handleTimerStart = (workoutId: string) => {
    setActiveWorkoutId(workoutId);
    setTimerState('running');
    setTimerDuration(0);
    sessionStartRef.current = new Date().toISOString();
  };

  const handleTimerPause = () => {
    setTimerState('paused');
  };

  const handleTimerResume = () => {
    setTimerState('running');
  };

  const handleTimerFinish = async () => {
    // Log the session
    if (timerDuration > 0) {
      await logSession('workout', selectedDate, timerDuration, {
        startedAtISO: sessionStartRef.current || undefined,
        endedAtISO: new Date().toISOString(),
      });
      reloadStats();

      const mins = Math.floor(timerDuration / 60);
      showToast(`Workout complete: ${mins}m logged`);
    }

    // Reset timer
    setTimerState('idle');
    setTimerDuration(0);
    setActiveWorkoutId(null);
    sessionStartRef.current = null;
  };

  // Get active workout title
  const activeWorkout = enrichedWorkouts.find((w) => w.id === activeWorkoutId);

  // Reload data every time screen comes into focus
  // Note: Don't call refresh() here as it triggers RefreshControl animation
  useFocusEffect(
    useCallback(() => {
      reloadWorkouts();
      reloadStats();
      // Load profile data
      Promise.all([getProfile(), getSupabaseProfile()]).then(([localProfile, sbProfile]) => {
        setProfile(localProfile);
        setSupabaseProfile(sbProfile);
      });
    }, [reloadWorkouts, reloadStats])
  );

  // Derived profile values
  const displayName = supabaseProfile?.display_name ?? profile?.displayName ?? 'Athlete';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const streakCount = profile?.onAppStreakDays ?? 0;

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'training' : 'profile');
  };

  const handleSelectTrack = async (track: TrainingTrack) => {
    await setActiveTrackId(track.id);
  };

  const handleMovementLog = (movement: EnrichedMovement) => {
    setSelectedMovement(movement);
    setLogModalVisible(true);
  };

  const handleLogSubmit = async (value: { valueNumber?: number; valueTimeSeconds?: number }) => {
    if (!selectedMovement || !activeTrackId) return;

    await logResult(
      selectedMovement.exercise.id,
      activeTrackId,
      selectedDate,
      value
    );

    showToast('Result logged');
    setLogModalVisible(false);
    setSelectedMovement(null);
  };

  const handleViewResults = async (movement: EnrichedMovement) => {
    setSelectedMovement(movement);

    // Fetch leaderboard entries
    const entries = await getLeaderboardForExercise(
      movement.exercise.id,
      movement.exercise.sortDirection,
      10
    );
    setLeaderboardEntries(entries);
    setLeaderboardVisible(true);
  };

  const handlePRPress = (movement: MajorMovement) => {
    setSelectedPRMovement(movement);
    setPrModalVisible(true);
  };

  const handlePRSubmit = async (value: number) => {
    if (!selectedPRMovement) return;

    // Log the PR as a result (uses the movement's exercise ID)
    await logResult(
      selectedPRMovement.id,
      activeTrackId || 'manual-entry',
      getTodayISO(),
      { valueNumber: value }
    );

    showToast('PR saved');
    setPrModalVisible(false);
    setSelectedPRMovement(null);
    // Note: majorMovements will update on next refresh/focus
  };

  const handleRefresh = async () => {
    await refresh();
    reloadWorkouts();
    reloadStats();
  };

  // Format total time for display
  const formatTotalTime = (seconds: number): string => {
    if (seconds === 0) return '—';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

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
          contentInsetAdjustmentBehavior="never"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.muted}
            />
          }
        >
          {/* Unified Header: Profile + KPI Bar */}
          <View style={styles.headerRow}>
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.profileContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>🔥{streakCount}</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <View style={styles.kpiBar}>
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>SESSIONS</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.action }]}>{trainingStats.totalSessions}</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>AVG. TIME</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.tint }]}>{formatTotalTime(trainingStats.avgSessionSeconds)}</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>TOTAL TIME</Text>
                <Text style={styles.kpiValue}>{formatTotalTime(trainingStats.totalTimeSeconds)}</Text>
              </View>
            </View>
          </View>

          {/* Session Timer - Always visible above segmented control */}
          <View style={styles.timerWrapper}>
            <SessionTimer
              state={timerState}
              duration={timerDuration}
              workoutTitle={activeWorkout?.title}
              onStart={() => {
                // Start with first workout if no workout selected
                if (enrichedWorkouts.length > 0) {
                  handleTimerStart(enrichedWorkouts[0].id);
                }
              }}
              onPause={handleTimerPause}
              onResume={handleTimerResume}
              onFinish={handleTimerFinish}
            />
          </View>

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
                weekOffset={weekOffset}
                onSelectDate={setSelectedDate}
                onPrevWeek={() => setWeekOffset((prev) => prev - 1)}
                onNextWeek={() => setWeekOffset((prev) => prev + 1)}
              />

              {workoutsLoading ? (
                <LoadingState message="Loading workouts" />
              ) : enrichedWorkouts.length > 0 ? (
                <View>
                  {enrichedWorkouts.map((workout) => (
                    <View key={workout.id}>
                      {/* Workout Header */}
                      <View style={styles.workoutHeaderRow}>
                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                        {timerState === 'idle' && (
                          <Text
                            style={styles.startWorkoutLink}
                            onPress={() => handleTimerStart(workout.id)}
                          >
                            Start
                          </Text>
                        )}
                      </View>

                      {/* Inline Movement Cards */}
                      {workout.movements.map((movement) => (
                        <MovementCard
                          key={movement.id}
                          exerciseTitle={movement.exercise.title}
                          targetText={movement.targetText}
                          notes={movement.notes}
                          scoreType={movement.exercise.scoreType}
                          onLog={() => handleMovementLog(movement)}
                          onViewResults={() => handleViewResults(movement)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              ) : (
                <EmptyState
                  icon="📋"
                  title="Rest Day"
                  message="No workouts scheduled. Use this time to recover or select a different day."
                />
              )}
            </View>
          ) : (
            <View>
              <TrainingStatsSection
                totalSessions={trainingStats.totalSessions}
                sessionsThisWeek={trainingStats.sessionsThisWeek}
                totalTimeSeconds={trainingStats.totalTimeSeconds}
                avgSessionSeconds={trainingStats.avgSessionSeconds}
              />
              <MajorMovementsTiles
                movements={majorMovements}
                onMovementPress={handlePRPress}
              />
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

        <InlineLogModal
          visible={logModalVisible}
          exerciseTitle={selectedMovement?.exercise.title || ''}
          scoreType={selectedMovement?.exercise.scoreType || 'weight'}
          onClose={() => {
            setLogModalVisible(false);
            setSelectedMovement(null);
          }}
          onSubmit={handleLogSubmit}
        />

        <ExerciseLeaderboardModal
          visible={leaderboardVisible}
          exerciseTitle={selectedMovement?.exercise.title || ''}
          scoreType={selectedMovement?.exercise.scoreType || 'weight'}
          sortDirection={selectedMovement?.exercise.sortDirection || 'desc'}
          entries={leaderboardEntries}
          onClose={() => {
            setLeaderboardVisible(false);
            setSelectedMovement(null);
            setLeaderboardEntries([]);
          }}
        />

        <PRInputModal
          visible={prModalVisible}
          movementName={selectedPRMovement?.name || ''}
          currentValue={selectedPRMovement?.bestWeight}
          onClose={() => {
            setPrModalVisible(false);
            setSelectedPRMovement(null);
          }}
          onSubmit={handlePRSubmit}
        />
      </ScreenContainer>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },

  // Unified Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
    marginHorizontal: 8,
    gap: tokens.spacing.sm,
  },
  profileContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: tokens.colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    minWidth: 28,
    alignItems: 'center',
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  kpiBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingVertical: tokens.spacing.xs + 2,
    paddingHorizontal: tokens.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiBlock: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: '800',
    color: tokens.colors.text,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.xs,
  },
  timerWrapper: {
    marginHorizontal: 8,
  },

  // Workout content
  workoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  workoutTitle: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
  },
  startWorkoutLink: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.tint,
  },
});
