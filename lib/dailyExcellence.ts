// Daily Excellence Score Calculator
// Combines Wins (40%) + Routines (30%) + Tasks (30%) into a single excellence metric

import { loadWins } from './dailyOutcomes';
import { loadMorningRoutines, loadEveningRoutines, loadCompletedRoutines } from './routines';
import { loadDailyTasks } from './dailyTasks';

export type DailyExcellenceData = {
  date: string; // YYYY-MM-DD
  label: string; // Display label (e.g., "Mon", "Jan 5")
  score: number; // 0-100
  breakdown: {
    win: boolean;
    routineRate: number; // 0-100
    taskRate: number; // 0-100
  };
};

// Weights for score calculation
const WEIGHTS = {
  win: 0.4, // 40%
  routines: 0.3, // 30%
  tasks: 0.3, // 30%
};

/**
 * Get date string in YYYY-MM-DD format for a given offset from today.
 */
function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Get display label for a date.
 */
function getDateLabel(daysAgo: number, periodDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  if (daysAgo === 0) return 'Today';

  if (periodDays <= 7) {
    // Short period: show day names
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (periodDays <= 30) {
    // Medium period: show day of month
    return String(date.getDate());
  } else {
    // Long period: show month abbreviation
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

/**
 * Calculate excellence score for a single day.
 */
function calculateDayScore(
  hasWin: boolean,
  routineRate: number,
  taskRate: number
): number {
  const winScore = hasWin ? 100 : 0;
  const score = (winScore * WEIGHTS.win) + (routineRate * WEIGHTS.routines) + (taskRate * WEIGHTS.tasks);
  return Math.round(score);
}

/**
 * Load excellence data for a period.
 * @param days - Number of days to load (7, 30, 180)
 */
export async function loadExcellenceData(days: number): Promise<DailyExcellenceData[]> {
  // Load all wins
  const wins = await loadWins();

  // Load current routines (to know total count)
  const [morningRoutines, eveningRoutines] = await Promise.all([
    loadMorningRoutines(),
    loadEveningRoutines(),
  ]);
  const totalRoutines = morningRoutines.length + eveningRoutines.length;

  const results: DailyExcellenceData[] = [];

  // Calculate for each day (most recent last)
  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo--) {
    const dateStr = getDateString(daysAgo);
    const dayOffset = -daysAgo; // Convert to offset (negative for past)

    // Check win status
    const hasWin = wins[dateStr] === 'win';

    // Load routine completions for this day
    let routineRate = 0;
    if (totalRoutines > 0) {
      try {
        const [morningCompleted, eveningCompleted] = await Promise.all([
          loadCompletedRoutines('morning', dayOffset),
          loadCompletedRoutines('evening', dayOffset),
        ]);
        const completedCount = morningCompleted.size + eveningCompleted.size;
        routineRate = Math.round((completedCount / totalRoutines) * 100);
      } catch {
        routineRate = 0;
      }
    }

    // Load tasks for this day
    let taskRate = 0;
    try {
      const tasks = await loadDailyTasks(dayOffset);
      if (tasks.length > 0) {
        const completedTasks = tasks.filter(t => t.completed).length;
        taskRate = Math.round((completedTasks / tasks.length) * 100);
      }
    } catch {
      taskRate = 0;
    }

    const score = calculateDayScore(hasWin, routineRate, taskRate);

    results.push({
      date: dateStr,
      label: getDateLabel(daysAgo, days),
      score,
      breakdown: {
        win: hasWin,
        routineRate,
        taskRate,
      },
    });
  }

  return results;
}

/**
 * Calculate summary stats from excellence data.
 */
export function calculateExcellenceStats(data: DailyExcellenceData[]): {
  todayScore: number;
  average: number;
  trend: number; // Percentage change from first half to second half
  trendDirection: 'up' | 'down' | 'flat';
} {
  if (data.length === 0) {
    return { todayScore: 0, average: 0, trend: 0, trendDirection: 'flat' };
  }

  const todayScore = data[data.length - 1]?.score ?? 0;
  const average = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);

  // Calculate trend: compare first half average to second half average
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);

  const firstAvg = firstHalf.length > 0
    ? firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length
    : 0;
  const secondAvg = secondHalf.length > 0
    ? secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length
    : 0;

  const trend = Math.round(secondAvg - firstAvg);
  const trendDirection: 'up' | 'down' | 'flat' =
    trend > 2 ? 'up' : trend < -2 ? 'down' : 'flat';

  return { todayScore, average, trend, trendDirection };
}

/**
 * Sample data points for longer periods to avoid overcrowding.
 */
export function sampleExcellenceData(
  data: DailyExcellenceData[],
  maxPoints: number
): DailyExcellenceData[] {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0 || i === data.length - 1);
}
