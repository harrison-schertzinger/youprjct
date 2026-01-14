import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';
import { CheckCircle } from './CheckCircle';
import { Chip } from './Chip';

type Props = {
  title: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  chipText?: string;
};

export function RoutineListItem({ title, checked, onToggle, onDelete, chipText }: Props) {
  return (
    <View style={styles.row}>
      <CheckCircle checked={checked} onPress={onToggle} />
      <View style={styles.content}>
        <Text
          style={[styles.title, checked && styles.titleChecked]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
      {chipText && (
        <View style={styles.chipContainer}>
          <Chip label={chipText} />
        </View>
      )}
      <Pressable style={styles.deleteButton} onPress={onDelete} hitSlop={8}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  titleChecked: {
    color: tokens.colors.muted,
    textDecorationLine: 'line-through',
  },
  chipContainer: {
    marginRight: 8,
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.muted,
    lineHeight: 20,
  },
});
