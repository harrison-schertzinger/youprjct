import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
};

/**
 * Premium loading state component with subtle spinner.
 * Use in place of bare "Loading..." text throughout the app.
 */
export function LoadingState({ message, size = 'small', fullScreen = false }: Props) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator
        size={size}
        color={tokens.colors.muted}
        style={message ? styles.spinner : undefined}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  fullScreen: {
    flex: 1,
    paddingVertical: 0,
  },
  spinner: {
    marginBottom: tokens.spacing.sm,
  },
  message: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
  },
});
