import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';
import { CheckCircle } from './CheckCircle';
import { GOAL_GRADIENTS, type GoalColor } from '@/features/goals/types';

type Props = {
  title: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  /** @deprecated Use goalColor instead for gradient dot indicator */
  chipText?: string;
  /** Goal color for gradient dot indicator */
  goalColor?: GoalColor;
};

export function RoutineListItem({ title, checked, onToggle, onDelete, goalColor }: Props) {
  const gradient = goalColor ? GOAL_GRADIENTS[goalColor] : null;

  return (
    <View style={styles.row}>
      <CheckCircle checked={checked} onPress={onToggle} />

      {/* Goal indicator dot - small gradient circle */}
      {gradient && (
        <View style={styles.dotContainer}>
          <LinearGradient
            colors={[gradient.start, gradient.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goalDot}
          />
        </View>
      )}

      <View style={[styles.content, !gradient && styles.contentNoGoal]}>
        <Text
          style={[styles.title, checked && styles.titleChecked]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <Pressable style={styles.deleteButton} onPress={onDelete} hitSlop={8}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  dotContainer: {
    marginLeft: 10,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  contentNoGoal: {
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  titleChecked: {
    color: tokens.colors.muted,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.muted,
    lineHeight: 20,
  },
});
