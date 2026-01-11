import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/design/tokens';
import { Chip } from '@/components/ui/Chip';

type Props = {
  title: string;
  checked?: boolean;
  onToggle?: () => void;

  // right side
  rightChipText?: string;
  rightChipTone?: 'neutral' | 'primary';
};

export function ListRow({
  title,
  checked = false,
  onToggle,
  rightChipText,
  rightChipTone = 'neutral',
}: Props) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
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

      {/* Right */}
      <View style={styles.right}>
        {rightChipText ? <Chip text={rightChipText} tone={rightChipTone} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
    minWidth: 0, // KEY: allows ellipsis instead of pushing into the chip
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
});
