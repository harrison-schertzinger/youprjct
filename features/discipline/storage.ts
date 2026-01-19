// Discipline storage - AsyncStorage persistence for challenges and rules
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Challenge,
  ChallengeColor,
  ChallengeDuration,
  ChallengeRequirement,
  DailyRequirementStatus,
  Rule,
  DailyRulesAdherence,
  RulesAdherenceHistory,
  TodayRulesCheckIn,
} from './types';

const CHALLENGE_KEY = '@youprjct:challenge';
const DAILY_STATUS_KEY = '@youprjct:daily_status';
const RULES_KEY = '@youprjct:rules';
const RULES_ADHERENCE_KEY = '@youprjct:rules_adherence';
const TODAY_CHECKIN_KEY = '@youprjct:today_checkin';

// ============================================================
// Date utilities
// ============================================================

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDayNumber(startDate: string, targetDate: string): number {
  const start = new Date(startDate);
  const target = new Date(targetDate);
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the start date
}

export function isDateInPast(dateStr: string): boolean {
  const today = getTodayISO();
  return dateStr < today;
}

export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

// ============================================================
// Challenge operations
// ============================================================

export async function loadChallenge(): Promise<Challenge | null> {
  try {
    const raw = await AsyncStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load challenge:', error);
    return null;
  }
}

export async function saveChallenge(challenge: Challenge): Promise<void> {
  try {
    await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  } catch (error) {
    console.error('Failed to save challenge:', error);
  }
}

export async function createChallenge(
  title: string,
  color: ChallengeColor,
  totalDays: ChallengeDuration,
  requirements: string[]
): Promise<Challenge> {
  const challenge: Challenge = {
    id: `challenge-${Date.now()}`,
    title,
    color,
    totalDays,
    startDate: getTodayISO(),
    completedDays: [],
    requirements: requirements.map((text, index) => ({
      id: `req-${index}`,
      text,
    })),
    isActive: true,
  };

  await saveChallenge(challenge);
  // Clear any existing daily status when starting new challenge
  await AsyncStorage.removeItem(DAILY_STATUS_KEY);

  return challenge;
}

export async function completeDay(
  challenge: Challenge,
  dateStr: string
): Promise<Challenge> {
  if (challenge.completedDays.includes(dateStr)) {
    return challenge; // Already completed
  }

  const updatedChallenge: Challenge = {
    ...challenge,
    completedDays: [...challenge.completedDays, dateStr].sort(),
  };

  // Check if challenge is complete
  if (updatedChallenge.completedDays.length >= updatedChallenge.totalDays) {
    updatedChallenge.isActive = false;
    updatedChallenge.completedAt = new Date().toISOString();
  }

  await saveChallenge(updatedChallenge);
  return updatedChallenge;
}

export async function deleteChallenge(): Promise<void> {
  await AsyncStorage.removeItem(CHALLENGE_KEY);
  await AsyncStorage.removeItem(DAILY_STATUS_KEY);
}

// ============================================================
// Daily requirement status operations
// ============================================================

export async function loadDailyStatus(): Promise<DailyRequirementStatus | null> {
  try {
    const raw = await AsyncStorage.getItem(DAILY_STATUS_KEY);
    if (!raw) return null;

    const status: DailyRequirementStatus = JSON.parse(raw);

    // Reset if it's a new day
    if (status.date !== getTodayISO()) {
      return { date: getTodayISO(), completedRequirements: [] };
    }

    return status;
  } catch (error) {
    console.error('Failed to load daily status:', error);
    return null;
  }
}

export async function saveDailyStatus(status: DailyRequirementStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_STATUS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Failed to save daily status:', error);
  }
}

export async function toggleRequirement(
  requirementId: string,
  currentStatus: DailyRequirementStatus | null
): Promise<DailyRequirementStatus> {
  const today = getTodayISO();
  const status: DailyRequirementStatus = currentStatus || {
    date: today,
    completedRequirements: [],
  };

  // Ensure we're working with today's status
  if (status.date !== today) {
    status.date = today;
    status.completedRequirements = [];
  }

  const isCompleted = status.completedRequirements.includes(requirementId);

  const updatedStatus: DailyRequirementStatus = {
    ...status,
    completedRequirements: isCompleted
      ? status.completedRequirements.filter((id) => id !== requirementId)
      : [...status.completedRequirements, requirementId],
  };

  await saveDailyStatus(updatedStatus);
  return updatedStatus;
}

export function areAllRequirementsComplete(
  requirements: ChallengeRequirement[],
  dailyStatus: DailyRequirementStatus | null
): boolean {
  if (!dailyStatus || requirements.length === 0) return false;
  return requirements.every((req) =>
    dailyStatus.completedRequirements.includes(req.id)
  );
}

// ============================================================
// Rules operations
// ============================================================

export async function loadRules(): Promise<Rule[]> {
  try {
    const raw = await AsyncStorage.getItem(RULES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load rules:', error);
    return [];
  }
}

export async function saveRules(rules: Rule[]): Promise<void> {
  try {
    await AsyncStorage.setItem(RULES_KEY, JSON.stringify(rules));
  } catch (error) {
    console.error('Failed to save rules:', error);
  }
}

export async function addRule(title: string): Promise<Rule> {
  const rules = await loadRules();
  const newRule: Rule = {
    id: `rule-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
  };
  rules.push(newRule);
  await saveRules(rules);
  return newRule;
}

export async function deleteRule(id: string): Promise<void> {
  const rules = await loadRules();
  await saveRules(rules.filter((r) => r.id !== id));
}

// ============================================================
// Stats calculations
// ============================================================

export function calculateStreak(completedDays: string[]): number {
  if (completedDays.length === 0) return 0;

  const sorted = [...completedDays].sort().reverse();
  const today = getTodayISO();

  let streak = 0;
  let checkDate = today;

  for (const day of sorted) {
    if (day === checkDate) {
      streak++;
      // Move to previous day
      const prevDate = addDays(new Date(checkDate), -1);
      checkDate = getDateISO(prevDate);
    } else if (day < checkDate) {
      // Gap in days, streak broken
      break;
    }
  }

  return streak;
}

export function calculateCompletionPercentage(
  completedDays: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  return Math.round((completedDays / totalDays) * 100);
}

// ============================================================
// Rules Adherence operations
// ============================================================

export async function loadRulesAdherenceHistory(): Promise<RulesAdherenceHistory> {
  try {
    const raw = await AsyncStorage.getItem(RULES_ADHERENCE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load rules adherence history:', error);
    return {};
  }
}

export async function saveRulesAdherenceHistory(
  history: RulesAdherenceHistory
): Promise<void> {
  try {
    await AsyncStorage.setItem(RULES_ADHERENCE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save rules adherence history:', error);
  }
}

export async function loadTodayCheckIn(): Promise<TodayRulesCheckIn | null> {
  try {
    const raw = await AsyncStorage.getItem(TODAY_CHECKIN_KEY);
    if (!raw) return null;

    const checkIn: TodayRulesCheckIn = JSON.parse(raw);

    // Reset if it's a new day
    if (checkIn.date !== getTodayISO()) {
      return {
        date: getTodayISO(),
        checkedRules: [],
        hasCheckedIn: false,
      };
    }

    return checkIn;
  } catch (error) {
    console.error('Failed to load today check-in:', error);
    return null;
  }
}

export async function saveTodayCheckIn(checkIn: TodayRulesCheckIn): Promise<void> {
  try {
    await AsyncStorage.setItem(TODAY_CHECKIN_KEY, JSON.stringify(checkIn));
  } catch (error) {
    console.error('Failed to save today check-in:', error);
  }
}

export async function toggleRuleCheckIn(
  ruleId: string,
  currentCheckIn: TodayRulesCheckIn | null
): Promise<TodayRulesCheckIn> {
  const today = getTodayISO();
  const checkIn: TodayRulesCheckIn = currentCheckIn || {
    date: today,
    checkedRules: [],
    hasCheckedIn: false,
  };

  // Ensure we're working with today
  if (checkIn.date !== today) {
    checkIn.date = today;
    checkIn.checkedRules = [];
    checkIn.hasCheckedIn = false;
  }

  const isChecked = checkIn.checkedRules.includes(ruleId);
  const newCheckedRules = isChecked
    ? checkIn.checkedRules.filter((id) => id !== ruleId)
    : [...checkIn.checkedRules, ruleId];

  // If unchecking a rule after completion, revert hasCheckedIn to allow re-completion
  const updatedCheckIn: TodayRulesCheckIn = {
    ...checkIn,
    checkedRules: newCheckedRules,
    hasCheckedIn: isChecked ? false : checkIn.hasCheckedIn,
  };

  await saveTodayCheckIn(updatedCheckIn);
  return updatedCheckIn;
}

export async function completeRulesCheckIn(
  rules: Rule[],
  checkIn: TodayRulesCheckIn
): Promise<{ history: RulesAdherenceHistory; checkIn: TodayRulesCheckIn }> {
  const today = getTodayISO();

  // Create today's adherence record
  const todayAdherence: DailyRulesAdherence = {
    date: today,
    followedRules: checkIn.checkedRules,
    totalRules: rules.length,
  };

  // Load existing history and add today
  const history = await loadRulesAdherenceHistory();
  history[today] = todayAdherence;

  // Clean up old entries (keep last 90 days)
  const cutoffDate = getDateISO(addDays(new Date(), -90));
  const cleanedHistory: RulesAdherenceHistory = {};
  for (const [date, adherence] of Object.entries(history)) {
    if (date >= cutoffDate) {
      cleanedHistory[date] = adherence;
    }
  }

  await saveRulesAdherenceHistory(cleanedHistory);

  // Mark check-in as complete
  const updatedCheckIn: TodayRulesCheckIn = {
    ...checkIn,
    hasCheckedIn: true,
  };
  await saveTodayCheckIn(updatedCheckIn);

  return { history: cleanedHistory, checkIn: updatedCheckIn };
}

export function calculateRulesStreak(history: RulesAdherenceHistory): number {
  const sortedDates = Object.keys(history).sort().reverse();
  if (sortedDates.length === 0) return 0;

  const today = getTodayISO();
  let streak = 0;
  let checkDate = today;

  for (const date of sortedDates) {
    if (date === checkDate) {
      const adherence = history[date];
      // Count ANY submission as part of streak (not just 100%)
      // This encourages showing up daily even if not perfect
      if (adherence.totalRules > 0) {
        streak++;
        const prevDate = addDays(new Date(checkDate), -1);
        checkDate = getDateISO(prevDate);
      } else {
        break;
      }
    } else if (date < checkDate) {
      break; // Gap in days
    }
  }

  return streak;
}

/**
 * Calculate average adherence percentage over last N days (or all history)
 * This is the key metric - goal is 90%+ average
 */
export function calculateAveragePercentage(
  history: RulesAdherenceHistory,
  lastNDays?: number
): number {
  let entries = Object.values(history).filter(a => a.totalRules > 0);

  if (lastNDays) {
    const cutoff = getDateISO(addDays(new Date(), -lastNDays));
    entries = entries.filter(a => a.date >= cutoff);
  }

  if (entries.length === 0) return 0;

  const totalPercentage = entries.reduce((sum, a) => {
    return sum + (a.followedRules.length / a.totalRules) * 100;
  }, 0);

  return Math.round(totalPercentage / entries.length);
}

export function calculateBestRulesStreak(history: RulesAdherenceHistory): number {
  const sortedDates = Object.keys(history).sort();
  if (sortedDates.length === 0) return 0;

  let bestStreak = 0;
  let currentStreak = 0;
  let expectedDate = sortedDates[0];

  for (const date of sortedDates) {
    const adherence = history[date];
    // Count ANY submission (showing up matters)
    const hasSubmission = adherence.totalRules > 0;

    if (date === expectedDate && hasSubmission) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (hasSubmission) {
      currentStreak = 1;
    } else {
      currentStreak = 0;
    }

    // Move to next expected date
    expectedDate = getDateISO(addDays(new Date(date), 1));
  }

  return bestStreak;
}

export function getTodayAdherencePercentage(
  checkIn: TodayRulesCheckIn | null,
  totalRules: number
): number {
  if (!checkIn || totalRules === 0) return 0;
  return Math.round((checkIn.checkedRules.length / totalRules) * 100);
}

export function getLast30DaysAdherence(
  history: RulesAdherenceHistory
): { date: string; percentage: number }[] {
  const today = new Date();
  const result: { date: string; percentage: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = getDateISO(addDays(today, -i));
    const adherence = history[date];

    if (adherence && adherence.totalRules > 0) {
      result.push({
        date,
        percentage: Math.round((adherence.followedRules.length / adherence.totalRules) * 100),
      });
    } else {
      result.push({ date, percentage: -1 }); // -1 means no data
    }
  }

  return result;
}
