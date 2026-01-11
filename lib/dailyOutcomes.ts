import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@dailyOutcomes';

export type OutcomeValue = 'win' | 'loss';
export type OutcomesData = Record<string, OutcomeValue>;

/**
 * Get all daily outcomes from storage.
 * @returns Promise<Record<string, 'win' | 'loss'>>
 */
export async function getOutcomes(): Promise<OutcomesData> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load outcomes:', e);
    return {};
  }
}

/**
 * Set an outcome for a specific date.
 * @param dateKey - Date string in YYYY-MM-DD format
 * @param value - 'win' or 'loss'
 */
export async function setOutcome(dateKey: string, value: OutcomeValue): Promise<void> {
  try {
    const current = await getOutcomes();
    const updated = { ...current, [dateKey]: value };
    const jsonValue = JSON.stringify(updated);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save outcome:', e);
  }
}
