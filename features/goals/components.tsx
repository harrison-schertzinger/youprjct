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
} from 'react-native';
import { tokens } from '@/design/tokens';
import { Goal, GoalType, GOAL_TYPE_COLORS } from './types';

// ============================================================
// GoalCard - Display a single goal with type bar and task count
// ============================================================

type GoalCardProps = {
  goal: Goal;
  tasksCompleted: number;
  onPress?: () => void;
  onDelete?: () => void;
};

export function GoalCard({ goal, tasksCompleted, onPress, onDelete }: GoalCardProps) {
  const typeColor = GOAL_TYPE_COLORS[goal.goalType];

  return (
    <Pressable style={styles.goalCard} onPress={onPress}>
      {/* Type color bar */}
      <View style={[styles.typeBar, { backgroundColor: typeColor }]} />

      <View style={styles.goalContent}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.tasksCompleted}>Tasks completed: {tasksCompleted}</Text>
      </View>

      {onDelete && (
        <Pressable
          style={styles.deleteBtn}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Text style={styles.deleteText}>×</Text>
        </Pressable>
      )}
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
      <Text style={styles.emptySubtitle}>Set a clear goal to start tracking your progress</Text>
      <Pressable style={styles.emptyBtn} onPress={onAddGoal}>
        <Text style={styles.emptyBtnText}>Set a Clear Goal</Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// GoalsList - List of goals with empty state
// ============================================================

type GoalsListProps = {
  goals: Goal[];
  taskCounts: Record<string, number>;
  onAddGoal: () => void;
  onDeleteGoal: (id: string) => void;
};

export function GoalsList({ goals, taskCounts, onAddGoal, onDeleteGoal }: GoalsListProps) {
  if (goals.length === 0) {
    return <EmptyGoalsState onAddGoal={onAddGoal} />;
  }

  return (
    <View style={styles.goalsList}>
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          tasksCompleted={taskCounts[goal.id] || 0}
          onDelete={() => onDeleteGoal(goal.id)}
        />
      ))}
    </View>
  );
}

// ============================================================
// AddGoalModal - Modal for creating a new goal
// ============================================================

type AddGoalModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, goalType: GoalType) => void;
};

export function AddGoalModal({ visible, onClose, onSubmit }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<GoalType>('other');
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

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), selectedType);
    setTitle('');
    setSelectedType('other');
    setShowTypePicker(false);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setSelectedType('other');
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
            <Text style={styles.modalTitle}>Set a Clear Goal</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., Run a marathon, Learn Spanish..."
              placeholderTextColor={tokens.colors.muted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <View style={styles.typeSection}>
              <Text style={styles.typeLabel}>Goal Type</Text>
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
                <ScrollView style={styles.typeList}>
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
                </ScrollView>
              )}
            </View>

            <View style={styles.buttons}>
              <Pressable style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.submitBtn, !title.trim() && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={!title.trim()}
              >
                <Text style={styles.submitText}>Add Goal</Text>
              </Pressable>
            </View>
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
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...Platform.select({
      ios: tokens.shadow.ios,
      android: tokens.shadow.android,
    }),
  },
  typeBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: tokens.spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: 4,
  },
  tasksCompleted: {
    fontSize: 14,
    fontWeight: '500',
    color: tokens.colors.muted,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: tokens.spacing.sm,
  },
  deleteText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -2,
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
  },
  modal: {
    width: '85%',
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
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
    marginBottom: tokens.spacing.sm,
  },
  typeSection: {
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    maxHeight: 200,
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
    marginTop: tokens.spacing.md,
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
