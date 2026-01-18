// Goals feature components
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';
import { ColorPicker } from '@/components/ui/ColorPicker';
import {
  Goal,
  GoalType,
  GoalColor,
  GOAL_GRADIENTS,
  GOAL_TYPE_COLORS,
} from './types';
import { getGoalAge, getStepProgress } from '@/lib/goals';

// ============================================================
// GoalCard - Premium gradient card with expandable steps
// ============================================================

type GoalCardProps = {
  goal: Goal;
  tasksCompleted: number;
  taskStreak?: number;
  onLongPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onAddStep?: (title: string) => void;
  onToggleStep?: (stepId: string) => void;
  onDeleteStep?: (stepId: string) => void;
};

export function GoalCard({
  goal,
  tasksCompleted,
  taskStreak = 0,
  onLongPress,
  onDelete,
  onEdit,
  onAddStep,
  onToggleStep,
  onDeleteStep,
}: GoalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const gradient = GOAL_GRADIENTS[goal.color];
  const age = getGoalAge(goal);
  const progress = getStepProgress(goal);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onLongPress) {
      Alert.alert(
        'Complete Goal',
        `Mark "${goal.title}" as achieved?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete',
            style: 'default',
            onPress: onLongPress,
          },
        ]
      );
    }
  };

  const handleAddStep = () => {
    if (newStepTitle.trim() && onAddStep) {
      onAddStep(newStepTitle.trim());
      setNewStepTitle('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleToggleStep = (stepId: string) => {
    if (onToggleStep) {
      onToggleStep(stepId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && !expanded && styles.cardPressed,
      ]}
    >
      <LinearGradient
        colors={[gradient.start, gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* Data Bar */}
        <View style={styles.dataBar}>
          <View style={styles.dataStat}>
            <Text style={styles.dataEmoji}>📅</Text>
            <Text style={styles.dataValue}>{age}</Text>
            <Text style={styles.dataLabel}>Days</Text>
          </View>
          <View style={styles.dataStat}>
            <Text style={styles.dataEmoji}>🔥</Text>
            <Text style={styles.dataValue}>{taskStreak}</Text>
            <Text style={styles.dataLabel}>Streak</Text>
          </View>
          <View style={styles.dataStat}>
            <Text style={styles.dataEmoji}>✅</Text>
            <Text style={styles.dataValue}>{tasksCompleted}</Text>
            <Text style={styles.dataLabel}>Tasks</Text>
          </View>
          <View style={styles.cardActions}>
            {onEdit && (
              <Pressable
                style={styles.actionBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Text style={styles.actionIcon}>✎</Text>
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                style={styles.actionBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert(
                    'Delete Goal',
                    `Are you sure you want to delete "${goal.title}"?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: onDelete },
                    ]
                  );
                }}
              >
                <Text style={styles.deleteText}>×</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Title Row with Expand Toggle */}
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={styles.titleRow}
        >
          <Text style={styles.cardTitle}>{goal.title}</Text>
          <Text style={styles.expandChevron}>{expanded ? '▾' : '▸'}</Text>
        </Pressable>

        {/* Progress Bar (always visible if steps exist) */}
        {goal.steps.length > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(progress.percentage, 3)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress.completed}/{progress.total} steps
            </Text>
          </View>
        )}

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.expandedContent}>
            {/* Outcome */}
            {goal.outcome ? (
              <Text style={styles.cardOutcome}>{goal.outcome}</Text>
            ) : null}

            {/* Whys (Your Fuel) */}
            {goal.whys.length > 0 && (
              <View style={styles.whysContainer}>
                <Text style={styles.whysLabel}>Your Fuel</Text>
                {goal.whys.map((why, index) => (
                  <View key={index} style={styles.whyRow}>
                    <Text style={styles.whyBullet}>•</Text>
                    <Text style={styles.whyText}>{why}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Steps Section */}
            <View style={styles.stepsSection}>
              <Text style={styles.stepsLabel}>Steps</Text>

              {/* Existing Steps */}
              {goal.steps.map((step) => (
                <View key={step.id} style={styles.stepRow}>
                  <Pressable
                    style={[
                      styles.stepCheckbox,
                      step.completed && styles.stepCheckboxChecked,
                    ]}
                    onPress={() => handleToggleStep(step.id)}
                  >
                    {step.completed && <Text style={styles.stepCheck}>✓</Text>}
                  </Pressable>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleCompleted,
                    ]}
                  >
                    {step.title}
                  </Text>
                  {onDeleteStep && (
                    <Pressable
                      style={styles.stepDeleteBtn}
                      onPress={() => onDeleteStep(step.id)}
                    >
                      <Text style={styles.stepDeleteText}>×</Text>
                    </Pressable>
                  )}
                </View>
              ))}

              {/* Add Step Input */}
              {onAddStep && (
                <View style={styles.addStepRow}>
                  <TextInput
                    style={styles.addStepInput}
                    placeholder="Add a step..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={newStepTitle}
                    onChangeText={setNewStepTitle}
                    onSubmitEditing={handleAddStep}
                    returnKeyType="done"
                  />
                  <Pressable
                    style={[
                      styles.addStepBtn,
                      !newStepTitle.trim() && styles.addStepBtnDisabled,
                    ]}
                    onPress={handleAddStep}
                    disabled={!newStepTitle.trim()}
                  >
                    <Text style={styles.addStepBtnText}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Long press hint */}
            <Text style={styles.longPressHint}>Hold to complete goal</Text>
          </View>
        )}

        {/* Collapsed hint */}
        {!expanded && goal.steps.length === 0 && (
          <Text style={styles.tapHint}>Tap to expand</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// ============================================================
// CompletedGoalCard - Simpler card for completed goals
// ============================================================

type CompletedGoalCardProps = {
  goal: Goal;
  onUncomplete?: () => void;
};

export function CompletedGoalCard({ goal, onUncomplete }: CompletedGoalCardProps) {
  const gradient = GOAL_GRADIENTS[goal.color];
  const completedDate = goal.completedAt
    ? new Date(goal.completedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Pressable
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onUncomplete) {
          Alert.alert(
            'Restore Goal',
            `Move "${goal.title}" back to active goals?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Restore', onPress: onUncomplete },
            ]
          );
        }
      }}
      delayLongPress={500}
      style={styles.completedCard}
    >
      <View style={[styles.completedBadge, { backgroundColor: gradient.start }]}>
        <Text style={styles.completedCheck}>✓</Text>
      </View>
      <View style={styles.completedContent}>
        <Text style={styles.completedTitle}>{goal.title}</Text>
        {completedDate && (
          <Text style={styles.completedDate}>Achieved {completedDate}</Text>
        )}
      </View>
    </Pressable>
  );
}

// ============================================================
// EmptyGoalsState - Empty state when no goals exist
// ============================================================

type EmptyGoalsStateProps = {
  onAddGoal: () => void;
};

export function EmptyGoalsState({ onAddGoal }: EmptyGoalsStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No goals yet</Text>
      <Text style={styles.emptySubtitle}>
        Clarity is power. Set a goal to focus your energy.
      </Text>
      <Pressable style={styles.emptyBtn} onPress={onAddGoal}>
        <Text style={styles.emptyBtnText}>Set Your First Goal</Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// GoalsList - List of goals with Active/Completed sections
// ============================================================

type GoalsListProps = {
  goals: Goal[];
  taskCounts: Record<string, number>;
  taskStreaks?: Record<string, number>;
  onAddGoal: () => void;
  onDeleteGoal: (id: string) => void;
  onCompleteGoal: (id: string) => void;
  onUncompleteGoal: (id: string) => void;
  onEditGoal?: (goal: Goal) => void;
  onAddStep?: (goalId: string, title: string) => void;
  onToggleStep?: (goalId: string, stepId: string) => void;
  onDeleteStep?: (goalId: string, stepId: string) => void;
};

export function GoalsList({
  goals,
  taskCounts,
  taskStreaks = {},
  onAddGoal,
  onDeleteGoal,
  onCompleteGoal,
  onUncompleteGoal,
  onEditGoal,
  onAddStep,
  onToggleStep,
  onDeleteStep,
}: GoalsListProps) {
  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  if (goals.length === 0) {
    return <EmptyGoalsState onAddGoal={onAddGoal} />;
  }

  return (
    <View style={styles.goalsList}>
      {/* Active Goals */}
      {activeGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          tasksCompleted={taskCounts[goal.id] || 0}
          taskStreak={taskStreaks[goal.id] || 0}
          onLongPress={() => onCompleteGoal(goal.id)}
          onDelete={() => onDeleteGoal(goal.id)}
          onEdit={onEditGoal ? () => onEditGoal(goal) : undefined}
          onAddStep={onAddStep ? (title) => onAddStep(goal.id, title) : undefined}
          onToggleStep={onToggleStep ? (stepId) => onToggleStep(goal.id, stepId) : undefined}
          onDeleteStep={onDeleteStep ? (stepId) => onDeleteStep(goal.id, stepId) : undefined}
        />
      ))}

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.completedSectionTitle}>
            Achieved ({completedGoals.length})
          </Text>
          {completedGoals.map((goal) => (
            <CompletedGoalCard
              key={goal.id}
              goal={goal}
              onUncomplete={() => onUncompleteGoal(goal.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// AddGoalModal - Multi-field modal for creating a new goal
// ============================================================

type AddGoalModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    outcome: string,
    whys: string[],
    goalType: GoalType,
    color: GoalColor
  ) => void;
};

export function AddGoalModal({ visible, onClose, onSubmit }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [outcome, setOutcome] = useState('');
  const [whys, setWhys] = useState<string[]>(['', '', '']);
  const [selectedType, setSelectedType] = useState<GoalType>('other');
  const [selectedColor, setSelectedColor] = useState<GoalColor>('ocean');
  const [showTypePicker, setShowTypePicker] = useState(false);

  const goalTypes: { type: GoalType; label: string }[] = [
    { type: 'fitness', label: 'Fitness' },
    { type: 'career', label: 'Career' },
    { type: 'learning', label: 'Learning' },
    { type: 'health', label: 'Health' },
    { type: 'creative', label: 'Creative' },
    { type: 'financial', label: 'Financial' },
    { type: 'social', label: 'Social' },
    { type: 'other', label: 'Other' },
  ];

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const addWhyField = () => {
    if (whys.length < 5) {
      setWhys([...whys, '']);
    }
  };

  const removeWhyField = (index: number) => {
    if (whys.length > 1) {
      const newWhys = whys.filter((_, i) => i !== index);
      setWhys(newWhys);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    // Filter out empty whys
    const filteredWhys = whys.filter((w) => w.trim());

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(title.trim(), outcome.trim(), filteredWhys, selectedType, selectedColor);

    // Reset form
    setTitle('');
    setOutcome('');
    setWhys(['', '', '']);
    setSelectedType('other');
    setSelectedColor('ocean');
    setShowTypePicker(false);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setOutcome('');
    setWhys(['', '', '']);
    setSelectedType('other');
    setSelectedColor('ocean');
    setShowTypePicker(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Set a Clear Goal</Text>

              {/* Title Input */}
              <Text style={styles.inputLabel}>Goal Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Run a marathon"
                placeholderTextColor={tokens.colors.muted}
                value={title}
                onChangeText={(text) => setTitle(text.slice(0, 50))}
                maxLength={50}
              />
              <Text style={styles.charCount}>{title.length}/50</Text>

              {/* Outcome Input */}
              <Text style={styles.inputLabel}>Specific Goal & Outcome</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="What does success look like? Be specific."
                placeholderTextColor={tokens.colors.muted}
                value={outcome}
                onChangeText={(text) => setOutcome(text.slice(0, 200))}
                maxLength={200}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.charCount}>{outcome.length}/200</Text>

              {/* Whys Input */}
              <View style={styles.whysSection}>
                <View style={styles.whysSectionHeader}>
                  <Text style={styles.inputLabel}>Your Fuel (Why does this matter?)</Text>
                  {whys.length < 5 && (
                    <Pressable onPress={addWhyField}>
                      <Text style={styles.addWhyBtn}>+ Add</Text>
                    </Pressable>
                  )}
                </View>
                {whys.map((why, index) => (
                  <View key={index} style={styles.whyInputRow}>
                    <TextInput
                      style={[styles.input, styles.whyInput]}
                      placeholder={`Reason ${index + 1}`}
                      placeholderTextColor={tokens.colors.muted}
                      value={why}
                      onChangeText={(text) => updateWhy(index, text.slice(0, 100))}
                      maxLength={100}
                    />
                    {whys.length > 1 && (
                      <Pressable
                        style={styles.removeWhyBtn}
                        onPress={() => removeWhyField(index)}
                      >
                        <Text style={styles.removeWhyText}>×</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>

              {/* Color Picker */}
              <ColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              {/* Goal Type */}
              <View style={styles.typeSection}>
                <Text style={styles.inputLabel}>Category</Text>
                <Pressable
                  style={styles.typeSelector}
                  onPress={() => setShowTypePicker(!showTypePicker)}
                >
                  <View style={styles.typeDisplay}>
                    <View
                      style={[
                        styles.typeColorDot,
                        { backgroundColor: GOAL_TYPE_COLORS[selectedType] },
                      ]}
                    />
                    <Text style={styles.typeSelectorText}>
                      {goalTypes.find((t) => t.type === selectedType)?.label}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>{showTypePicker ? '▲' : '▼'}</Text>
                </Pressable>

                {showTypePicker && (
                  <View style={styles.typeList}>
                    {goalTypes.map((item) => (
                      <Pressable
                        key={item.type}
                        style={[
                          styles.typeOption,
                          selectedType === item.type && styles.typeOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedType(item.type);
                          setShowTypePicker(false);
                        }}
                      >
                        <View
                          style={[
                            styles.typeColorDot,
                            { backgroundColor: GOAL_TYPE_COLORS[item.type] },
                          ]}
                        />
                        <Text style={styles.typeOptionText}>{item.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttons}>
                <Pressable style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.submitBtn, !title.trim() && styles.submitDisabled]}
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                >
                  <Text style={styles.submitText}>Create Goal</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// ============================================================
// EditGoalModal - Modal for editing an existing goal
// ============================================================

type EditGoalModalProps = {
  visible: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSubmit: (
    id: string,
    updates: {
      title: string;
      outcome: string;
      whys: string[];
      color: GoalColor;
    }
  ) => void;
};

export function EditGoalModal({ visible, goal, onClose, onSubmit }: EditGoalModalProps) {
  const [title, setTitle] = useState('');
  const [outcome, setOutcome] = useState('');
  const [whys, setWhys] = useState<string[]>(['', '', '']);
  const [selectedColor, setSelectedColor] = useState<GoalColor>('ocean');

  // Populate form when goal changes
  React.useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setOutcome(goal.outcome);
      setWhys(goal.whys.length > 0 ? [...goal.whys] : ['', '', '']);
      setSelectedColor(goal.color);
    }
  }, [goal]);

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const addWhyField = () => {
    if (whys.length < 5) {
      setWhys([...whys, '']);
    }
  };

  const removeWhyField = (index: number) => {
    if (whys.length > 1) {
      const newWhys = whys.filter((_, i) => i !== index);
      setWhys(newWhys);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !goal) return;

    const filteredWhys = whys.filter((w) => w.trim());

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(goal.id, {
      title: title.trim(),
      outcome: outcome.trim(),
      whys: filteredWhys,
      color: selectedColor,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Edit Goal</Text>

              {/* Title Input */}
              <Text style={styles.inputLabel}>Goal Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Run a marathon"
                placeholderTextColor={tokens.colors.muted}
                value={title}
                onChangeText={(text) => setTitle(text.slice(0, 50))}
                maxLength={50}
              />
              <Text style={styles.charCount}>{title.length}/50</Text>

              {/* Outcome Input */}
              <Text style={styles.inputLabel}>Specific Goal & Outcome</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="What does success look like? Be specific."
                placeholderTextColor={tokens.colors.muted}
                value={outcome}
                onChangeText={(text) => setOutcome(text.slice(0, 200))}
                maxLength={200}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.charCount}>{outcome.length}/200</Text>

              {/* Whys Input */}
              <View style={styles.whysSection}>
                <View style={styles.whysSectionHeader}>
                  <Text style={styles.inputLabel}>Your Fuel (Why does this matter?)</Text>
                  {whys.length < 5 && (
                    <Pressable onPress={addWhyField}>
                      <Text style={styles.addWhyBtn}>+ Add</Text>
                    </Pressable>
                  )}
                </View>
                {whys.map((why, index) => (
                  <View key={index} style={styles.whyInputRow}>
                    <TextInput
                      style={[styles.input, styles.whyInput]}
                      placeholder={`Reason ${index + 1}`}
                      placeholderTextColor={tokens.colors.muted}
                      value={why}
                      onChangeText={(text) => updateWhy(index, text.slice(0, 100))}
                      maxLength={100}
                    />
                    {whys.length > 1 && (
                      <Pressable
                        style={styles.removeWhyBtn}
                        onPress={() => removeWhyField(index)}
                      >
                        <Text style={styles.removeWhyText}>×</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>

              {/* Color Picker */}
              <ColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              {/* Buttons */}
              <View style={styles.buttons}>
                <Pressable style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.submitBtn, !title.trim() && styles.submitDisabled]}
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                >
                  <Text style={styles.submitText}>Save Changes</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  // GoalCard styles
  cardContainer: {
    marginBottom: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? tokens.shadow.ios : tokens.shadow.android),
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  gradientCard: {
    padding: tokens.spacing.lg,
    minHeight: 180,
  },
  dataBar: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
  },
  dataStat: {
    alignItems: 'center',
    marginRight: tokens.spacing.lg,
  },
  dataEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    marginLeft: 'auto',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: tokens.spacing.xs,
    letterSpacing: -0.3,
  },
  cardOutcome: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: tokens.spacing.md,
    lineHeight: 22,
  },
  whysContainer: {
    marginTop: tokens.spacing.sm,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  whysLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.xs,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  whyBullet: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginRight: tokens.spacing.xs,
    lineHeight: 20,
  },
  whyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  longPressHint: {
    marginTop: tokens.spacing.md,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  tapHint: {
    marginTop: tokens.spacing.sm,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  cardActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandChevron: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: tokens.spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: tokens.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  expandedContent: {
    marginTop: tokens.spacing.sm,
  },
  stepsSection: {
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  stepsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  stepCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  stepCheckboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  stepCheck: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333333',
  },
  stepTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  stepTitleCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.5)',
  },
  stepDeleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: tokens.spacing.xs,
  },
  stepDeleteText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  addStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.xs,
  },
  addStepInput: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.sm,
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: tokens.spacing.sm,
  },
  addStepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStepBtnDisabled: {
    opacity: 0.4,
  },
  addStepBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // CompletedGoalCard styles
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.sm,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  completedCheck: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedContent: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  completedDate: {
    fontSize: 12,
    fontWeight: '500',
    color: tokens.colors.muted,
    marginTop: 2,
  },
  completedSection: {
    marginTop: tokens.spacing.xl,
  },
  completedSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // EmptyGoalsState styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
    paddingHorizontal: tokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    lineHeight: 22,
  },
  emptyBtn: {
    paddingVertical: 14,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.tint,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // GoalsList styles
  goalsList: {
    paddingTop: tokens.spacing.sm,
  },

  // AddGoalModal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    maxHeight: '90%',
  },
  modal: {
    width: '90%',
    maxHeight: '100%',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
  },
  modalTitle: {
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
  },
  multilineInput: {
    height: 80,
    paddingTop: tokens.spacing.sm,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: tokens.colors.muted,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: tokens.spacing.sm,
  },
  whysSection: {
    marginBottom: tokens.spacing.sm,
  },
  whysSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  addWhyBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.tint,
  },
  whyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  whyInput: {
    flex: 1,
  },
  removeWhyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: tokens.spacing.xs,
  },
  removeWhyText: {
    fontSize: 24,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  typeSection: {
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.bg,
  },
  typeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: tokens.spacing.sm,
  },
  typeSelectorText: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  chevron: {
    fontSize: 12,
    color: tokens.colors.muted,
  },
  typeList: {
    marginTop: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.card,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  typeOptionSelected: {
    backgroundColor: tokens.colors.bg,
  },
  typeOptionText: {
    fontSize: 15,
    color: tokens.colors.text,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.sm,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.tint,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
