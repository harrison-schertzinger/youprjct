// PeriodToggle: Compact toggle for chart time periods
// 7D | 1M | 6M selector

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { tokens } from '@/design/tokens';

export type Period = '7D' | '1M' | '6M';

type Props = {
  selected: Period;
  onChange: (period: Period) => void;
};

const PERIODS: Period[] = ['7D', '1M', '6M'];

export function PeriodToggle({ selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      {PERIODS.map((period) => (
        <Pressable
          key={period}
          style={[styles.button, selected === period && styles.buttonActive]}
          onPress={() => onChange(period)}
        >
          <Text style={[styles.text, selected === period && styles.textActive]}>
            {period}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    padding: 2,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: tokens.radius.sm - 2,
  },
  buttonActive: {
    backgroundColor: tokens.colors.card,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  textActive: {
    color: tokens.colors.text,
  },
});
