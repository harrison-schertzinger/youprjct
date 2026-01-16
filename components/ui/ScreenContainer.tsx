import React from 'react';
import { SafeAreaView, View, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { tokens } from '@/design/tokens';

// Space to clear the floating tab bar (76px height + 16px margin + buffer)
const TAB_BAR_CLEARANCE = 100;

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ScreenContainer({ children, style }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.inner, style]}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: tokens.spacing.sm + 2, // 12px - tighter base, elements add their own margin
    paddingTop: tokens.spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
});
