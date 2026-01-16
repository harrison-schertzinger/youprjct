import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

type Props = {
  selectedOffset: number; // 0 = today, 1 = tomorrow, etc.
  maxOffset?: number; // default 3
  onSelectOffset: (offset: number) => void;
};

function getDateLabel(offset: number): string {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';

  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Day picker for planning tasks up to a few days ahead.
 * Shows < Today > style navigation.
 */
export function DayPicker({ selectedOffset, maxOffset = 3, onSelectOffset }: Props) {
  const canGoBack = selectedOffset > 0;
  const canGoForward = selectedOffset < maxOffset;

  const handleBack = () => {
    if (canGoBack) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectOffset(selectedOffset - 1);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectOffset(selectedOffset + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        disabled={!canGoBack}
        style={({ pressed }) => [
          styles.arrow,
          !canGoBack && styles.arrowDisabled,
          pressed && canGoBack && styles.arrowPressed,
        ]}
      >
        <Text style={[styles.arrowText, !canGoBack && styles.arrowTextDisabled]}>‹</Text>
      </Pressable>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>{getDateLabel(selectedOffset)}</Text>
        {selectedOffset > 0 && (
          <Text style={styles.planningBadge}>Planning</Text>
        )}
      </View>

      <Pressable
        onPress={handleForward}
        disabled={!canGoForward}
        style={({ pressed }) => [
          styles.arrow,
          !canGoForward && styles.arrowDisabled,
          pressed && canGoForward && styles.arrowPressed,
        ]}
      >
        <Text style={[styles.arrowText, !canGoForward && styles.arrowTextDisabled]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  arrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radius.sm,
  },
  arrowPressed: {
    backgroundColor: tokens.colors.bg,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '300',
    color: tokens.colors.text,
  },
  arrowTextDisabled: {
    color: tokens.colors.muted,
  },
  labelContainer: {
    minWidth: 140,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
  },
  label: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
  },
  planningBadge: {
    ...tokens.typography.caption,
    color: tokens.colors.tint,
    marginTop: 2,
  },
});
