// Badge system for streak milestones
// Tracks earned badges locally in AsyncStorage

import { getItem, setItem } from './storage';
import { StorageKeys } from './storage/keys';

// ========== Badge Definitions ==========

export type BadgeId = 'streak_7' | 'streak_21' | 'streak_40' | 'streak_50';

export type Badge = {
  id: BadgeId;
  name: string;
  description: string;
  requiredDays: number;
  icon: string;
};

export const BADGES: Badge[] = [
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7 days of consistency',
    requiredDays: 7,
    icon: '7',
  },
  {
    id: 'streak_21',
    name: 'Habit Builder',
    description: '21 days of dedication',
    requiredDays: 21,
    icon: '21',
  },
  {
    id: 'streak_40',
    name: 'Elite',
    description: '40 days of excellence',
    requiredDays: 40,
    icon: '40',
  },
  {
    id: 'streak_50',
    name: 'Habit of Winning',
    description: '50 days of wins',
    requiredDays: 50,
    icon: '50',
  },
];

// ========== Badge Storage ==========

export type EarnedBadge = {
  id: BadgeId;
  earnedAt: string; // ISO date string
};

type BadgeStorage = {
  earnedBadges: EarnedBadge[];
};

const DEFAULT_BADGE_STORAGE: BadgeStorage = {
  earnedBadges: [],
};

/**
 * Get all earned badges from storage.
 */
export async function getEarnedBadges(): Promise<EarnedBadge[]> {
  const storage = await getItem<BadgeStorage>(StorageKeys.BADGES);
  return storage?.earnedBadges ?? [];
}

/**
 * Check if a specific badge has been earned.
 */
export async function hasBadge(badgeId: BadgeId): Promise<boolean> {
  const earned = await getEarnedBadges();
  return earned.some(b => b.id === badgeId);
}

/**
 * Award a badge to the user.
 * Returns true if the badge was newly awarded, false if already earned.
 */
export async function awardBadge(badgeId: BadgeId): Promise<boolean> {
  const storage = await getItem<BadgeStorage>(StorageKeys.BADGES) ?? DEFAULT_BADGE_STORAGE;

  // Check if already earned
  if (storage.earnedBadges.some(b => b.id === badgeId)) {
    return false;
  }

  // Award the badge
  storage.earnedBadges.push({
    id: badgeId,
    earnedAt: new Date().toISOString(),
  });

  await setItem(StorageKeys.BADGES, storage);
  return true;
}

/**
 * Check streak and award any newly earned badges.
 * Returns array of newly earned badge IDs (for showing celebration).
 */
export async function checkAndAwardBadges(currentStreak: number): Promise<BadgeId[]> {
  const newlyEarned: BadgeId[] = [];

  for (const badge of BADGES) {
    if (currentStreak >= badge.requiredDays) {
      const wasNew = await awardBadge(badge.id);
      if (wasNew) {
        newlyEarned.push(badge.id);
      }
    }
  }

  return newlyEarned;
}

/**
 * Get badge definition by ID.
 */
export function getBadgeById(badgeId: BadgeId): Badge | undefined {
  return BADGES.find(b => b.id === badgeId);
}

/**
 * Get all badges with their earned status.
 */
export async function getAllBadgesWithStatus(): Promise<Array<Badge & { earned: boolean; earnedAt?: string }>> {
  const earned = await getEarnedBadges();
  const earnedMap = new Map(earned.map(e => [e.id, e.earnedAt]));

  return BADGES.map(badge => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earnedAt: earnedMap.get(badge.id),
  }));
}
