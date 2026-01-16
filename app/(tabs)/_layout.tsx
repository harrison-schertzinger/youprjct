import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { FloatingTabBar } from '@/components/ui/FloatingTabBar';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="you"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Hide default tab bar styling since we're using custom
        tabBarStyle: { display: 'none' },
      }}
    >
      {/* Hide starter screens */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />

      {/* Main tabs - Order: Discipline | Goals | You (center) | Mind | Body */}
      <Tabs.Screen
        name="discipline"
        options={{
          title: 'Discipline',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="target" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('@/assets/images/you-icon.png')}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.6,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mind"
        options={{
          title: 'Mind',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="brain.head.profile" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="body"
        options={{
          title: 'Body',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="figure.strengthtraining.traditional" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
