import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  wins: number;
  total: number;
};

export function WeekBattery({ wins, total }: Props) {
  const segments = Array.from({ length: 7 }, (_, i) => i < wins);

  return (
    <View style={styles.container}>
      {segments.map((filled, idx) => (
        <View
          key={idx}
          style={[
            styles.segment,
            filled && styles.segmentFilled,
            idx === 0 && styles.segmentFirst,
            idx === 6 && styles.segmentLast,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  segment: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: tokens.colors.border,
  },
  segmentFilled: {
    backgroundColor: tokens.colors.action,
  },
  segmentFirst: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  segmentLast: {
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    borderRightWidth: 0,
  },
});
