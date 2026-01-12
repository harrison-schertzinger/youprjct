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
