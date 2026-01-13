// Cache metadata helpers for training data
// Tracks when data was last fetched from Supabase

import { getItem, setItem } from './index';
import { StorageKeys } from './keys';

// Cache is considered stale after 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheMetadata = {
  lastFetchedISO: string;
  weekStartISO: string;
};

/**
 * Get the cache metadata for training data.
 */
export async function getTrainingCacheMetadata(): Promise<CacheMetadata | null> {
  return await getItem<CacheMetadata>(StorageKeys.TRAINING_CACHE_METADATA);
}

/**
 * Update the cache metadata after a successful fetch.
 */
export async function setTrainingCacheMetadata(weekStartISO: string): Promise<void> {
  const metadata: CacheMetadata = {
    lastFetchedISO: new Date().toISOString(),
    weekStartISO,
  };
  await setItem(StorageKeys.TRAINING_CACHE_METADATA, metadata);
}

/**
 * Check if the training cache is stale and needs refresh.
 * Returns true if:
 * - No cache metadata exists
 * - Cache is older than TTL
 * - Cached week doesn't match requested week
 */
export async function isTrainingCacheStale(weekStartISO: string): Promise<boolean> {
  const metadata = await getTrainingCacheMetadata();

  if (!metadata) return true;

  // Check if we cached a different week
  if (metadata.weekStartISO !== weekStartISO) return true;

  // Check if cache is older than TTL
  const lastFetched = new Date(metadata.lastFetchedISO).getTime();
  const now = Date.now();
  return now - lastFetched > CACHE_TTL_MS;
}

/**
 * Clear all training cache (used when switching tracks or for testing).
 */
export async function clearTrainingCache(): Promise<void> {
  await setItem(StorageKeys.TRAINING_CACHE_METADATA, null);
}
