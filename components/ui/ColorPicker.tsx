import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';
import {
  GoalColor,
  GOAL_GRADIENTS,
  GOAL_COLOR_NAMES,
} from '@/features/goals/types';

const COLORS: GoalColor[] = [
  'ocean',
  'ember',
  'forest',
  'violet',
  'sunset',
  'midnight',
  'rose',
  'slate',
];

type Props = {
  selectedColor: GoalColor;
  onSelectColor: (color: GoalColor) => void;
};

export function ColorPicker({ selectedColor, onSelectColor }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Color</Text>
      <View style={styles.grid}>
        {COLORS.map((color) => {
          const gradient = GOAL_GRADIENTS[color];
          const isSelected = selectedColor === color;

          return (
            <Pressable
              key={color}
              style={[styles.colorOption, isSelected && styles.colorSelected]}
              onPress={() => onSelectColor(color)}
            >
              <LinearGradient
                colors={[gradient.start, gradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.colorSwatch}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </LinearGradient>
              <Text style={[styles.colorName, isSelected && styles.colorNameSelected]}>
                {GOAL_COLOR_NAMES[color]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: tokens.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  colorOption: {
    alignItems: 'center',
    width: 70,
  },
  colorSelected: {
    // Selection is shown via checkmark and name style
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  colorName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  colorNameSelected: {
    color: tokens.colors.text,
    fontWeight: '700',
  },
});
