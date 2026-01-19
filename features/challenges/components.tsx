// Community Challenges components
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';
import { Card } from '@/components/ui/Card';
import type {
  CommunityChallenge,
  ChallengeParticipant,
  DailyCheckIn,
  LeaderboardEntry,
  LeaderboardSortBy,
  ChallengesView,
} from './types';
import {
  CHALLENGE_GRADIENTS,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  getAdherenceLevel,
  ADHERENCE_COLORS,
} from './types';
import { getTodayISO, getChallengeProgress } from './storage';

// ============================================================
// Challenges View Tabs
// ============================================================

type ChallengesTabsProps = {
  activeView: ChallengesView;
  onChangeView: (view: ChallengesView) => void;
  joinedCount: number;
};

export function ChallengesTabs({ activeView, onChangeView, joinedCount }: ChallengesTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <Pressable
        style={[styles.tab, activeView === 'browse' && styles.tabActive]}
        onPress={() => onChangeView('browse')}
      >
        <Text style={[styles.tabText, activeView === 'browse' && styles.tabTextActive]}>
          Browse
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeView === 'joined' && styles.tabActive]}
        onPress={() => onChangeView('joined')}
      >
        <Text style={[styles.tabText, activeView === 'joined' && styles.tabTextActive]}>
          My Challenges {joinedCount > 0 && `(${joinedCount})`}
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// Challenge Browse Card
// ============================================================

type ChallengeBrowseCardProps = {
  challenge: CommunityChallenge;
  isJoined: boolean;
  onPress: () => void;
};

export function ChallengeBrowseCard({ challenge, isJoined, onPress }: ChallengeBrowseCardProps) {
  const gradient = CHALLENGE_GRADIENTS[challenge.color];
  const category = CHALLENGE_CATEGORIES.find(c => c.value === challenge.category);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.browseCardContainer}>
      <LinearGradient
        colors={[gradient.start, gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.browseCardGradient}
      >
        {/* Center action button */}
        <View style={styles.browseCardCenter}>
          <View style={[styles.browseActionButton, isJoined && styles.browseActionButtonJoined]}>
            <Text style={[styles.browseActionText, isJoined && styles.browseActionTextJoined]}>
              {isJoined ? 'View Progress' : 'Join Challenge'}
            </Text>
          </View>
        </View>

        {/* Bottom content */}
        <View style={styles.browseCardBottom}>
          <Text style={styles.browseCardTitle}>{challenge.title}</Text>
          <Text style={styles.browseCardDescription} numberOfLines={2}>
            {challenge.description}
          </Text>

          {/* Badges row */}
          <View style={styles.browseCardBadges}>
            <View style={styles.browseBadge}>
              <Text style={styles.browseBadgeText}>{challenge.totalDays} days</Text>
            </View>
            {category && (
              <View style={styles.browseBadge}>
                <Text style={styles.browseBadgeText}>{category.emoji} {category.label}</Text>
              </View>
            )}
            <View style={styles.browseBadge}>
              <Text style={styles.browseBadgeText}>{challenge.rules.length} rules</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ============================================================
// Joined Challenge Card (with progress)
// ============================================================

type JoinedChallengeCardProps = {
  challenge: CommunityChallenge;
  participant: ChallengeParticipant;
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  onPress: () => void;
};

export function JoinedChallengeCard({
  challenge,
  participant,
  checkIns,
  todayCheckIn,
  onPress,
}: JoinedChallengeCardProps) {
  const gradient = CHALLENGE_GRADIENTS[challenge.color];
  const progress = getChallengeProgress(challenge, checkIns);
  const adherenceLevel = getAdherenceLevel(participant.averagePercentage);
  const hasCheckedInToday = todayCheckIn !== null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.joinedCard}>
        {/* Gradient header */}
        <LinearGradient
          colors={[gradient.start, gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.joinedCardHeader}
        >
          <View style={styles.joinedCardHeaderContent}>
            <Text style={styles.joinedCardTitle}>{challenge.title}</Text>
            <View style={styles.joinedCardBadges}>
              {!hasCheckedInToday && (
                <View style={styles.checkInNeededBadge}>
                  <Text style={styles.checkInNeededText}>Check-in needed</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.joinedCardBody}>
          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>
                Day {progress.daysCompleted} of {challenge.totalDays}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[gradient.start, gradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.max(progress.progressPercent, 3)}%` }]}
              />
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: ADHERENCE_COLORS[adherenceLevel] }]}>
                {participant.averagePercentage}%
              </Text>
              <Text style={styles.statLabel}>Avg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{participant.currentStreak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{participant.totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ============================================================
// Challenge Details Modal
// ============================================================

type ChallengeDetailsModalProps = {
  visible: boolean;
  challenge: CommunityChallenge | null;
  participant: ChallengeParticipant | null;
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  onClose: () => void;
  onJoin: () => void;
  onLeave: () => void;
  onCheckInToggle: (ruleId: string) => void;
  onSubmitDay: () => void;
  checkedRules: string[];
};

export function ChallengeDetailsModal({
  visible,
  challenge,
  participant,
  checkIns,
  todayCheckIn,
  onClose,
  onJoin,
  onLeave,
  onCheckInToggle,
  onSubmitDay,
  checkedRules,
}: ChallengeDetailsModalProps) {
  if (!challenge) return null;

  const gradient = CHALLENGE_GRADIENTS[challenge.color];
  const category = CHALLENGE_CATEGORIES.find(c => c.value === challenge.category);
  const difficulty = CHALLENGE_DIFFICULTIES.find(d => d.value === challenge.difficulty);
  const isJoined = participant !== null;
  const hasCheckedInToday = todayCheckIn !== null;
  const progress = isJoined ? getChallengeProgress(challenge, checkIns) : null;

  const checkedCount = checkedRules.length;
  const totalRules = challenge.rules.length;
  const currentPercentage = totalRules > 0 ? Math.round((checkedCount / totalRules) * 100) : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <LinearGradient
          colors={[gradient.start, gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modalHeader}
        >
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle} numberOfLines={1}>{challenge.title}</Text>
          <View style={styles.modalCloseButton} />
        </LinearGradient>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContent}
        >
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.descriptionText}>{challenge.description}</Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataValue}>{challenge.totalDays}</Text>
              <Text style={styles.metadataLabel}>Days</Text>
            </View>
            {category && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataValue}>{category.emoji}</Text>
                <Text style={styles.metadataLabel}>{category.label}</Text>
              </View>
            )}
            {difficulty && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataValue}>{difficulty.label}</Text>
                <Text style={styles.metadataLabel}>Difficulty</Text>
              </View>
            )}
          </View>

          {/* Progress section (if joined) */}
          {isJoined && participant && progress && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    Day {progress.daysCompleted} of {challenge.totalDays}
                  </Text>
                  <Text style={styles.progressValue}>{progress.progressPercent}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[gradient.start, gradient.end]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.max(progress.progressPercent, 3)}%` }]}
                  />
                </View>
                <View style={styles.progressStats}>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatValue}>{participant.averagePercentage}%</Text>
                    <Text style={styles.progressStatLabel}>Average</Text>
                  </View>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatValue}>{participant.currentStreak}</Text>
                    <Text style={styles.progressStatLabel}>Streak</Text>
                  </View>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatValue}>{participant.totalPoints}</Text>
                    <Text style={styles.progressStatLabel}>Points</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Daily Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Rules</Text>
            {challenge.rules.map((rule, index) => {
              const isChecked = isJoined && checkedRules.includes(rule.id);
              const isDisabled = !isJoined || hasCheckedInToday;

              return (
                <TouchableOpacity
                  key={rule.id}
                  style={styles.ruleItem}
                  onPress={() => !isDisabled && onCheckInToggle(rule.id)}
                  disabled={isDisabled}
                >
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>{index + 1}</Text>
                  </View>
                  {isJoined && (
                    <View style={[styles.ruleCheckbox, isChecked && styles.ruleCheckboxChecked]}>
                      {isChecked && <Text style={styles.ruleCheckmark}>✓</Text>}
                    </View>
                  )}
                  <Text style={[
                    styles.ruleText,
                    isChecked && styles.ruleTextChecked,
                  ]}>
                    {rule.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Check-in section (if joined and not checked in today) */}
          {isJoined && !hasCheckedInToday && (
            <View style={styles.checkInSection}>
              <TouchableOpacity
                style={[styles.submitButton, checkedCount === 0 && styles.submitButtonDisabled]}
                onPress={onSubmitDay}
                disabled={checkedCount === 0}
              >
                <LinearGradient
                  colors={checkedCount > 0 ? [gradient.start, gradient.end] : [tokens.colors.border, tokens.colors.border]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={[styles.submitButtonText, checkedCount === 0 && styles.submitButtonTextDisabled]}>
                    Submit Day ({currentPercentage}%)
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.checkInHint}>
                {checkedCount}/{totalRules} rules completed
              </Text>
            </View>
          )}

          {/* Checked in today message */}
          {isJoined && hasCheckedInToday && todayCheckIn && (
            <View style={styles.checkedInMessage}>
              <Text style={styles.checkedInTitle}>
                {todayCheckIn.percentage === 100 ? 'Perfect day!' : `${todayCheckIn.percentage}% today`}
              </Text>
              <Text style={styles.checkedInSubtext}>Aim for 90%+ average</Text>
            </View>
          )}

          {/* Join/Leave button */}
          <View style={styles.actionSection}>
            {!isJoined ? (
              <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
                <LinearGradient
                  colors={[gradient.start, gradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.joinButtonGradient}
                >
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
                <Text style={styles.leaveButtonText}>Leave Challenge</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================
// Leaderboard
// ============================================================

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  sortBy: LeaderboardSortBy;
  onChangeSortBy: (sortBy: LeaderboardSortBy) => void;
};

export function Leaderboard({ entries, sortBy, onChangeSortBy }: LeaderboardProps) {
  const sortOptions: { value: LeaderboardSortBy; label: string }[] = [
    { value: 'averagePercentage', label: 'Avg %' },
    { value: 'totalPoints', label: 'Points' },
    { value: 'currentStreak', label: 'Streak' },
    { value: 'daysParticipated', label: 'Days' },
  ];

  return (
    <View style={styles.leaderboard}>
      {/* Sort options */}
      <View style={styles.leaderboardSort}>
        {sortOptions.map(option => (
          <Pressable
            key={option.value}
            style={[
              styles.sortOption,
              sortBy === option.value && styles.sortOptionActive,
            ]}
            onPress={() => onChangeSortBy(option.value)}
          >
            <Text style={[
              styles.sortOptionText,
              sortBy === option.value && styles.sortOptionTextActive,
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Entries */}
      {entries.length === 0 ? (
        <View style={styles.leaderboardEmpty}>
          <Text style={styles.leaderboardEmptyText}>No participants yet</Text>
        </View>
      ) : (
        entries.map((entry) => (
          <View
            key={entry.participantId}
            style={[
              styles.leaderboardEntry,
              entry.isCurrentUser && styles.leaderboardEntryCurrentUser,
            ]}
          >
            {/* Rank */}
            <View style={styles.leaderboardRank}>
              {entry.rank <= 3 ? (
                <Text style={styles.leaderboardRankMedal}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </Text>
              ) : (
                <Text style={styles.leaderboardRankText}>{entry.rank}</Text>
              )}
            </View>

            {/* Avatar */}
            <View style={[
              styles.leaderboardAvatar,
              entry.isCurrentUser && styles.leaderboardAvatarCurrentUser,
            ]}>
              <Text style={styles.leaderboardAvatarText}>{entry.avatarLetter}</Text>
            </View>

            {/* Name and stats */}
            <View style={styles.leaderboardInfo}>
              <Text style={[
                styles.leaderboardName,
                entry.isCurrentUser && styles.leaderboardNameCurrentUser,
              ]}>
                {entry.displayName}
              </Text>
              <Text style={styles.leaderboardStats}>
                {entry.currentStreak} day streak
              </Text>
            </View>

            {/* Primary metric */}
            <View style={styles.leaderboardMetric}>
              <Text style={[
                styles.leaderboardMetricValue,
                { color: ADHERENCE_COLORS[getAdherenceLevel(entry.averagePercentage)] },
              ]}>
                {sortBy === 'averagePercentage' && `${entry.averagePercentage}%`}
                {sortBy === 'totalPoints' && entry.totalPoints}
                {sortBy === 'currentStreak' && entry.currentStreak}
                {sortBy === 'daysParticipated' && entry.daysParticipated}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// ============================================================
// Empty States
// ============================================================

export function NoChallengesMessage() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No challenges available</Text>
      <Text style={styles.emptyStateText}>Check back soon for new challenges</Text>
    </View>
  );
}

export function NoJoinedChallengesMessage({ onBrowse }: { onBrowse: () => void }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No challenges joined</Text>
      <Text style={styles.emptyStateText}>Browse available challenges to get started</Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={onBrowse}>
        <Text style={styles.emptyStateButtonText}>Browse Challenges</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    padding: 2,
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    borderRadius: tokens.radius.sm - 2,
  },
  tabActive: {
    backgroundColor: tokens.colors.card,
  },
  tabText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: tokens.colors.text,
  },

  // Browse Card - Full gradient style like Goal cards
  browseCardContainer: {
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  browseCardGradient: {
    minHeight: 220,
    padding: tokens.spacing.lg,
    justifyContent: 'space-between',
  },
  browseCardCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: tokens.spacing.xl + 4,
    paddingVertical: tokens.spacing.md + 2,
    borderRadius: tokens.radius.pill,
  },
  browseActionButtonJoined: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  browseActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  browseActionTextJoined: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  browseCardBottom: {
    marginTop: tokens.spacing.md,
  },
  browseCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: tokens.spacing.xs,
    letterSpacing: -0.3,
  },
  browseCardDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: tokens.spacing.md,
    lineHeight: 20,
  },
  browseCardBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
  },
  browseBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.pill,
  },
  browseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Joined Card
  joinedCard: {
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    overflow: 'hidden',
    padding: 0,
  },
  joinedCardHeader: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  joinedCardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinedCardTitle: {
    ...tokens.typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
  },
  joinedCardBadges: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  checkInNeededBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: tokens.radius.pill,
  },
  checkInNeededText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  joinedCardBody: {
    padding: tokens.spacing.md,
  },
  progressSection: {
    marginBottom: tokens.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  progressLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  progressValue: {
    ...tokens.typography.small,
    color: tokens.colors.text,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: tokens.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  statLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  modalCloseButton: {
    width: 60,
  },
  modalCloseText: {
    ...tokens.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalHeaderTitle: {
    ...tokens.typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  sectionTitle: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  descriptionText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  metadataItem: {
    alignItems: 'center',
  },
  metadataValue: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: 4,
  },
  metadataLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Progress card
  progressCard: {
    backgroundColor: tokens.colors.card,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  progressStatLabel: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Rules
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  ruleCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    borderRadius: 6,
    marginRight: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleCheckboxChecked: {
    backgroundColor: tokens.colors.action,
    borderColor: tokens.colors.action,
  },
  ruleCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ruleText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  ruleTextChecked: {
    color: tokens.colors.muted,
  },

  // Check-in section
  checkInSection: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
  },
  submitButton: {
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  submitButtonDisabled: {},
  submitButtonGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: tokens.colors.muted,
  },
  checkInHint: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
  },

  // Checked in message
  checkedInMessage: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
    marginHorizontal: tokens.spacing.md,
  },
  checkedInTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.action,
    marginBottom: 4,
  },
  checkedInSubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },

  // Action section
  actionSection: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  joinButton: {
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  joinButtonText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaveButton: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.danger,
    borderRadius: tokens.radius.sm,
  },
  leaveButtonText: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.danger,
  },

  // Leaderboard
  leaderboard: {
    paddingHorizontal: tokens.spacing.md,
  },
  leaderboardSort: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  sortOption: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
  },
  sortOptionActive: {
    backgroundColor: tokens.colors.text,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  sortOptionTextActive: {
    color: tokens.colors.card,
  },
  leaderboardEmpty: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
  leaderboardEmptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  leaderboardEntryCurrentUser: {
    backgroundColor: tokens.colors.card,
    marginHorizontal: -tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
  },
  leaderboardRankMedal: {
    fontSize: 18,
  },
  leaderboardRankText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  leaderboardAvatarCurrentUser: {
    backgroundColor: tokens.colors.action,
  },
  leaderboardAvatarText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  leaderboardNameCurrentUser: {
    fontWeight: '700',
  },
  leaderboardStats: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
  leaderboardMetric: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  leaderboardMetricValue: {
    ...tokens.typography.h3,
    fontWeight: '700',
  },

  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
    paddingHorizontal: tokens.spacing.lg,
  },
  emptyStateTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  emptyStateText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: tokens.colors.text,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
  },
  emptyStateButtonText: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.card,
  },
});
