import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { seedIfEmpty } from '@/lib/repositories/TrainingRepo';
import { bumpOnAppStreakIfNeeded } from '@/lib/repositories/ProfileRepo';
import { formatDateKey } from '@/utils/calendar';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Seed training data if empty
    seedIfEmpty().catch((error) => {
      console.error('Failed to seed training data:', error);
    });

    // Bump on-app streak if needed (use local day, not UTC)
    const today = formatDateKey(new Date());
    bumpOnAppStreakIfNeeded(today).catch((error) => {
      console.error('Failed to bump on-app streak:', error);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="workout-session" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
