// GlowCard: Premium card with subtle colored shadow glow
// Replaces AccentCard for a more refined aesthetic

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/design/tokens';

export type GlowColor = 'amber' | 'blue' | 'indigo';

// Accent colors for title and left border
const ACCENT_COLORS: Record<GlowColor, string> = {
  amber: '#F59E0B',
  blue: '#3B82F6',
  indigo: '#6366F1',
};

type Props = {
  children: React.ReactNode;
  title: string;
  glow: GlowColor;
  completedCount?: number;
  totalCount?: number;
  onAdd?: () => void;
  style?: ViewStyle;
};

export function GlowCard({
  children,
  title,
  glow,
  completedCount = 0,
  totalCount = 0,
  onAdd,
  style,
}: Props) {
  const accentColor = ACCENT_COLORS[glow];
  const hasItems = totalCount > 0;

  return (
    <View style={[styles.card, style]}>
      {/* Thin left accent line */}
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />

      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>{title.toUpperCase()}</Text>
          <View style={styles.headerRight}>
            {hasItems && (
              <Text style={styles.progress}>
                {completedCount}/{totalCount}
              </Text>
            )}
            {onAdd && (
              <Pressable style={styles.addButton} onPress={onAdd} hitSlop={8}>
                <Text style={styles.addButtonText}>+</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>
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
    overflow: 'hidden',
    flexDirection: 'row',
    ...tokens.shadow.ios,
    ...tokens.shadow.android,
  },
  accentLine: {
    width: 3,
  },
  cardContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.muted,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progress: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginTop: -1,
  },
  content: {
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
});
