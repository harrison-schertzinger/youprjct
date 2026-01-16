import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDateKey } from '@/utils/calendar';

const STORAGE_KEY = '@youprjct:wins';

/**
 * Data model: We only persist WINS in AsyncStorage.
 * Any day without a stored win is treated as a loss by default.
 *
 * Storage format: { "YYYY-MM-DD": "win", ... }
 */

export type DayOutcome = 'win' | 'loss';

/**
 * Get all stored wins from AsyncStorage.
 * @returns Record of date keys mapped to 'win'
 */
export async function loadWins(): Promise<Record<string, 'win'>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load wins:', error);
    return {};
  }
}

/**
 * Mark a specific day as a win.
 * @param date - The date to mark as won
 */
export async function markDayAsWin(date: Date): Promise<void> {
  try {
    const wins = await loadWins();
    const dateKey = formatDateKey(date);
    wins[dateKey] = 'win';
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
  } catch (error) {
    console.error('Failed to mark day as win:', error);
  }
}

/**
 * Remove a win for a specific day (marks it as a loss).
 * @param date - The date to remove the win from
 */
export async function removeDayWin(date: Date): Promise<void> {
  try {
    const wins = await loadWins();
    const dateKey = formatDateKey(date);
    delete wins[dateKey];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
  } catch (error) {
    console.error('Failed to remove day win:', error);
  }
}

/**
 * Get the outcome for a specific day.
 * @param date - The date to check
 * @param wins - Optional preloaded wins record (for performance)
 * @returns 'win' if stored, 'loss' otherwise
 */
export function getDayOutcome(
  date: Date,
  wins: Record<string, 'win'>
): DayOutcome {
  const dateKey = formatDateKey(date);
  return wins[dateKey] === 'win' ? 'win' : 'loss';
}

/**
 * Check if a specific day is a win.
 * @param date - The date to check
 * @param wins - Preloaded wins record
 * @returns true if the day is a win
 */
export function isDayWin(date: Date, wins: Record<string, 'win'>): boolean {
  return getDayOutcome(date, wins) === 'win';
}

/**
 * Calculate the number of days won in the current week (Monday-Sunday).
 * @param wins - Preloaded wins record
 * @returns Object with winsThisWeek and totalDaysThisWeek
 */
export function getThisWeekStats(wins: Record<string, 'win'>): {
  winsThisWeek: number;
  totalDaysThisWeek: number;
} {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Calculate Monday of this week
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  // Count wins from Monday to today
  let winsThisWeek = 0;
  let totalDaysThisWeek = 0;

  const current = new Date(monday);
  while (current <= now) {
    totalDaysThisWeek++;
    if (isDayWin(current, wins)) {
      winsThisWeek++;
    }
    current.setDate(current.getDate() + 1);
  }

  return { winsThisWeek, totalDaysThisWeek };
}

/**
 * Calculate total days won across all time.
 * @param wins - Preloaded wins record
 * @returns Total number of days won
 */
export function getTotalDaysWon(wins: Record<string, 'win'>): number {
  return Object.keys(wins).length;
}

/**
 * Get consecutive loss streak length for a given date.
 * Counts backwards from the given date to find consecutive losses.
 * @param date - The date to check
 * @param wins - Preloaded wins record
 * @returns Number of consecutive losses (0 if the day is a win)
 */
export function getLossStreakLength(
  date: Date,
  wins: Record<string, 'win'>
): number {
  // If this day is a win, no loss streak
  if (isDayWin(date, wins)) {
    return 0;
  }

  let streakLength = 1; // Current day is a loss
  const checkDate = new Date(date);

  // Go backwards to count consecutive losses
  // Limit to 30 days to avoid infinite loops
  for (let i = 0; i < 30; i++) {
    checkDate.setDate(checkDate.getDate() - 1);
    if (isDayWin(checkDate, wins)) {
      break;
    }
    streakLength++;
  }

  return streakLength;
}

/**
 * Get daily win data for a period (for charts).
 * @param wins - Preloaded wins record
 * @param days - Number of days to look back
 * @returns Array of daily data with label and isWin
 */
export type DailyWinData = {
  date: string;
  label: string;
  isWin: boolean;
};

export function getDailyWinsForPeriod(
  wins: Record<string, 'win'>,
  days: number
): DailyWinData[] {
  const result: DailyWinData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = formatDateKey(date);

    // Get day label based on period length
    let label: string;
    if (days <= 7) {
      label = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
    } else if (days <= 31) {
      label = String(date.getDate());
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3);
    }

    result.push({
      date: dateKey,
      label,
      isWin: wins[dateKey] === 'win',
    });
  }

  return result;
}
