// PageLabel: Small muted page identifier for headers
// Replaces large page titles with minimal context

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  label: string;
  action?: {
    icon: string;
    onPress: () => void;
  };
};

export function PageLabel({ label, action }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {action && (
        <Pressable style={styles.actionBtn} onPress={action.onPress}>
          <Text style={styles.actionText}>{action.icon}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 1.2,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
