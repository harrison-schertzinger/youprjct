// SignatureButton - Premium primary action button
// Signature blue gradient with 3-sided shadow

import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

type SignatureButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  size?: 'default' | 'large' | 'small';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function SignatureButton({
  title,
  onPress,
  disabled = false,
  size = 'default',
  fullWidth = false,
  style,
  textStyle,
}: SignatureButtonProps) {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 16 },
    default: { paddingVertical: 14, paddingHorizontal: 24 },
    large: { paddingVertical: 18, paddingHorizontal: 32 },
  };

  const fontSizes = {
    small: 14,
    default: 16,
    large: 18,
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={disabled ? ['#94A3B8', '#64748B'] : ['#3B82F6', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradient,
          sizeStyles[size],
        ]}
      >
        <Text
          style={[
            styles.text,
            { fontSize: fontSizes[size] },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    // Tight 3-sided shadow - sun directly above
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    shadowColor: '#64748B',
    shadowOpacity: 0.15,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
