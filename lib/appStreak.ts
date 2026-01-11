import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@youprjct:firstOpenedAt';

export async function getOrSetFirstOpenedAt(): Promise<string> {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const now = new Date().toISOString();
  await AsyncStorage.setItem(KEY, now);
  return now;
}

export function daysSince(iso: string): number {
  const start = new Date(iso);
  const now = new Date();

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffDays = Math.floor((nowDay - startDay) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
