import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[tokens.typography.h2, styles.title]}>{title}</Text>

      {actionLabel ? (
        <Pressable onPress={onPressAction} hitSlop={10}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: tokens.spacing.xl,
    marginBottom: tokens.spacing.md,
    marginHorizontal: 8, // Align with cards
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: tokens.colors.text,
  },
  action: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
});
