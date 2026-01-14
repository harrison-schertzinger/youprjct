import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/design/tokens';

export type AccentColor = 'amber' | 'blue' | 'indigo';

const ACCENT_COLORS: Record<AccentColor, { solid: string; tint: string }> = {
  amber: { solid: '#F59E0B', tint: 'rgba(245, 158, 11, 0.06)' },
  blue: { solid: '#3B82F6', tint: 'rgba(59, 130, 246, 0.06)' },
  indigo: { solid: '#6366F1', tint: 'rgba(99, 102, 241, 0.06)' },
};

type Props = {
  children: React.ReactNode;
  header?: React.ReactNode;
  accent: AccentColor;
  style?: ViewStyle;
};

export function AccentCard({ children, header, accent, style }: Props) {
  const colors = ACCENT_COLORS[accent];

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.accentBar, { backgroundColor: colors.solid }]} />
      <View style={styles.content}>
        {header && (
          <View style={[styles.headerZone, { backgroundColor: colors.tint }]}>
            {header}
          </View>
        )}
        <View style={styles.bodyZone}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
    ...tokens.shadow.ios,
    ...tokens.shadow.android,
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: tokens.radius.md - 1,
    borderBottomLeftRadius: tokens.radius.md - 1,
  },
  content: {
    flex: 1,
  },
  headerZone: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderTopRightRadius: tokens.radius.md - 1,
  },
  bodyZone: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
  },
});
