import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';

type Props = {
  isWon: boolean;
  onPress: () => void;
};

/**
 * Premium "Day Won" button - the central action of the app.
 * Features signature blue gradient, subtle pulse animation, and strong haptic feedback.
 */
export function DayWonButton({ isWon, onPress }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Subtle pulse animation when day is not yet won
  useEffect(() => {
    if (!isWon) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.01,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      // Reset when won
      pulseAnim.setValue(1);
    }
  }, [isWon, pulseAnim]);

  const handlePress = () => {
    if (!isWon) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  if (isWon) {
    return (
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={handlePress}
      >
        <LinearGradient
          colors={['#DBEAFE', '#BFDBFE', '#93C5FD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.wonButton}
        >
          <Text style={styles.wonCheckmark}>✓</Text>
          <Text style={styles.wonText}>Day Won</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Win The Day</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    borderRadius: 10,
    // Tight 3-sided shadow - sun directly above
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  wonButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    borderRadius: 10,
    gap: tokens.spacing.sm,
    // Tight shadow for won state
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  wonCheckmark: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  wonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
});
