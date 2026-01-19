import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/design/tokens';
import { SignatureButton } from './SignatureButton';

type Props = {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Premium empty state component for when lists/sections have no content.
 * Provides visual guidance and optional call-to-action.
 */
export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <View style={styles.actionWrapper}>
          <SignatureButton
            title={actionLabel}
            onPress={onAction}
            size="default"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 1.5,
    paddingHorizontal: tokens.spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  message: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionWrapper: {
    marginTop: tokens.spacing.lg,
  },
});
