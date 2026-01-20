// BadgeUnlockModal - Celebration modal when user earns a new badge
// Premium feel with signature blue gradient and haptic feedback

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/design/tokens';
import { StreakBadge } from './StreakBadge';
import type { Badge } from '@/lib/badges';

type Props = {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
};

export function BadgeUnlockModal({ visible, badge, onClose }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && badge) {
      // Trigger success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next open
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible, badge, scaleAnim, opacityAnim]);

  if (!badge) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Celebration header */}
          <Text style={styles.celebrationText}>Badge Unlocked!</Text>

          {/* Badge display */}
          <View style={styles.badgeContainer}>
            <StreakBadge badge={badge} earned size="large" />
          </View>

          {/* Badge description */}
          <Text style={styles.description}>{badge.description}</Text>

          {/* Dismiss button */}
          <Pressable style={styles.dismissButton} onPress={onClose}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.dismissGradient}
            >
              <Text style={styles.dismissText}>Awesome!</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: tokens.colors.card,
    borderRadius: 24,
    paddingVertical: tokens.spacing.xl + 8,
    paddingHorizontal: tokens.spacing.lg,
    alignItems: 'center',
    // Elevated shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  celebrationText: {
    fontSize: 22,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.lg,
    letterSpacing: -0.3,
  },
  badgeContainer: {
    marginBottom: tokens.spacing.lg,
  },
  description: {
    fontSize: 15,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
    lineHeight: 22,
  },
  dismissButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    // Signature shadow
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  dismissGradient: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
