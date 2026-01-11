// Discipline feature components
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { tokens } from '@/design/tokens';
import { Card } from '@/components/ui/Card';
import type { DisciplineView, Rule, Challenge, ChallengeRequirement } from './types';

type SegmentedControlProps = {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export function SegmentedControl({ segments, selectedIndex, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.segmentedControl}>
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          style={[
            styles.segment,
            index === 0 && styles.segmentFirst,
            index === segments.length - 1 && styles.segmentLast,
            selectedIndex === index && styles.segmentActive,
          ]}
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && styles.segmentTextActive,
            ]}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type RulesAdherenceCardProps = {
  todayPercentage: number;
  bestStreak: number;
};

export function RulesAdherenceCard({ todayPercentage, bestStreak }: RulesAdherenceCardProps) {
  return (
    <Card style={styles.adherenceCard}>
      <Text style={styles.cardTitle}>Rules Adherence</Text>
      <View style={styles.adherenceStats}>
        <View style={styles.adherenceStat}>
          <Text style={styles.adherenceValue}>{todayPercentage}%</Text>
          <Text style={styles.adherenceLabel}>Today</Text>
        </View>
        <View style={styles.adherenceStat}>
          <Text style={styles.adherenceValue}>{bestStreak}</Text>
          <Text style={styles.adherenceLabel}>Best Streak</Text>
        </View>
      </View>
    </Card>
  );
}

export function MiniGrid() {
  // Placeholder 30-day mini grid
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <View style={styles.miniGrid}>
      {days.map((day) => (
        <View key={day} style={styles.miniGridCell} />
      ))}
    </View>
  );
}

type AddNewRuleButtonProps = {
  onPress: () => void;
};

export function AddNewRuleButton({ onPress }: AddNewRuleButtonProps) {
  return (
    <TouchableOpacity style={styles.addRuleButton} onPress={onPress}>
      <Text style={styles.addRuleIcon}>+</Text>
      <Text style={styles.addRuleText}>Add New Rule</Text>
    </TouchableOpacity>
  );
}

type RuleListItemProps = {
  rule: Rule;
  onDelete: (id: string) => void;
};

export function RuleListItem({ rule, onDelete }: RuleListItemProps) {
  return (
    <View style={styles.ruleItem}>
      <Text style={styles.ruleTitle}>{rule.title}</Text>
      <TouchableOpacity onPress={() => onDelete(rule.id)}>
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

type ChallengeCardProps = {
  challenge: Challenge;
  onToggleRequirement: (requirementId: string) => void;
};

export function ChallengeCard({ challenge, onToggleRequirement }: ChallengeCardProps) {
  const progress = (challenge.currentDay / challenge.totalDays) * 100;

  return (
    <Card style={styles.challengeCard}>
      <Text style={styles.challengeTitle}>{challenge.title}</Text>
      <Text style={styles.challengeDay}>
        Day {challenge.currentDay} of {challenge.totalDays}
      </Text>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.requirementsSection}>
        <Text style={styles.requirementsTitle}>Today's Requirements</Text>
        {challenge.requirements.map((req) => (
          <TouchableOpacity
            key={req.id}
            style={styles.requirementItem}
            onPress={() => onToggleRequirement(req.id)}
          >
            <View style={[styles.checkbox, req.completed && styles.checkboxChecked]}>
              {req.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.requirementText}>{req.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    padding: 2,
    marginBottom: tokens.spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFirst: {
    borderTopLeftRadius: tokens.radius.sm,
    borderBottomLeftRadius: tokens.radius.sm,
  },
  segmentLast: {
    borderTopRightRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
  segmentActive: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.sm,
  },
  segmentText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  segmentTextActive: {
    color: tokens.colors.text,
  },
  adherenceCard: {
    marginBottom: tokens.spacing.lg,
  },
  cardTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  adherenceStats: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
  },
  adherenceStat: {
    alignItems: 'center',
  },
  adherenceValue: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  adherenceLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: tokens.spacing.lg,
  },
  miniGridCell: {
    width: 32,
    height: 32,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
  },
  addRuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  addRuleIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text,
    marginRight: tokens.spacing.sm,
  },
  addRuleText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  ruleTitle: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  deleteIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: tokens.colors.danger,
    marginLeft: tokens.spacing.md,
  },
  challengeCard: {
    marginTop: tokens.spacing.lg,
  },
  challengeTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  challengeDay: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.md,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: tokens.colors.text,
    borderRadius: tokens.radius.pill,
  },
  requirementsSection: {
    marginTop: tokens.spacing.md,
  },
  requirementsTitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    borderRadius: 4,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.text,
    borderColor: tokens.colors.text,
  },
  checkmark: {
    color: tokens.colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  requirementText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
});
