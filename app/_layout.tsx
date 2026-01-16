import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeTraining } from '@/lib/repositories/TrainingRepo';
import { bumpOnAppStreakIfNeeded } from '@/lib/repositories/ProfileRepo';
import { ensureSession } from '@/lib/supabase/AuthRepo';
import { configureRevenueCat } from '@/lib/revenuecat';
import { formatDateKey } from '@/utils/calendar';
import { ToastProvider } from '@/components/ui/Toast';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Fire-and-forget async init
    // Sequential: ensureSession completes before configureRevenueCat
    // so RevenueCat can use Supabase user ID
    (async () => {
      try {
        // Bootstrap anonymous auth session first
        await ensureSession();

        // Configure RevenueCat with Supabase user ID (if available)
        await configureRevenueCat();
      } catch (error) {
        // Non-blocking, fail silently
        console.error('App init error:', error);
      }
    })();

    // Initialize training data (Supabase if configured, else local seed)
    initializeTraining().catch((error) => {
      console.error('Failed to initialize training data:', error);
    });

    // Bump on-app streak if needed (use local day, not UTC)
    const today = formatDateKey(new Date());
    bumpOnAppStreakIfNeeded(today).catch((error) => {
      console.error('Failed to bump on-app streak:', error);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="workout-session" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="premium" options={{ headerShown: false, presentation: 'card' }} />
        </Stack>
        <StatusBar style="auto" />
      </ToastProvider>
    </ThemeProvider>
  );
}
