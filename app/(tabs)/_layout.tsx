import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
  <Tabs
  initialRouteName="you"
  screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
      tabBarButton: HapticTab,
    }}
  >
    {/* Hide starter screens */}
    <Tabs.Screen name="index" options={{ href: null }} />
    <Tabs.Screen name="explore" options={{ href: null }} />

    {/* Your real tabs */}
    <Tabs.Screen
      name="you"
      options={{
        title: 'You',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
      }}
    />
    <Tabs.Screen
      name="discipline"
      options={{
        title: 'Discipline',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
      }}
    />
    <Tabs.Screen
      name="body"
      options={{
        title: 'Body',
        tabBarIcon: ({ color }) => (
          <IconSymbol size={28} name="figure.strengthtraining.traditional" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="mind"
      options={{
        title: 'Mind',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="brain.head.profile" color={color} />,
      }}
    />
    <Tabs.Screen
      name="goals"
      options={{
        title: 'Goals',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="target" color={color} />,
      }}
    />
  </Tabs>
);
}
