import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  label: string;
};

export function Chip({ label }: Props) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
});
