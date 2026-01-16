// Typed AsyncStorage wrapper for You.First

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageKey } from './keys';

const CURRENT_SCHEMA_VERSION = 1;

// ========== Schema Version ==========

export async function getSchemaVersion(): Promise<number> {
  try {
    const version = await AsyncStorage.getItem('@storage:schemaVersion');
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.error('Failed to get schema version:', error);
    return 0;
  }
}

export async function setSchemaVersion(version: number): Promise<void> {
  try {
    await AsyncStorage.setItem('@storage:schemaVersion', version.toString());
  } catch (error) {
    console.error('Failed to set schema version:', error);
  }
}

// ========== Typed Storage Helpers ==========

export async function getItem<T>(key: StorageKey | string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error(`Failed to get item for key ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: StorageKey | string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set item for key ${key}:`, error);
  }
}

export async function removeItem(key: StorageKey | string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item for key ${key}:`, error);
  }
}

// ========== Migration Hook (Future Use) ==========

export async function runMigrationsIfNeeded(): Promise<void> {
  const currentVersion = await getSchemaVersion();

  if (currentVersion < CURRENT_SCHEMA_VERSION) {
    console.log(`Running migrations from v${currentVersion} to v${CURRENT_SCHEMA_VERSION}`);

    // Future migrations will go here
    // Example:
    // if (currentVersion < 1) { await migrateToV1(); }
    // if (currentVersion < 2) { await migrateToV2(); }

    await setSchemaVersion(CURRENT_SCHEMA_VERSION);
  }
}

// ========== Cache Clearing ==========

/**
 * Clear all app data from AsyncStorage.
 * Use when encountering persistent data corruption issues.
 * This will clear:
 * - Training data (tracks, exercises, days)
 * - Results and activity sessions
 * - Profile data
 * - Supabase auth session (forces re-auth)
 */
export async function clearAllAppData(): Promise<void> {
  try {
    // Get all keys that belong to our app
    const allKeys = await AsyncStorage.getAllKeys();

    // Filter to only our app keys (starting with @ or supabase-)
    const appKeys = allKeys.filter(
      (key) => key.startsWith('@') || key.startsWith('supabase')
    );

    if (appKeys.length > 0) {
      await AsyncStorage.multiRemove(appKeys);
      console.log(`Cleared ${appKeys.length} app storage keys`);
    }
  } catch (error) {
    console.error('Failed to clear app data:', error);
    throw error;
  }
}

/**
 * Clear only training-related cache.
 * Preserves auth session and other data.
 */
export async function clearTrainingCache(): Promise<void> {
  try {
    const trainingKeys = [
      '@training:tracks',
      '@training:exercises',
      '@training:days',
      '@training:activeTrackId',
      '@training:cacheMetadata',
    ];
    await AsyncStorage.multiRemove(trainingKeys);
    console.log('Training cache cleared');
  } catch (error) {
    console.error('Failed to clear training cache:', error);
    throw error;
  }
}

/**
 * Clear Supabase auth session cache.
 * Forces re-authentication on next app launch.
 */
export async function clearSupabaseSession(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const supabaseKeys = allKeys.filter((key) => key.startsWith('supabase'));

    if (supabaseKeys.length > 0) {
      await AsyncStorage.multiRemove(supabaseKeys);
      console.log(`Cleared ${supabaseKeys.length} Supabase session keys`);
    }
  } catch (error) {
    console.error('Failed to clear Supabase session:', error);
    throw error;
  }
}

// ========== Date-Keyed Storage Cleanup ==========

/**
 * Clean up old date-keyed storage entries (dailyTasks, routine completions).
 * Keeps data for the last `daysToKeep` days (default 30).
 * Call this periodically (e.g., on app launch) to prevent unbounded growth.
 */
export async function cleanupOldDateKeys(daysToKeep: number = 30): Promise<number> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffISO = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Patterns for date-keyed storage:
    // - @youprjct:dailyTasks:YYYY-MM-DD
    // - @youprjct:routines:morning:completed:YYYY-MM-DD
    // - @youprjct:routines:evening:completed:YYYY-MM-DD
    const dateKeyPatterns = [
      /^@youprjct:dailyTasks:(\d{4}-\d{2}-\d{2})$/,
      /^@youprjct:routines:(?:morning|evening):completed:(\d{4}-\d{2}-\d{2})$/,
    ];

    const keysToRemove: string[] = [];

    for (const key of allKeys) {
      for (const pattern of dateKeyPatterns) {
        const match = key.match(pattern);
        if (match) {
          const dateStr = match[1];
          // Compare date strings (YYYY-MM-DD format allows string comparison)
          if (dateStr < cutoffISO) {
            keysToRemove.push(key);
          }
          break; // Key matched, no need to check other patterns
        }
      }
    }

    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(`Cleaned up ${keysToRemove.length} old date-keyed entries`);
    }

    return keysToRemove.length;
  } catch (error) {
    console.error('Failed to cleanup old date keys:', error);
    return 0;
  }
}
