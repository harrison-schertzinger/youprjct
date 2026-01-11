import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.lg,
    ...tokens.shadow.ios,
    ...tokens.shadow.android,
  },
});
