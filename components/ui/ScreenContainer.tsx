import React from 'react';
import { View, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/design/tokens';

// Space to clear the floating tab bar (76px height + 16px margin + buffer)
const TAB_BAR_CLEARANCE = 100;

// Height of the subtle top edge fade
const TOP_FADE_HEIGHT = 12;

// Background color with alpha for true transparent gradient
const BG_TRANSPARENT = 'rgba(247, 247, 245, 0)';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Remove extra top padding for tighter layouts */
  compact?: boolean;
};

export function ScreenContainer({ children, style, compact = false }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.inner,
            {
              // Dynamic safe area: just the inset + minimal breathing room
              paddingTop: insets.top + (compact ? 0 : tokens.spacing.xs),
            },
            style,
          ]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>

      {/* Premium: Subtle top edge fade for smooth status bar transition */}
      <LinearGradient
        colors={[tokens.colors.bg, BG_TRANSPARENT]}
        style={[styles.topFade, { top: insets.top }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: tokens.spacing.sm + 2, // 12px - tighter base, elements add their own margin
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  topFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TOP_FADE_HEIGHT,
    zIndex: 10,
  },
});
