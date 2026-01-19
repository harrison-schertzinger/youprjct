import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { AddTimeModal } from '@/components/ui/AddTimeModal';
import { SignatureButton } from '@/components/ui/SignatureButton';
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
} from '@/features/body';
import type { MajorMovement, BodyView } from '@/features/body/types';
import {
  useActiveTrack,
  useTrainingDay,
  useMajorMovements,
  useTrainingStats,
  type EnrichedMovement,
} from '@/features/body/hooks';
import {
  WorkoutCard,
  ScheduledWorkoutCard,
  WorkoutBuilderModal,
  WORKOUT_GRADIENTS,
  TEMPLATE_LABELS,
} from '@/features/workoutBuilder';
import {
  useCustomWorkouts,
  useEnrichedScheduledWorkouts,
  useExerciseLibrary,
} from '@/features/workoutBuilder/hooks';
import {
  createWorkout,
  updateWorkout,
  scheduleWorkout,
} from '@/features/workoutBuilder/storage';
import type { CustomWorkout } from '@/features/workoutBuilder/types';
import type { TrainingTrack, Profile } from '@/lib/training/types';
import { getTodayISO } from '@/lib/repositories/TrainingRepo';
import { logSession } from '@/lib/repositories/ActivityRepo';
import { logResult, getLeaderboardForExercise, type LeaderboardEntry } from '@/lib/repositories/ResultsRepo';
import { useToast } from '@/components/ui/Toast';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import { usePersistedTimer } from '@/hooks/usePersistedTimer';

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
  const { tracks, activeTrack, activeTrackId, setActiveTrackId, refreshing, refresh } = useActiveTrack();
  const { enrichedWorkouts, loading: workoutsLoading, reload: reloadWorkouts } = useTrainingDay(activeTrackId, selectedDate);
  const { movements: majorMovements, reload: reloadMajorMovements } = useMajorMovements();
  const { stats: trainingStats, reload: reloadStats } = useTrainingStats();

  // Modals
  const [trackPickerVisible, setTrackPickerVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [prModalVisible, setPrModalVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<EnrichedMovement | null>(null);
  const [selectedPRMovement, setSelectedPRMovement] = useState<MajorMovement | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Workout Builder
  const [workoutBuilderVisible, setWorkoutBuilderVisible] = useState(false);
  const [showAddWorkoutOptions, setShowAddWorkoutOptions] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<CustomWorkout | null>(null);
  const { workouts: customWorkouts, reload: reloadCustomWorkouts, remove: removeCustomWorkout } = useCustomWorkouts();
  const { scheduledWorkouts, reload: reloadScheduled } = useEnrichedScheduledWorkouts(selectedDate);
  const { exercises: exerciseLibrary } = useExerciseLibrary();

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

  // Timer state (persisted across background/foreground)
  const timer = usePersistedTimer('workout');
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [addTimeVisible, setAddTimeVisible] = useState(false);

  // Timer handlers
  const handleTimerStart = async (workoutId: string) => {
    setActiveWorkoutId(workoutId);
    await timer.start();
  };

  const handleTimerPause = async () => {
    await timer.pause();
  };

  const handleTimerResume = async () => {
    await timer.resume();
  };

  const handleTimerFinish = async () => {
    const finalDuration = await timer.stop();

    // Log the session
    if (finalDuration > 0) {
      const startTime = timer.startTime
        ? new Date(timer.startTime).toISOString()
        : new Date(Date.now() - finalDuration * 1000).toISOString();

      await logSession('workout', selectedDate, finalDuration, {
        startedAtISO: startTime,
        endedAtISO: new Date().toISOString(),
      });
      reloadStats();

      const mins = Math.floor(finalDuration / 60);
      showToast(`Workout complete: ${mins}m logged`);
    }

    // Reset state
    setActiveWorkoutId(null);
  };

  const handleAddTime = (seconds: number) => {
    timer.addManualTime(seconds);
  };

  // Get active workout title
  const activeWorkout = enrichedWorkouts.find((w) => w.id === activeWorkoutId);

  // Reload data every time screen comes into focus
  // Note: Don't call refresh() here as it triggers RefreshControl animation
  useFocusEffect(
    useCallback(() => {
      reloadWorkouts();
      reloadStats();
      reloadCustomWorkouts();
      reloadScheduled();
      // Load profile data
      Promise.all([getProfile(), getSupabaseProfile()])
        .then(([localProfile, sbProfile]) => {
          setProfile(localProfile);
          setSupabaseProfile(sbProfile);
        })
        .catch((error) => {
          console.error('Failed to load profile:', error);
        });
    }, [reloadWorkouts, reloadStats, reloadCustomWorkouts, reloadScheduled])
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
    // Reload major movements to show the new PR
    reloadMajorMovements();
  };

  const handleRefresh = async () => {
    await refresh();
    reloadWorkouts();
    reloadStats();
    reloadCustomWorkouts();
    reloadScheduled();
  };

  // Workout Builder handlers
  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setWorkoutBuilderVisible(true);
  };

  const handleEditWorkout = (workout: CustomWorkout) => {
    setEditingWorkout(workout);
    setWorkoutBuilderVisible(true);
  };

  const handleSaveWorkout = async (workoutData: Omit<CustomWorkout, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingWorkout) {
      await updateWorkout(editingWorkout.id, workoutData);
    } else {
      await createWorkout(
        workoutData.title,
        workoutData.templateType,
        workoutData.color,
        workoutData.exercises,
        {
          timeCap: workoutData.timeCap,
          rounds: workoutData.rounds,
          notes: workoutData.notes,
          isTemplate: workoutData.isTemplate,
        }
      );
    }
    reloadCustomWorkouts();
    showToast(editingWorkout ? 'Workout updated' : 'Workout created');
  };

  const handleScheduleWorkout = async (workoutId: string) => {
    await scheduleWorkout(workoutId, selectedDate);
    reloadScheduled();
    showToast('Workout scheduled');
  };

  // Format total time for display
  const formatTotalTime = (seconds: number): string => {
    if (seconds === 0) return '—';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Format date for display
  const formatDateForDisplay = (dateISO: string): string => {
    const today = getTodayISO();
    if (dateISO === today) return 'Today';
    const date = new Date(dateISO + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
              state={timer.status}
              duration={timer.duration}
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
              onAddTime={() => setAddTimeVisible(true)}
            />
          </View>

          <SegmentedControl
            segments={['Training', 'Profile']}
            selectedIndex={view === 'training' ? 0 : 1}
            onChange={handleViewChange}
          />

          {view === 'training' ? (
            <View>
              {/* Track Picker - Primary */}
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

              {/* Custom Workouts for This Day - Show First */}
              {scheduledWorkouts.length > 0 && (
                <View style={styles.customWorkoutsSection}>
                  {scheduledWorkouts.map((scheduled) => (
                    <ScheduledWorkoutCard
                      key={scheduled.id}
                      scheduled={scheduled}
                      onStart={() => {
                        showToast('Starting workout...');
                      }}
                      onDelete={async () => {
                        const { deleteScheduledWorkout } = await import('@/features/workoutBuilder/storage');
                        await deleteScheduledWorkout(scheduled.id);
                        reloadScheduled();
                      }}
                    />
                  ))}
                </View>
              )}

              {/* Track Workouts */}
              {workoutsLoading ? (
                <LoadingState message="Loading workouts" />
              ) : enrichedWorkouts.length > 0 ? (
                <View>
                  {enrichedWorkouts.map((workout) => (
                    <View key={workout.id}>
                      {/* Workout Header */}
                      <View style={styles.workoutHeaderRow}>
                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                        {timer.status === 'idle' && (
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
              ) : scheduledWorkouts.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="Rest Day"
                  message="No workouts scheduled. Use this time to recover or select a different day."
                />
              ) : null}

              {/* Add Workout Button */}
              <SignatureButton
                title="+ Add Workout"
                onPress={() => setShowAddWorkoutOptions(true)}
                fullWidth
                style={styles.addWorkoutButton}
              />

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

              {/* My Workouts Section in Profile */}
              <View style={styles.myWorkoutsProfileSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Workouts</Text>
                  <Pressable onPress={handleCreateWorkout}>
                    <Text style={styles.createNewBtn}>+ New</Text>
                  </Pressable>
                </View>

                {customWorkouts.filter(w => w.isTemplate).length > 0 ? (
                  <View style={styles.templatesGrid}>
                    {customWorkouts.filter(w => w.isTemplate).map((workout) => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        compact
                        onPress={() => handleEditWorkout(workout)}
                        onDelete={() => removeCustomWorkout(workout.id)}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyTemplates}>
                    <Text style={styles.emptyTemplatesText}>
                      Create reusable workout templates
                    </Text>
                    <Pressable style={styles.createFirstBtn} onPress={handleCreateWorkout}>
                      <Text style={styles.createFirstBtnText}>Create Workout</Text>
                    </Pressable>
                  </View>
                )}
              </View>
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

        <AddTimeModal
          visible={addTimeVisible}
          onClose={() => setAddTimeVisible(false)}
          onAdd={handleAddTime}
        />

        <WorkoutBuilderModal
          visible={workoutBuilderVisible}
          exercises={exerciseLibrary}
          editingWorkout={editingWorkout}
          onSave={handleSaveWorkout}
          onClose={() => {
            setWorkoutBuilderVisible(false);
            setEditingWorkout(null);
          }}
        />

        {/* Add Workout Options Modal */}
        <Modal
          visible={showAddWorkoutOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddWorkoutOptions(false)}
        >
          <Pressable
            style={styles.addOptionsOverlay}
            onPress={() => setShowAddWorkoutOptions(false)}
          >
            <View style={styles.addOptionsSheet}>
              <View style={styles.addOptionsHandle} />
              <Text style={styles.addOptionsTitle}>Add to {formatDateForDisplay(selectedDate)}</Text>

              {/* Create New Option */}
              <Pressable
                style={styles.addOption}
                onPress={() => {
                  setShowAddWorkoutOptions(false);
                  handleCreateWorkout();
                }}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>+</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionLabel}>Create New</Text>
                  <Text style={styles.addOptionDesc}>Build a custom workout</Text>
                </View>
              </Pressable>

              {/* Templates */}
              {customWorkouts.filter(w => w.isTemplate).length > 0 && (
                <>
                  <Text style={styles.templatesHeader}>From Templates</Text>
                  {customWorkouts.filter(w => w.isTemplate).map((workout) => (
                    <Pressable
                      key={workout.id}
                      style={styles.addOption}
                      onPress={() => {
                        setShowAddWorkoutOptions(false);
                        handleScheduleWorkout(workout.id);
                      }}
                    >
                      <View style={[styles.addOptionIcon, { backgroundColor: WORKOUT_GRADIENTS[workout.color].start }]}>
                        <Text style={styles.addOptionIconText}>{workout.title.charAt(0)}</Text>
                      </View>
                      <View style={styles.addOptionContent}>
                        <Text style={styles.addOptionLabel}>{workout.title}</Text>
                        <Text style={styles.addOptionDesc}>
                          {TEMPLATE_LABELS[workout.templateType]} • {workout.exercises.length} exercises
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </>
              )}

              <Pressable
                style={styles.cancelOption}
                onPress={() => setShowAddWorkoutOptions(false)}
              >
                <Text style={styles.cancelOptionText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
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

  // Custom Workouts Section (now at top)
  customWorkoutsSection: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },

  // Add Workout Button
  addWorkoutButton: {
    marginTop: tokens.spacing.lg,
  },

  // Profile Section - My Workouts
  myWorkoutsProfileSection: {
    marginTop: tokens.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
  },
  createNewBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.tint,
  },
  templatesGrid: {
    gap: tokens.spacing.sm,
  },
  emptyTemplates: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  emptyTemplatesText: {
    fontSize: 15,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.md,
  },
  createFirstBtn: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.tint,
    borderRadius: tokens.radius.sm,
  },
  createFirstBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Add Options Modal
  addOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  addOptionsSheet: {
    backgroundColor: tokens.colors.card,
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl + 20,
    maxHeight: '70%',
  },
  addOptionsHandle: {
    width: 36,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  addOptionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  addOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  addOptionIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addOptionContent: {
    flex: 1,
  },
  addOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  addOptionDesc: {
    fontSize: 13,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  templatesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },
  cancelOption: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  cancelOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
});
