import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { KPIBar, type KPIStat } from '@/components/ui/KPIBar';
import { PageLabel } from '@/components/ui/PageLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EmptyState } from '@/components/ui/EmptyState';
import { tokens } from '@/design/tokens';
import {
  RulesCard,
  AddNewRuleButton,
  RuleListItem,
  ChallengeCard,
  CreateChallengeModal,
  type DisciplineView,
  type Rule,
  type Challenge,
  type DailyRequirementStatus,
  type ChallengeColor,
  type ChallengeDuration,
  type RulesAdherenceHistory,
  type TodayRulesCheckIn,
  loadChallenge,
  createChallenge,
  completeDay,
  deleteChallenge,
  loadDailyStatus,
  toggleRequirement,
  areAllRequirementsComplete,
  getTodayISO,
  loadRules,
  addRule,
  deleteRule,
  loadRulesAdherenceHistory,
  loadTodayCheckIn,
  toggleRuleCheckIn,
  completeRulesCheckIn,
  calculateRulesStreak,
  calculateBestRulesStreak,
} from '@/features/discipline';

const DISCIPLINE_BENEFITS = [
  {
    title: 'Personal Rules System',
    description: 'Define the non-negotiables that shape your character and track adherence over time.',
  },
  {
    title: '40-Day Challenges',
    description: 'Structured challenges that build lasting habits through daily accountability.',
  },
  {
    title: 'Streak Tracking',
    description: 'Visual progress tracking that rewards consistency and builds momentum.',
  },
];

export default function DisciplineScreen() {
  const [view, setView] = useState<DisciplineView>('challenge');
  const [rules, setRules] = useState<Rule[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [dailyStatus, setDailyStatus] = useState<DailyRequirementStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Rules adherence state
  const [rulesHistory, setRulesHistory] = useState<RulesAdherenceHistory>({});
  const [todayCheckIn, setTodayCheckIn] = useState<TodayRulesCheckIn | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [
        loadedChallenge,
        loadedDailyStatus,
        loadedRules,
        loadedHistory,
        loadedCheckIn,
      ] = await Promise.all([
        loadChallenge(),
        loadDailyStatus(),
        loadRules(),
        loadRulesAdherenceHistory(),
        loadTodayCheckIn(),
      ]);
      setChallenge(loadedChallenge);
      setDailyStatus(loadedDailyStatus);
      setRules(loadedRules);
      setRulesHistory(loadedHistory);
      setTodayCheckIn(loadedCheckIn);
    } catch (error) {
      console.error('Failed to load discipline data:', error);
    }
  }, []);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleViewChange = (index: number) => {
    setView(index === 0 ? 'challenge' : 'rules');
  };

  // ============================================================
  // Challenge handlers
  // ============================================================

  const handleCreateChallenge = async (
    title: string,
    color: ChallengeColor,
    duration: ChallengeDuration,
    requirements: string[]
  ) => {
    const newChallenge = await createChallenge(title, color, duration, requirements);
    setChallenge(newChallenge);
    setDailyStatus({ date: getTodayISO(), completedRequirements: [] });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleToggleRequirement = async (requirementId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedStatus = await toggleRequirement(requirementId, dailyStatus);
    setDailyStatus(updatedStatus);
  };

  const handleCompleteDay = async () => {
    if (!challenge) return;

    const today = getTodayISO();

    // Double check all requirements are complete
    if (!areAllRequirementsComplete(challenge.requirements, dailyStatus)) {
      Alert.alert('Not Yet', 'Complete all requirements first to finish the day.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updatedChallenge = await completeDay(challenge, today);
    setChallenge(updatedChallenge);
  };

  const handleDeleteChallenge = () => {
    Alert.alert(
      'Delete Challenge',
      'Are you sure you want to delete this challenge? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteChallenge();
            setChallenge(null);
            setDailyStatus(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  // ============================================================
  // Rules handlers
  // ============================================================

  const handleAddRule = async () => {
    Alert.prompt(
      'New Rule',
      'Enter your non-negotiable rule:',
      async (text) => {
        if (text?.trim()) {
          const newRule = await addRule(text.trim());
          setRules((prev) => [...prev, newRule]);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
      'plain-text',
      '',
      'default'
    );
  };

  const handleDeleteRule = async (id: string) => {
    Alert.alert(
      'Delete Rule',
      'Are you sure you want to delete this rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRule(id);
            setRules((prev) => prev.filter((r) => r.id !== id));
          },
        },
      ]
    );
  };

  const handleToggleRuleCheckIn = async (ruleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedCheckIn = await toggleRuleCheckIn(ruleId, todayCheckIn);
    setTodayCheckIn(updatedCheckIn);
  };

  const handleCompleteRulesCheckIn = async () => {
    if (!todayCheckIn || rules.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { history, checkIn } = await completeRulesCheckIn(rules, todayCheckIn);
    setRulesHistory(history);
    setTodayCheckIn(checkIn);
  };

  // Calculate rules stats
  const currentStreak = calculateRulesStreak(rulesHistory);
  const bestStreak = calculateBestRulesStreak(rulesHistory);

  // Calculate KPI stats
  const kpiStats = useMemo((): [KPIStat, KPIStat, KPIStat] => {
    const challengeDisplay = challenge
      ? `Day ${challenge.completedDays.length}/${challenge.totalDays}`
      : '—';

    return [
      { label: 'STREAK', value: `${currentStreak}d`, color: tokens.colors.action },
      { label: 'BEST', value: `${bestStreak}d`, color: tokens.colors.tint },
      { label: 'CHALLENGE', value: challengeDisplay },
    ];
  }, [currentStreak, bestStreak, challenge]);

  return (
    <PremiumGate
      feature="Discipline"
      tagline="Daily actions that compound"
      benefits={DISCIPLINE_BENEFITS}
    >
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tokens.colors.muted}
            />
          }
        >
          <PageLabel label="DISCIPLINE" />
          <KPIBar stats={kpiStats} />

          <SegmentedControl
            segments={['Challenge', 'Rules']}
            selectedIndex={view === 'challenge' ? 0 : 1}
            onChange={handleViewChange}
          />

          {view === 'rules' ? (
            <View>
              <RulesCard
                rules={rules}
                history={rulesHistory}
                checkIn={todayCheckIn}
                onToggleRule={handleToggleRuleCheckIn}
                onCompleteCheckIn={handleCompleteRulesCheckIn}
              />

              <AddNewRuleButton onPress={handleAddRule} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Rules</Text>
                {rules.length === 0 ? (
                  <EmptyState
                    icon="📜"
                    title="No Rules Yet"
                    message="Define your non-negotiables—the standards you refuse to break."
                    actionLabel="Add First Rule"
                    onAction={handleAddRule}
                  />
                ) : (
                  rules.map((rule) => (
                    <RuleListItem key={rule.id} rule={rule} onDelete={handleDeleteRule} />
                  ))
                )}
              </View>
            </View>
          ) : (
            <View>
              {challenge ? (
                <ChallengeCard
                  challenge={challenge}
                  dailyStatus={dailyStatus}
                  onToggleRequirement={handleToggleRequirement}
                  onCompleteDay={handleCompleteDay}
                  onDelete={handleDeleteChallenge}
                />
              ) : (
                <EmptyState
                  icon="🎯"
                  title="No Active Challenge"
                  message="Build discipline through daily accountability. Choose 40, 75, or 100 days."
                  actionLabel="Start Challenge"
                  onAction={() => setShowCreateModal(true)}
                />
              )}
            </View>
          )}
        </ScrollView>

        <CreateChallengeModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateChallenge}
        />
      </ScreenContainer>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
});
