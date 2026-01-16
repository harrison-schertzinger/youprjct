// Discipline feature types

export type Rule = {
  id: string;
  title: string;
  createdAt: string;
};

export type ChallengeColor =
  | 'ocean'
  | 'ember'
  | 'forest'
  | 'violet'
  | 'sunset'
  | 'midnight'
  | 'rose'
  | 'slate';

export type ChallengeDuration = 40 | 75 | 100;

export type Challenge = {
  id: string;
  title: string;
  color: ChallengeColor;
  totalDays: ChallengeDuration;
  startDate: string; // ISO date string
  completedDays: string[]; // Array of ISO date strings for completed days
  requirements: ChallengeRequirement[];
  isActive: boolean;
  completedAt?: string;
};

export type ChallengeRequirement = {
  id: string;
  text: string;
};

// Daily requirement completion is tracked separately
export type DailyRequirementStatus = {
  date: string; // ISO date string
  completedRequirements: string[]; // Array of requirement IDs completed that day
};

export type DisciplineView = 'challenge' | 'rules';

// ============================================================
// Rules Adherence Types
// ============================================================

// Tracks which rules were followed on a specific day
export type DailyRulesAdherence = {
  date: string; // ISO date string
  followedRules: string[]; // Array of rule IDs that were followed
  totalRules: number; // Total rules that existed on that day
};

// History of daily adherence (stored as object for quick lookup)
export type RulesAdherenceHistory = {
  [date: string]: DailyRulesAdherence;
};

// Today's check-in status (separate from history for quick access)
export type TodayRulesCheckIn = {
  date: string;
  checkedRules: string[]; // Rules marked as followed today
  hasCheckedIn: boolean; // Whether user has done today's check-in
};

// Rules gradient - uses action/emerald color for consistency
export const RULES_GRADIENT = {
  start: '#059669', // emerald-600
  end: '#065F46',   // emerald-800
};

// Adherence level thresholds for visual feedback
export type AdherenceLevel = 'perfect' | 'good' | 'partial' | 'low' | 'none';

export function getAdherenceLevel(percentage: number): AdherenceLevel {
  if (percentage === 100) return 'perfect';
  if (percentage >= 80) return 'good';
  if (percentage >= 50) return 'partial';
  if (percentage > 0) return 'low';
  return 'none';
}

// Challenge color gradients - matches goal gradients for consistency
export const CHALLENGE_GRADIENTS: Record<ChallengeColor, { start: string; end: string }> = {
  ocean:    { start: '#0077B6', end: '#023E8A' },
  ember:    { start: '#F97316', end: '#DC2626' },
  forest:   { start: '#059669', end: '#065F46' },
  violet:   { start: '#8B5CF6', end: '#6D28D9' },
  sunset:   { start: '#F59E0B', end: '#EA580C' },
  midnight: { start: '#4F46E5', end: '#1E1B4B' },
  rose:     { start: '#EC4899', end: '#BE185D' },
  slate:    { start: '#64748B', end: '#334155' },
};

export const CHALLENGE_COLOR_NAMES: Record<ChallengeColor, string> = {
  ocean: 'Ocean',
  ember: 'Ember',
  forest: 'Forest',
  violet: 'Violet',
  sunset: 'Sunset',
  midnight: 'Midnight',
  rose: 'Rose',
  slate: 'Slate',
};

export const CHALLENGE_DURATIONS: { value: ChallengeDuration; label: string }[] = [
  { value: 40, label: '40 Days' },
  { value: 75, label: '75 Days' },
  { value: 100, label: '100 Days' },
];
