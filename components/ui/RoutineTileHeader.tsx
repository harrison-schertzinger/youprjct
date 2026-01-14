import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  icon: string;
  title: string;
  completedCount: number;
  totalCount: number;
  onAdd: () => void;
};

export function RoutineTileHeader({ icon, title, completedCount, totalCount, onAdd }: Props) {
  const hasItems = totalCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        {hasItems && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        )}
        <Pressable style={styles.addButton} onPress={onAdd} hitSlop={8}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text,
    letterSpacing: -0.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBadge: {
    backgroundColor: tokens.colors.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: tokens.radius.pill,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginTop: -1,
  },
});
