// ProfileRepo: Manages user profile and on-app streak

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import type { Profile } from '../training/types';

const DEFAULT_PROFILE: Profile = {
  id: 'local-user',
  displayName: 'Athlete',
  onAppStreakDays: 0,
  lastOpenedISO: new Date().toISOString(),
  createdAtISO: new Date().toISOString(),
  updatedAtISO: new Date().toISOString(),
};

// ========== Get Profile ==========

export async function getProfile(): Promise<Profile> {
  const profile = await getItem<Profile>(StorageKeys.PROFILE);
  if (!profile) {
    // Create default profile on first access
    await setItem(StorageKeys.PROFILE, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }
  return profile;
}

// ========== Update Profile ==========

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const updated: Profile = {
    ...current,
    ...updates,
    updatedAtISO: new Date().toISOString(),
  };
  await setItem(StorageKeys.PROFILE, updated);
  return updated;
}

// ========== On-App Streak ==========

export async function bumpOnAppStreakIfNeeded(todayISO: string): Promise<Profile> {
  const profile = await getProfile();

  const lastOpenedDate = profile.lastOpenedISO.split('T')[0];

  // If we already opened today, no bump needed
  if (lastOpenedDate === todayISO) {
    return profile;
  }

  // Check if streak should continue (yesterday) or reset
  const yesterday = getYesterdayISO(todayISO);
  const isConsecutive = lastOpenedDate === yesterday;

  const newStreakDays = isConsecutive ? profile.onAppStreakDays + 1 : 1;

  return await updateProfile({
    onAppStreakDays: newStreakDays,
    lastOpenedISO: new Date().toISOString(),
  });
}

// ========== Helpers ==========

function getYesterdayISO(todayISO: string): string {
  const today = new Date(todayISO);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}
