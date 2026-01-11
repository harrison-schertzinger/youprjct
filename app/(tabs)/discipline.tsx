import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import {
  SegmentedControl,
  RulesAdherenceCard,
  MiniGrid,
  AddNewRuleButton,
  RuleListItem,
  ChallengeCard,
  type DisciplineView,
  type Rule,
  type Challenge,
} from '@/features/discipline';

export default function DisciplineScreen() {
  const [view, setView] = useState<DisciplineView>('challenge');
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', title: 'No phone before 9 AM', createdAt: '2026-01-01' },
    { id: '2', title: 'Cold shower every morning', createdAt: '2026-01-02' },
  ]);
  const [challenge, setChallenge] = useState<Challenge | null>({
    id: '1',
    title: '40 Days of Excellence',
    currentDay: 12,
    totalDays: 40,
    requirements: [
      { id: '1', text: 'Train for 45 minutes', completed: true },
      { id: '2', text: 'No phone before 9 AM', completed: true },
      { id: '3', text: 'Read 20 pages', completed: false },
      { id: '4', text: 'Cold shower', completed: false },
    ],
  });

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'challenge' : 'rules');
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      title: 'New Rule',
      createdAt: new Date().toISOString(),
    };
    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleToggleRequirement = (requirementId: string) => {
    if (!challenge) return;

    const updatedRequirements = challenge.requirements.map((req) =>
      req.id === requirementId ? { ...req, completed: !req.completed } : req
    );

    setChallenge({ ...challenge, requirements: updatedRequirements });
  };

  const handleStartChallenge = () => {
    setChallenge({
      id: Date.now().toString(),
      title: '40 Days of Excellence',
      currentDay: 1,
      totalDays: 40,
      requirements: [
        { id: '1', text: 'Train for 45 minutes', completed: false },
        { id: '2', text: 'No phone before 9 AM', completed: false },
        { id: '3', text: 'Read 20 pages', completed: false },
      ],
    });
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Discipline</Text>
        <Text style={styles.subtitle}>Daily actions that compound</Text>

        <SegmentedControl
          segments={['Challenge', 'Rules']}
          selectedIndex={view === 'challenge' ? 0 : 1}
          onChange={handleViewChange}
        />

        {view === 'rules' ? (
          <View>
            <RulesAdherenceCard todayPercentage={85} bestStreak={12} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>30-Day View</Text>
              <MiniGrid />
            </View>

            <AddNewRuleButton onPress={handleAddRule} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Rules</Text>
              {rules.map((rule) => (
                <RuleListItem key={rule.id} rule={rule} onDelete={handleDeleteRule} />
              ))}
            </View>
          </View>
        ) : (
          <View>
            {challenge ? (
              <ChallengeCard
                challenge={challenge}
                onToggleRequirement={handleToggleRequirement}
              />
            ) : (
              <View style={styles.noChallengeContainer}>
                <Text style={styles.noChallengeText}>
                  No active challenge. Start one to build discipline!
                </Text>
                <PrimaryButton
                  label="Start New Challenge"
                  onPress={handleStartChallenge}
                  style={styles.startButton}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  noChallengeContainer: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
  },
  noChallengeText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  startButton: {
    width: '100%',
  },
});
