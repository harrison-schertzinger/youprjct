import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'default' | 'large';
};

export function PrimaryButton({ label, onPress, style, size = 'default' }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        size === 'large' && styles.btnLarge,
        pressed && styles.pressed,
        style
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, size === 'large' && styles.textLarge]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLarge: {
    height: 62,
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
  textLarge: {
    fontSize: 18,
  },
});
