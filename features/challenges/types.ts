// Community Challenge System types
// Percentage-based scoring: goal is 90%+ average, not perfection

import type { ChallengeColor, ChallengeDuration } from '../discipline/types';

// Re-export shared types
export type { ChallengeColor, ChallengeDuration };
export { CHALLENGE_GRADIENTS, CHALLENGE_COLOR_NAMES, CHALLENGE_DURATIONS } from '../discipline/types';

// ============================================================
// Community Challenge Definition
// ============================================================

export type ChallengeCategory =
  | 'fitness'
  | 'learning'
  | 'health'
  | 'creative'
  | 'productivity'
  | 'social'
  | 'other';

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ChallengeRule = {
  id: string;
  text: string;
  description?: string; // Optional longer explanation
};

export type CommunityChallenge = {
  id: string;
  title: string;
  description: string;
  color: ChallengeColor;
  totalDays: ChallengeDuration;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  rules: ChallengeRule[];

  // Dates
  startDate: string;      // ISO date - when challenge begins
  endDate: string;        // ISO date - when challenge ends
  createdAt: string;      // ISO timestamp

  // Metadata
  createdBy?: string;     // User ID of creator (for user-created challenges)
  isOfficial: boolean;    // Official You.First challenge vs user-created
  maxParticipants?: number;

  // State
  isActive: boolean;
};

// ============================================================
// Participant & Progress Tracking
// ============================================================

export type ChallengeParticipant = {
  id: string;
  challengeId: string;

  // Timestamps
  joinedAt: string;       // ISO timestamp

  // Progress (calculated from check-ins)
  daysParticipated: number;
  currentStreak: number;
  averagePercentage: number;  // Key metric: goal is 90%+
  totalPoints: number;        // Sum of daily percentages

  // Rank (updated when leaderboard computed)
  rank?: number;
};

export type DailyCheckIn = {
  id: string;
  participantId: string;
  challengeId: string;
  date: string;           // ISO date

  // What was completed
  completedRules: string[];  // Rule IDs completed
  totalRules: number;
  percentage: number;        // Calculated: completedRules.length / totalRules * 100

  // Timestamp
  checkedInAt: string;    // ISO timestamp
};

// ============================================================
// Leaderboard
// ============================================================

export type LeaderboardEntry = {
  rank: number;
  participantId: string;
  displayName: string;
  avatarLetter: string;

  // Stats
  daysParticipated: number;
  currentStreak: number;
  averagePercentage: number;
  totalPoints: number;

  // Visual
  isCurrentUser: boolean;
};

export type LeaderboardSortBy = 'averagePercentage' | 'totalPoints' | 'currentStreak' | 'daysParticipated';

// ============================================================
// Adherence Level (shared with Discipline)
// ============================================================

export type AdherenceLevel = 'excellent' | 'good' | 'needsWork' | 'low' | 'none';

export function getAdherenceLevel(percentage: number): AdherenceLevel {
  if (percentage >= 90) return 'excellent';  // Green - target zone
  if (percentage >= 70) return 'good';       // Yellow - acceptable
  if (percentage >= 50) return 'needsWork';  // Orange - needs improvement
  if (percentage > 0) return 'low';          // Red - falling behind
  return 'none';
}

export const ADHERENCE_COLORS: Record<AdherenceLevel, string> = {
  excellent: '#22C55E',   // Green
  good: '#EAB308',        // Yellow
  needsWork: '#F97316',   // Orange
  low: '#EF4444',         // Red
  none: '#6B7280',        // Gray
};

// ============================================================
// Category metadata
// ============================================================

export const CHALLENGE_CATEGORIES: { value: ChallengeCategory; label: string; emoji: string }[] = [
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'health', label: 'Health', emoji: '🧘' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'productivity', label: 'Productivity', emoji: '⚡' },
  { value: 'social', label: 'Social', emoji: '🤝' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

export const CHALLENGE_DIFFICULTIES: { value: ChallengeDifficulty; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Great for starting out' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience helpful' },
  { value: 'advanced', label: 'Advanced', description: 'For dedicated practitioners' },
];

// ============================================================
// View state
// ============================================================

export type ChallengesView = 'browse' | 'joined' | 'leaderboard';
