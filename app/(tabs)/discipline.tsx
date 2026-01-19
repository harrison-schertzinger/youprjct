import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EmptyState } from '@/components/ui/EmptyState';
import { tokens } from '@/design/tokens';
import { getProfile, getSupabaseProfile, type SupabaseProfile } from '@/lib/repositories/ProfileRepo';
import type { Profile } from '@/lib/training/types';
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
import {
  ChallengeBrowseCard,
  JoinedChallengeCard,
  ChallengeDetailsModal,
  NoChallengesMessage,
  NoJoinedChallengesMessage,
  ChallengesTabs,
  type CommunityChallenge,
  type ChallengeParticipant,
  type DailyCheckIn,
  type ChallengesView,
  loadChallenges,
  loadMyParticipations,
  loadCheckIns,
  joinChallenge,
  leaveChallenge,
  getTodayCheckIn,
  submitDailyCheckIn,
} from '@/features/challenges';

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

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);

  // Community challenges state
  const [communityChallenges, setCommunityChallenges] = useState<CommunityChallenge[]>([]);
  const [myParticipations, setMyParticipations] = useState<ChallengeParticipant[]>([]);
  const [communityCheckIns, setCommunityCheckIns] = useState<DailyCheckIn[]>([]);
  const [communityView, setCommunityView] = useState<ChallengesView>('browse');
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);
  const [communityCheckedRules, setCommunityCheckedRules] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [
        loadedChallenge,
        loadedDailyStatus,
        loadedRules,
        loadedHistory,
        loadedCheckIn,
        loadedCommunityChallenges,
        loadedParticipations,
        loadedCommunityCheckIns,
      ] = await Promise.all([
        loadChallenge(),
        loadDailyStatus(),
        loadRules(),
        loadRulesAdherenceHistory(),
        loadTodayCheckIn(),
        loadChallenges(),
        loadMyParticipations(),
        loadCheckIns(),
      ]);
      setChallenge(loadedChallenge);
      setDailyStatus(loadedDailyStatus);
      setRules(loadedRules);
      setRulesHistory(loadedHistory);
      setTodayCheckIn(loadedCheckIn);
      setCommunityChallenges(loadedCommunityChallenges);
      setMyParticipations(loadedParticipations);
      setCommunityCheckIns(loadedCommunityCheckIns);
    } catch (error) {
      console.error('Failed to load discipline data:', error);
    }
  }, []);

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      // Load profile data
      Promise.all([getProfile(), getSupabaseProfile()])
        .then(([localProfile, sbProfile]) => {
          setProfile(localProfile);
          setSupabaseProfile(sbProfile);
        })
        .catch((error) => {
          console.error('Failed to load profile:', error);
        });
    }, [loadData])
  );

  // Derived profile values
  const displayName = supabaseProfile?.display_name ?? profile?.displayName ?? 'Athlete';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const streakCount = profile?.onAppStreakDays ?? 0;

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleViewChange = (index: number) => {
    if (index === 0) setView('challenge');
    else if (index === 1) setView('rules');
    else setView('community');
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

  // ============================================================
  // Community Challenge handlers
  // ============================================================

  const handleSelectChallenge = (challenge: CommunityChallenge) => {
    setSelectedChallenge(challenge);
    // Reset checked rules for the selected challenge
    setCommunityCheckedRules([]);
  };

  const handleJoinChallenge = async () => {
    if (!selectedChallenge) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const participant = await joinChallenge(selectedChallenge.id);
    setMyParticipations(prev => [...prev, participant]);
  };

  const handleLeaveChallenge = async () => {
    if (!selectedChallenge) return;

    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave this challenge? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            await leaveChallenge(selectedChallenge.id);
            setMyParticipations(prev => prev.filter(p => p.challengeId !== selectedChallenge.id));
            setCommunityCheckIns(prev => prev.filter(c => c.challengeId !== selectedChallenge.id));
            setSelectedChallenge(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const handleCommunityCheckInToggle = (ruleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCommunityCheckedRules(prev =>
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSubmitCommunityDay = async () => {
    if (!selectedChallenge || communityCheckedRules.length === 0) return;

    const participant = myParticipations.find(p => p.challengeId === selectedChallenge.id);
    if (!participant) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newCheckIn = await submitDailyCheckIn(
      participant.id,
      selectedChallenge.id,
      communityCheckedRules,
      selectedChallenge.rules.length
    );

    setCommunityCheckIns(prev => [...prev.filter(c => c.id !== newCheckIn.id), newCheckIn]);

    // Reload participations to get updated stats
    const updatedParticipations = await loadMyParticipations();
    setMyParticipations(updatedParticipations);

    setCommunityCheckedRules([]);
  };

  // Helper functions for community view
  const getParticipantForChallenge = (challengeId: string) =>
    myParticipations.find(p => p.challengeId === challengeId) || null;

  const getTodayCommunityCheckIn = (participantId: string, challengeId: string) => {
    const today = getTodayISO();
    return communityCheckIns.find(
      c => c.participantId === participantId && c.challengeId === challengeId && c.date === today
    ) || null;
  };

  const getCheckInsForChallenge = (challengeId: string) =>
    communityCheckIns.filter(c => c.challengeId === challengeId);

  // Calculate rules stats
  const currentStreak = calculateRulesStreak(rulesHistory);
  const bestStreak = calculateBestRulesStreak(rulesHistory);
  const challengeDisplay = challenge
    ? `${challenge.completedDays.length}/${challenge.totalDays}`
    : '—';

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
          contentInsetAdjustmentBehavior="never"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
                <Text style={styles.kpiLabel}>STREAK</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.action }]}>{currentStreak}d</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>BEST</Text>
                <Text style={[styles.kpiValue, { color: tokens.colors.tint }]}>{bestStreak}d</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiBlock}>
                <Text style={styles.kpiLabel}>CHALLENGE</Text>
                <Text style={styles.kpiValue}>{challengeDisplay}</Text>
              </View>
            </View>
          </View>

          <SegmentedControl
            segments={['Challenge', 'Rules', 'Community']}
            selectedIndex={view === 'challenge' ? 0 : view === 'rules' ? 1 : 2}
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
          ) : view === 'community' ? (
            <View>
              <ChallengesTabs
                activeView={communityView}
                onChangeView={setCommunityView}
                joinedCount={myParticipations.length}
              />

              {communityView === 'browse' ? (
                communityChallenges.length === 0 ? (
                  <NoChallengesMessage />
                ) : (
                  communityChallenges.map(c => (
                    <ChallengeBrowseCard
                      key={c.id}
                      challenge={c}
                      isJoined={myParticipations.some(p => p.challengeId === c.id)}
                      onPress={() => handleSelectChallenge(c)}
                    />
                  ))
                )
              ) : (
                myParticipations.length === 0 ? (
                  <NoJoinedChallengesMessage onBrowse={() => setCommunityView('browse')} />
                ) : (
                  myParticipations.map(participant => {
                    const c = communityChallenges.find(ch => ch.id === participant.challengeId);
                    if (!c) return null;
                    const checkIns = getCheckInsForChallenge(c.id);
                    const todayCI = getTodayCommunityCheckIn(participant.id, c.id);
                    return (
                      <JoinedChallengeCard
                        key={c.id}
                        challenge={c}
                        participant={participant}
                        checkIns={checkIns}
                        todayCheckIn={todayCI}
                        onPress={() => handleSelectChallenge(c)}
                      />
                    );
                  })
                )
              )}

              <ChallengeDetailsModal
                visible={selectedChallenge !== null}
                challenge={selectedChallenge}
                participant={selectedChallenge ? getParticipantForChallenge(selectedChallenge.id) : null}
                checkIns={selectedChallenge ? getCheckInsForChallenge(selectedChallenge.id) : []}
                todayCheckIn={
                  selectedChallenge
                    ? (() => {
                        const p = getParticipantForChallenge(selectedChallenge.id);
                        return p ? getTodayCommunityCheckIn(p.id, selectedChallenge.id) : null;
                      })()
                    : null
                }
                onClose={() => setSelectedChallenge(null)}
                onJoin={handleJoinChallenge}
                onLeave={handleLeaveChallenge}
                onCheckInToggle={handleCommunityCheckInToggle}
                onSubmitDay={handleSubmitCommunityDay}
                checkedRules={communityCheckedRules}
              />
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

  // Content sections
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
});
