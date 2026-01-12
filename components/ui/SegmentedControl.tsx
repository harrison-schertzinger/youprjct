import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export function SegmentedControl({ segments, selectedIndex, onChange }: Props) {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          style={[
            styles.segment,
            index === 0 && styles.segmentFirst,
            index === segments.length - 1 && styles.segmentLast,
            selectedIndex === index && styles.segmentActive,
          ]}
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && styles.segmentTextActive,
            ]}
          >
            {segment}
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
    marginBottom: tokens.spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFirst: {
    borderTopLeftRadius: tokens.radius.sm,
    borderBottomLeftRadius: tokens.radius.sm,
  },
  segmentLast: {
    borderTopRightRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
  segmentActive: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.sm,
  },
  segmentText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  segmentTextActive: {
    color: tokens.colors.text,
  },
});
