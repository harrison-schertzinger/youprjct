import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from './ScreenContainer';
import { PrimaryButton } from './PrimaryButton';
import { tokens } from '@/design/tokens';
import { useMembership } from '@/hooks/useMembership';

type Benefit = {
  title: string;
  description: string;
};

type Props = {
  /** The feature name shown in the header */
  feature: string;
  /** Short tagline for the feature */
  tagline: string;
  /** List of benefits specific to this feature */
  benefits: Benefit[];
  /** The actual screen content (shown when premium) */
  children: React.ReactNode;
};

// Set to true to bypass premium gate during development
const DEV_BYPASS_PREMIUM = __DEV__;

/**
 * PremiumGate wraps a screen and shows a locked state for non-premium users.
 * When the user is premium, the children are rendered normally.
 */
export function PremiumGate({ feature, tagline, benefits, children }: Props) {
  const { isPremium, isLoading } = useMembership();

  // Bypass gate in development mode
  if (DEV_BYPASS_PREMIUM) {
    return <>{children}</>;
  }

  // While loading, show nothing (prevents flash)
  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer} />
      </ScreenContainer>
    );
  }

  // Premium users see the actual content
  if (isPremium) {
    return <>{children}</>;
  }

  // Free users see the gate
  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>Pro</Text>
          </View>
          <Text style={styles.title}>{feature}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <PrimaryButton
            label="Unlock Pro"
            onPress={() => router.push('/premium')}
          />
          <Text style={styles.ctaSubtext}>
            Full access to all features
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: tokens.spacing.xl * 2,
  },
  lockBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.tint,
    marginBottom: tokens.spacing.lg,
  },
  lockIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  tagline: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  benefitsContainer: {
    paddingHorizontal: tokens.spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.lg,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: 2,
  },
  benefitDescription: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    lineHeight: 20,
  },
  ctaContainer: {
    marginTop: tokens.spacing.xl,
  },
  ctaSubtext: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
  },
});
