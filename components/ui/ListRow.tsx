import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { Chip } from '@/components/ui/Chip';

type Props = {
  title: string;
  checked?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;

  // right side
  rightChipText?: string;
  rightChipTone?: 'neutral' | 'primary';
};

export function ListRow({
  title,
  checked = false,
  onToggle,
  onDelete,
  rightChipText,
  rightChipTone = 'neutral',
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onToggle} style={styles.rowContent}>
        {/* Left */}
        <View style={[styles.box, checked && styles.boxChecked]} />

        {/* Middle */}
        <View style={styles.middle}>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {/* Right chip */}
        <View style={styles.right}>
          {rightChipText ? <Chip text={rightChipText} tone={rightChipTone} /> : null}
        </View>
      </Pressable>

      {/* Delete button */}
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
          <Text style={styles.deleteText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    height: 26,
    width: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    marginRight: 14,
    flexShrink: 0,
  },
  boxChecked: {
    backgroundColor: tokens.colors.text,
    borderColor: tokens.colors.text,
  },
  middle: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  title: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
  },
  right: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  deleteBtn: {
    marginLeft: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.muted,
    lineHeight: 22,
  },
});
