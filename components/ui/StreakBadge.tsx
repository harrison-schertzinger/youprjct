// StreakBadge - Premium badge display for streak milestones
// Signature blue gradient for earned, muted gray for unearned

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';
import type { Badge } from '@/lib/badges';

type Props = {
  badge: Badge;
  earned: boolean;
  size?: 'default' | 'large';
};

export function StreakBadge({ badge, earned, size = 'default' }: Props) {
  const isLarge = size === 'large';
  const badgeSize = isLarge ? 80 : 56;
  const iconSize = isLarge ? 28 : 20;
  const nameSize = isLarge ? 14 : 11;

  if (earned) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={[
            styles.badge,
            { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 },
          ]}
        >
          <Text style={[styles.icon, { fontSize: iconSize }]}>{badge.icon}</Text>
        </LinearGradient>
        <Text style={[styles.name, { fontSize: nameSize }]}>{badge.name}</Text>
      </View>
    );
  }

  // Unearned state - muted with lock indicator
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          styles.unearnedBadge,
          { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 },
        ]}
      >
        <Text style={[styles.icon, styles.unearnedIcon, { fontSize: iconSize }]}>
          {badge.icon}
        </Text>
      </View>
      <Text style={[styles.name, styles.unearnedName, { fontSize: nameSize }]}>
        {badge.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    // Signature shadow for earned
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  unearnedBadge: {
    backgroundColor: tokens.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  unearnedIcon: {
    color: tokens.colors.muted,
  },
  name: {
    fontWeight: '700',
    color: tokens.colors.text,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  unearnedName: {
    color: tokens.colors.muted,
  },
});
