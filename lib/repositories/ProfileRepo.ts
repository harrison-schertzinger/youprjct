// ProfileRepo: Manages user profile and on-app streak
// Local profile: streak tracking, app usage (stored in AsyncStorage)
// Supabase profile: display name, avatar (stored in public.profiles for leaderboards)

import { getItem, setItem } from '../storage';
import { StorageKeys } from '../storage/keys';
import { getSupabase } from '../supabase/client';
import { getCurrentUserId } from '../supabase/AuthRepo';
import type { Profile } from '../training/types';

// ========== Types ==========

export type SupabaseProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

// ========== Local Profile (AsyncStorage) ==========

const DEFAULT_PROFILE: Profile = {
  id: 'local-user',
  displayName: 'Athlete',
  onAppStreakDays: 0,
  lastOpenedISO: new Date().toISOString(),
  createdAtISO: new Date().toISOString(),
  updatedAtISO: new Date().toISOString(),
};

/**
 * Get local profile from AsyncStorage.
 * Used for streak tracking and local app state.
 */
export async function getProfile(): Promise<Profile> {
  const profile = await getItem<Profile>(StorageKeys.PROFILE);
  if (!profile) {
    // Create default profile on first access
    await setItem(StorageKeys.PROFILE, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }
  return profile;
}

/**
 * Update local profile in AsyncStorage.
 */
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

function getYesterdayISO(todayISO: string): string {
  const today = new Date(todayISO);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// ========== Supabase Profile (public.profiles) ==========

/**
 * Get the authenticated user's profile from Supabase.
 * Returns null if not authenticated or no profile exists.
 */
export async function getSupabaseProfile(): Promise<SupabaseProfile | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return null;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows found, which is expected for new users
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('ProfileRepo: Error fetching Supabase profile:', error.message);
      return null;
    }

    return data as SupabaseProfile;
  } catch (error) {
    console.error('ProfileRepo: Unexpected error fetching Supabase profile:', error);
    return null;
  }
}

/**
 * Create or update the user's display name in Supabase.
 * Uses upsert to handle both new and existing profiles.
 */
export async function upsertDisplayName(displayName: string): Promise<SupabaseProfile | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return null;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          display_name: displayName,
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('ProfileRepo: Error upserting display name:', error.message);
      return null;
    }

    // Also update local profile displayName to keep in sync
    await updateProfile({ displayName });

    return data as SupabaseProfile;
  } catch (error) {
    console.error('ProfileRepo: Unexpected error upserting display name:', error);
    return null;
  }
}

/**
 * Check if the current user has set up their Supabase profile.
 */
export async function hasSupabaseProfile(): Promise<boolean> {
  const profile = await getSupabaseProfile();
  return profile !== null;
}
