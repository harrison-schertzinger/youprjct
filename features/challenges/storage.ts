// Community Challenge storage - AsyncStorage persistence (local-first) with Supabase sync
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type {
  CommunityChallenge,
  ChallengeParticipant,
  DailyCheckIn,
  LeaderboardEntry,
  LeaderboardSortBy,
} from './types';

// Storage keys
const CHALLENGES_KEY = '@youprjct:community_challenges';
const MY_PARTICIPATIONS_KEY = '@youprjct:my_participations';
const CHECKINS_KEY = '@youprjct:challenge_checkins';

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

// ============================================================
// Challenge CRUD
// ============================================================

export async function loadChallenges(): Promise<CommunityChallenge[]> {
  try {
    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('community_challenges')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Map Supabase snake_case to app camelCase
          const challenges: CommunityChallenge[] = data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            title: row.title as string,
            description: row.description as string,
            color: row.color as CommunityChallenge['color'],
            totalDays: row.total_days as number,
            category: row.category as CommunityChallenge['category'],
            difficulty: row.difficulty as CommunityChallenge['difficulty'],
            rules: row.rules as CommunityChallenge['rules'],
            startDate: row.start_date as string,
            endDate: row.end_date as string,
            createdAt: row.created_at as string,
            isOfficial: row.is_official as boolean,
            isActive: row.is_active as boolean,
          }));

          // Cache locally for offline access (even if empty)
          await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
          return challenges;
        }

        if (error) {
          console.warn('Supabase fetch error, falling back to cache:', error.message);
        }
      }
    }

    // Fall back to local cache (only if Supabase failed or not configured)
    const raw = await AsyncStorage.getItem(CHALLENGES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // No Supabase, no cache — return empty array
    // (Seed data removed to prevent hardcoded challenges appearing)
    return [];
  } catch (error) {
    console.error('Failed to load challenges:', error);
    return [];
  }
}

export async function saveChallenges(challenges: CommunityChallenge[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
  } catch (error) {
    console.error('Failed to save challenges:', error);
  }
}

export async function getChallengeById(id: string): Promise<CommunityChallenge | null> {
  const challenges = await loadChallenges();
  return challenges.find(c => c.id === id) || null;
}

// ============================================================
// Participation
// ============================================================

export async function loadMyParticipations(): Promise<ChallengeParticipant[]> {
  try {
    const raw = await AsyncStorage.getItem(MY_PARTICIPATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load participations:', error);
    return [];
  }
}

export async function saveMyParticipations(participations: ChallengeParticipant[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MY_PARTICIPATIONS_KEY, JSON.stringify(participations));
  } catch (error) {
    console.error('Failed to save participations:', error);
  }
}

export async function joinChallenge(challengeId: string): Promise<ChallengeParticipant> {
  const participations = await loadMyParticipations();

  // Check if already joined
  const existing = participations.find(p => p.challengeId === challengeId);
  if (existing) return existing;

  const participant: ChallengeParticipant = {
    id: `participant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    challengeId,
    joinedAt: new Date().toISOString(),
    daysParticipated: 0,
    currentStreak: 0,
    averagePercentage: 0,
    totalPoints: 0,
  };

  participations.push(participant);
  await saveMyParticipations(participations);
  return participant;
}

export async function leaveChallenge(challengeId: string): Promise<void> {
  const participations = await loadMyParticipations();
  const filtered = participations.filter(p => p.challengeId !== challengeId);
  await saveMyParticipations(filtered);

  // Also remove check-ins for this challenge
  const checkIns = await loadCheckIns();
  const filteredCheckIns = checkIns.filter(c => c.challengeId !== challengeId);
  await saveCheckIns(filteredCheckIns);
}

export async function getMyParticipation(challengeId: string): Promise<ChallengeParticipant | null> {
  const participations = await loadMyParticipations();
  return participations.find(p => p.challengeId === challengeId) || null;
}

// ============================================================
// Daily Check-ins
// ============================================================

export async function loadCheckIns(): Promise<DailyCheckIn[]> {
  try {
    const raw = await AsyncStorage.getItem(CHECKINS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load check-ins:', error);
    return [];
  }
}

export async function saveCheckIns(checkIns: DailyCheckIn[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
  } catch (error) {
    console.error('Failed to save check-ins:', error);
  }
}

export async function getTodayCheckIn(
  participantId: string,
  challengeId: string
): Promise<DailyCheckIn | null> {
  const checkIns = await loadCheckIns();
  const today = getTodayISO();
  return checkIns.find(
    c => c.participantId === participantId && c.challengeId === challengeId && c.date === today
  ) || null;
}

export async function submitDailyCheckIn(
  participantId: string,
  challengeId: string,
  completedRuleIds: string[],
  totalRules: number
): Promise<DailyCheckIn> {
  const today = getTodayISO();
  const checkIns = await loadCheckIns();

  // Remove existing check-in for today if any (allows re-submission)
  const filtered = checkIns.filter(
    c => !(c.participantId === participantId && c.challengeId === challengeId && c.date === today)
  );

  const percentage = totalRules > 0 ? Math.round((completedRuleIds.length / totalRules) * 100) : 0;

  const checkIn: DailyCheckIn = {
    id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    participantId,
    challengeId,
    date: today,
    completedRules: completedRuleIds,
    totalRules,
    percentage,
    checkedInAt: new Date().toISOString(),
  };

  filtered.push(checkIn);
  await saveCheckIns(filtered);

  // Update participant stats
  await updateParticipantStats(participantId, challengeId);

  return checkIn;
}

// ============================================================
// Stats Calculation
// ============================================================

async function updateParticipantStats(participantId: string, challengeId: string): Promise<void> {
  const participations = await loadMyParticipations();
  const checkIns = await loadCheckIns();

  const participantIndex = participations.findIndex(p => p.id === participantId);
  if (participantIndex === -1) return;

  const myCheckIns = checkIns.filter(
    c => c.participantId === participantId && c.challengeId === challengeId
  );

  // Calculate stats
  const daysParticipated = myCheckIns.length;
  const totalPoints = myCheckIns.reduce((sum, c) => sum + c.percentage, 0);
  const averagePercentage = daysParticipated > 0 ? Math.round(totalPoints / daysParticipated) : 0;
  const currentStreak = calculateStreak(myCheckIns.map(c => c.date));

  participations[participantIndex] = {
    ...participations[participantIndex],
    daysParticipated,
    totalPoints,
    averagePercentage,
    currentStreak,
  };

  await saveMyParticipations(participations);
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse();
  const today = getTodayISO();

  let streak = 0;
  let checkDate = today;

  for (const date of sorted) {
    if (date === checkDate) {
      streak++;
      const prevDate = addDays(new Date(checkDate), -1);
      checkDate = getDateISO(prevDate);
    } else if (date < checkDate) {
      break; // Gap in days
    }
  }

  return streak;
}

// ============================================================
// Leaderboard
// ============================================================

export async function getLeaderboard(
  challengeId: string,
  sortBy: LeaderboardSortBy = 'averagePercentage'
): Promise<LeaderboardEntry[]> {
  // In V1, leaderboard is just the current user
  // In V2 with Supabase, this would fetch all participants
  const participations = await loadMyParticipations();
  const myParticipation = participations.find(p => p.challengeId === challengeId);

  if (!myParticipation) return [];

  // For now, just show the current user
  const entry: LeaderboardEntry = {
    rank: 1,
    participantId: myParticipation.id,
    displayName: 'You',
    avatarLetter: 'Y',
    daysParticipated: myParticipation.daysParticipated,
    currentStreak: myParticipation.currentStreak,
    averagePercentage: myParticipation.averagePercentage,
    totalPoints: myParticipation.totalPoints,
    isCurrentUser: true,
  };

  return [entry];
}


// ============================================================
// Challenge progress helpers
// ============================================================

export function getChallengeProgress(
  challenge: CommunityChallenge,
  checkIns: DailyCheckIn[]
): { daysCompleted: number; daysRemaining: number; progressPercent: number } {
  const challengeCheckIns = checkIns.filter(c => c.challengeId === challenge.id);
  const daysCompleted = challengeCheckIns.length;
  const daysRemaining = Math.max(0, challenge.totalDays - daysCompleted);
  const progressPercent = Math.round((daysCompleted / challenge.totalDays) * 100);

  return { daysCompleted, daysRemaining, progressPercent };
}

export function isChallengeActive(challenge: CommunityChallenge): boolean {
  const today = getTodayISO();
  return challenge.isActive && today >= challenge.startDate && today <= challenge.endDate;
}
