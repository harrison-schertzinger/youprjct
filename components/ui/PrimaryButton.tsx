import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
