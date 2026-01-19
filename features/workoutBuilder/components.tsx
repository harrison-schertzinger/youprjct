// Workout Builder components

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { SignatureButton } from '@/components/ui/SignatureButton';
import type {
  CustomWorkout,
  WorkoutExercise,
  WorkoutTemplateType,
  WorkoutColor,
} from './types';
import { TEMPLATE_LABELS, WORKOUT_GRADIENTS } from './types';
import type { EnrichedScheduledWorkout } from './hooks';
import type { Exercise } from '@/lib/training/types';
import type { GoalColor } from '@/features/goals/types';

// ============================================================
// WorkoutCard - Premium gradient card for custom workouts
// ============================================================

type WorkoutCardProps = {
  workout: CustomWorkout;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  onSchedule?: () => void;
  compact?: boolean;
};

export function WorkoutCard({
  workout,
  onPress,
  onLongPress,
  onDelete,
  onSchedule,
  compact = false,
}: WorkoutCardProps) {
  const gradient = WORKOUT_GRADIENTS[workout.color];
  const exerciseCount = workout.exercises.length;

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onLongPress) {
      onLongPress();
    } else if (onDelete) {
      Alert.alert(
        'Delete Workout',
        `Are you sure you want to delete "${workout.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onDelete },
        ]
      );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.workoutCardContainer,
        pressed && styles.cardPressed,
        compact && styles.workoutCardCompact,
      ]}
    >
      <LinearGradient
        colors={[gradient.start, gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.workoutCardGradient, compact && styles.workoutCardGradientCompact]}
      >
        {/* Template Badge */}
        <View style={styles.templateBadge}>
          <Text style={styles.templateBadgeText}>
            {TEMPLATE_LABELS[workout.templateType]}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.workoutCardTitle, compact && styles.workoutCardTitleCompact]}>
          {workout.title}
        </Text>

        {/* Stats Row */}
        <View style={styles.workoutStatsRow}>
          <View style={styles.workoutStat}>
            <Text style={styles.workoutStatValue}>{exerciseCount}</Text>
            <Text style={styles.workoutStatLabel}>
              {exerciseCount === 1 ? 'Exercise' : 'Exercises'}
            </Text>
          </View>

          {workout.timeCap && (
            <View style={styles.workoutStat}>
              <Text style={styles.workoutStatValue}>
                {Math.floor(workout.timeCap / 60)}
              </Text>
              <Text style={styles.workoutStatLabel}>Min</Text>
            </View>
          )}

          {workout.rounds && (
            <View style={styles.workoutStat}>
              <Text style={styles.workoutStatValue}>{workout.rounds}</Text>
              <Text style={styles.workoutStatLabel}>Rounds</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {!compact && (onSchedule || onDelete) && (
          <View style={styles.workoutActions}>
            {onSchedule && (
              <Pressable style={styles.actionButton} onPress={onSchedule}>
                <Text style={styles.actionButtonText}>Schedule</Text>
              </Pressable>
            )}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// ============================================================
// ScheduledWorkoutCard - Compact card for scheduled workouts
// ============================================================

type ScheduledWorkoutCardProps = {
  scheduled: EnrichedScheduledWorkout;
  onStart?: () => void;
  onDelete?: () => void;
};

export function ScheduledWorkoutCard({
  scheduled,
  onStart,
  onDelete,
}: ScheduledWorkoutCardProps) {
  const { workout } = scheduled;
  const gradient = WORKOUT_GRADIENTS[workout.color];
  const isCompleted = !!scheduled.completedAt;

  return (
    <Pressable
      onPress={onStart}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onDelete) {
          Alert.alert(
            'Remove Workout',
            'Remove this scheduled workout?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: onDelete },
            ]
          );
        }
      }}
      delayLongPress={500}
      style={[styles.scheduledCard, isCompleted && styles.scheduledCardCompleted]}
    >
      <View style={[styles.scheduledAccent, { backgroundColor: gradient.start }]} />
      <View style={styles.scheduledContent}>
        <View style={styles.scheduledHeader}>
          <Text style={styles.scheduledTitle}>{workout.title}</Text>
          <Text style={styles.scheduledBadge}>{TEMPLATE_LABELS[workout.templateType]}</Text>
        </View>
        <Text style={styles.scheduledMeta}>
          {workout.exercises.length} exercises
          {workout.timeCap && ` • ${Math.floor(workout.timeCap / 60)} min`}
        </Text>
      </View>
      {isCompleted ? (
        <View style={styles.completedBadge}>
          <Text style={styles.completedCheck}>✓</Text>
        </View>
      ) : (
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
        </View>
      )}
    </Pressable>
  );
}

// ============================================================
// TemplateTypeSelector
// ============================================================

type TemplateTypeSelectorProps = {
  selected: WorkoutTemplateType;
  onChange: (type: WorkoutTemplateType) => void;
};

export function TemplateTypeSelector({ selected, onChange }: TemplateTypeSelectorProps) {
  const types: WorkoutTemplateType[] = ['strength', 'amrap', 'emom', 'forTime'];

  return (
    <View style={styles.templateSelector}>
      {types.map((type) => (
        <Pressable
          key={type}
          style={[
            styles.templateOption,
            selected === type && styles.templateOptionSelected,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(type);
          }}
        >
          <Text
            style={[
              styles.templateOptionText,
              selected === type && styles.templateOptionTextSelected,
            ]}
          >
            {TEMPLATE_LABELS[type]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================================
// ExercisePickerModal
// ============================================================

type ExercisePickerModalProps = {
  visible: boolean;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
};

export function ExercisePickerModal({
  visible,
  exercises,
  onSelect,
  onClose,
}: ExercisePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(exercises.map((e) => e.category).filter(Boolean))
  ) as string[];

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (exercise: Exercise) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(exercise);
    setSearchQuery('');
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Add Exercise</Text>
            <Pressable onPress={onClose} style={styles.pickerClose}>
              <Text style={styles.pickerCloseText}>Cancel</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={tokens.colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              <Pressable
                style={[
                  styles.categoryChip,
                  !selectedCategory && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    !selectedCategory && styles.categoryChipTextSelected,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <ScrollView style={styles.exerciseList}>
            {filteredExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={styles.exerciseRow}
                onPress={() => handleSelect(exercise)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  {exercise.category && (
                    <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                  )}
                </View>
                <Text style={styles.exerciseAdd}>+</Text>
              </Pressable>
            ))}
            {filteredExercises.length === 0 && (
              <Text style={styles.noResults}>No exercises found</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ============================================================
// WorkoutBuilderModal
// ============================================================

type WorkoutBuilderModalProps = {
  visible: boolean;
  exercises: Exercise[];
  editingWorkout?: CustomWorkout | null;
  onSave: (workout: Omit<CustomWorkout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
};

export function WorkoutBuilderModal({
  visible,
  exercises,
  editingWorkout,
  onSave,
  onClose,
}: WorkoutBuilderModalProps) {
  const [title, setTitle] = useState('');
  const [templateType, setTemplateType] = useState<WorkoutTemplateType>('strength');
  const [color, setColor] = useState<GoalColor>('ocean');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [timeCap, setTimeCap] = useState('');
  const [rounds, setRounds] = useState('');
  const [notes, setNotes] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);
      setTemplateType(editingWorkout.templateType);
      setColor(editingWorkout.color);
      setWorkoutExercises([...editingWorkout.exercises]);
      setTimeCap(editingWorkout.timeCap ? String(editingWorkout.timeCap / 60) : '');
      setRounds(editingWorkout.rounds ? String(editingWorkout.rounds) : '');
      setNotes(editingWorkout.notes || '');
    } else {
      resetForm();
    }
  }, [editingWorkout, visible]);

  const resetForm = () => {
    setTitle('');
    setTemplateType('strength');
    setColor('ocean');
    setWorkoutExercises([]);
    setTimeCap('');
    setRounds('');
    setNotes('');
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      id: `we-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      order: workoutExercises.length,
    };
    setWorkoutExercises([...workoutExercises, newExercise]);
  };

  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises(workoutExercises.filter((e) => e.id !== id));
  };

  const handleUpdateExercise = (id: string, updates: Partial<WorkoutExercise>) => {
    setWorkoutExercises(
      workoutExercises.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a workout title.');
      return;
    }

    if (workoutExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    onSave({
      title: title.trim(),
      templateType,
      color,
      exercises: workoutExercises,
      timeCap: timeCap ? parseInt(timeCap, 10) * 60 : undefined,
      rounds: rounds ? parseInt(rounds, 10) : undefined,
      notes: notes.trim() || undefined,
      isTemplate: true,
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.builderOverlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.builderKeyboard}
        >
          <Pressable style={styles.builderModal} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.builderTitle}>
                {editingWorkout ? 'Edit Workout' : 'Create Workout'}
              </Text>

              {/* Title */}
              <Text style={styles.inputLabel}>Workout Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Strength"
                placeholderTextColor={tokens.colors.muted}
                value={title}
                onChangeText={setTitle}
                maxLength={40}
              />

              {/* Template Type */}
              <Text style={styles.inputLabel}>Workout Type</Text>
              <TemplateTypeSelector selected={templateType} onChange={setTemplateType} />

              {/* Time/Rounds based on type */}
              {(templateType === 'amrap' || templateType === 'forTime') && (
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Time Cap (min)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="20"
                      placeholderTextColor={tokens.colors.muted}
                      value={timeCap}
                      onChangeText={setTimeCap}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              )}

              {templateType === 'emom' && (
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Rounds</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="10"
                      placeholderTextColor={tokens.colors.muted}
                      value={rounds}
                      onChangeText={setRounds}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              )}

              {/* Color */}
              <ColorPicker selectedColor={color} onSelectColor={setColor} />

              {/* Exercises */}
              <View style={styles.exercisesSection}>
                <View style={styles.exercisesSectionHeader}>
                  <Text style={styles.inputLabel}>Exercises</Text>
                  <Pressable onPress={() => setShowExercisePicker(true)}>
                    <Text style={styles.addExerciseBtn}>+ Add</Text>
                  </Pressable>
                </View>

                {workoutExercises.length === 0 ? (
                  <Text style={styles.noExercisesText}>
                    Tap "+ Add" to add exercises
                  </Text>
                ) : (
                  workoutExercises.map((we, index) => (
                    <View key={we.id} style={styles.exerciseItem}>
                      <View style={styles.exerciseItemHeader}>
                        <Text style={styles.exerciseItemNumber}>{index + 1}</Text>
                        <Text style={styles.exerciseItemTitle}>{we.exerciseTitle}</Text>
                        <Pressable onPress={() => handleRemoveExercise(we.id)}>
                          <Text style={styles.removeExercise}>×</Text>
                        </Pressable>
                      </View>
                      <View style={styles.exerciseItemInputs}>
                        <TextInput
                          style={styles.exerciseSmallInput}
                          placeholder="Sets"
                          placeholderTextColor={tokens.colors.muted}
                          value={we.sets?.toString() || ''}
                          onChangeText={(v) =>
                            handleUpdateExercise(we.id, { sets: v ? parseInt(v, 10) : undefined })
                          }
                          keyboardType="number-pad"
                        />
                        <TextInput
                          style={styles.exerciseSmallInput}
                          placeholder="Reps"
                          placeholderTextColor={tokens.colors.muted}
                          value={we.reps || ''}
                          onChangeText={(v) => handleUpdateExercise(we.id, { reps: v })}
                        />
                        <TextInput
                          style={[styles.exerciseSmallInput, { flex: 1 }]}
                          placeholder="Weight/Notes"
                          placeholderTextColor={tokens.colors.muted}
                          value={we.weight || ''}
                          onChangeText={(v) => handleUpdateExercise(we.id, { weight: v })}
                        />
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Notes */}
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Workout instructions or notes"
                placeholderTextColor={tokens.colors.muted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
              />

              {/* Actions */}
              <View style={styles.builderActions}>
                <Pressable style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>
                    {editingWorkout ? 'Save Changes' : 'Create Workout'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>

      {/* Exercise Picker Sub-Modal */}
      <ExercisePickerModal
        visible={showExercisePicker}
        exercises={exercises}
        onSelect={handleAddExercise}
        onClose={() => setShowExercisePicker(false)}
      />
    </Modal>
  );
}

// ============================================================
// Empty State for My Workouts
// ============================================================

type EmptyWorkoutsStateProps = {
  onCreateWorkout: () => void;
};

export function EmptyWorkoutsState({ onCreateWorkout }: EmptyWorkoutsStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💪</Text>
      <Text style={styles.emptyTitle}>No Custom Workouts</Text>
      <Text style={styles.emptySubtitle}>
        Create your own workouts with any exercises from the library
      </Text>
      <SignatureButton
        title="Create Workout"
        onPress={onCreateWorkout}
        size="large"
      />
    </View>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  // WorkoutCard
  workoutCardContainer: {
    marginBottom: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? tokens.shadow.ios : tokens.shadow.android),
  },
  workoutCardCompact: {
    marginBottom: tokens.spacing.sm,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  workoutCardGradient: {
    padding: tokens.spacing.lg,
    minHeight: 140,
  },
  workoutCardGradientCompact: {
    padding: tokens.spacing.md,
    minHeight: 100,
  },
  templateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.sm,
  },
  templateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: tokens.spacing.sm,
  },
  workoutCardTitleCompact: {
    fontSize: 18,
  },
  workoutStatsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  workoutStat: {
    alignItems: 'center',
  },
  workoutStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  workoutStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: tokens.spacing.md,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ScheduledWorkoutCard
  scheduledCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  scheduledCardCompleted: {
    opacity: 0.6,
  },
  scheduledAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  scheduledContent: {
    flex: 1,
    padding: tokens.spacing.md,
  },
  scheduledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  scheduledTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  scheduledBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: tokens.colors.muted,
    textTransform: 'uppercase',
  },
  scheduledMeta: {
    fontSize: 13,
    color: tokens.colors.muted,
    marginTop: 2,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  completedCheck: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: tokens.colors.tint,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.spacing.md,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // TemplateTypeSelector
  templateSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.md,
  },
  templateOption: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  templateOptionSelected: {
    backgroundColor: tokens.colors.tint,
    borderColor: tokens.colors.tint,
  },
  templateOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  templateOptionTextSelected: {
    color: '#FFFFFF',
  },

  // ExercisePickerModal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: tokens.colors.card,
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    maxHeight: '80%',
    paddingBottom: tokens.spacing.xl,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  pickerClose: {
    padding: tokens.spacing.xs,
  },
  pickerCloseText: {
    fontSize: 16,
    color: tokens.colors.tint,
    fontWeight: '600',
  },
  searchInput: {
    height: 44,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    marginHorizontal: tokens.spacing.md,
    marginTop: tokens.spacing.md,
    fontSize: 16,
    color: tokens.colors.text,
  },
  categoryScroll: {
    marginTop: tokens.spacing.sm,
  },
  categoryScrollContent: {
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginRight: tokens.spacing.xs,
  },
  categoryChipSelected: {
    backgroundColor: tokens.colors.tint,
    borderColor: tokens.colors.tint,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: tokens.colors.muted,
    textTransform: 'capitalize',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  exerciseList: {
    marginTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: tokens.colors.text,
  },
  exerciseCategory: {
    fontSize: 12,
    color: tokens.colors.muted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  exerciseAdd: {
    fontSize: 24,
    fontWeight: '600',
    color: tokens.colors.tint,
    paddingLeft: tokens.spacing.md,
  },
  noResults: {
    textAlign: 'center',
    color: tokens.colors.muted,
    paddingVertical: tokens.spacing.xl,
  },

  // WorkoutBuilderModal
  builderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  builderKeyboard: {
    width: '100%',
    alignItems: 'center',
    maxHeight: '90%',
  },
  builderModal: {
    width: '92%',
    maxHeight: '100%',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
  },
  builderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    fontSize: 16,
    color: tokens.colors.text,
    backgroundColor: tokens.colors.bg,
    marginBottom: tokens.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  notesInput: {
    height: 60,
    paddingTop: tokens.spacing.sm,
    textAlignVertical: 'top',
  },
  exercisesSection: {
    marginBottom: tokens.spacing.md,
  },
  exercisesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  addExerciseBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.tint,
  },
  noExercisesText: {
    textAlign: 'center',
    color: tokens.colors.muted,
    paddingVertical: tokens.spacing.md,
    fontSize: 14,
  },
  exerciseItem: {
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.sm,
    padding: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  exerciseItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  exerciseItemNumber: {
    width: 20,
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  exerciseItemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  removeExercise: {
    fontSize: 22,
    fontWeight: '600',
    color: tokens.colors.muted,
    paddingHorizontal: tokens.spacing.xs,
  },
  exerciseItemInputs: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginLeft: 20,
  },
  exerciseSmallInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.sm,
    fontSize: 14,
    color: tokens.colors.text,
    backgroundColor: tokens.colors.card,
  },
  builderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.tint,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // EmptyState
  emptyState: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
    paddingHorizontal: tokens.spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: tokens.spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    lineHeight: 22,
  },
});
