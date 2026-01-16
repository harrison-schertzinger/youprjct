import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

type Props = {
  checked: boolean;
  onPress?: () => void;
  size?: number;
};

export function CheckCircle({ checked, onPress, size = 24 }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          checked && styles.circleChecked,
        ]}
      >
        {checked && <Text style={[styles.checkmark, { fontSize: size * 0.55 }]}>✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 2,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleChecked: {
    backgroundColor: tokens.colors.action,
    borderColor: tokens.colors.action,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -1,
  },
});
