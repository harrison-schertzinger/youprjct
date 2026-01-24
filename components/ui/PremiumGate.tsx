import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SignatureButton } from './SignatureButton';
import { tokens } from '@/design/tokens';
import { useMembership } from '@/hooks/useMembership';

const PRIVACY_POLICY_URL = 'https://youprjct.com/privacy';
const TERMS_OF_USE_URL = 'https://youprjct.com/terms';

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

// Bypass premium gate in development or internal testing builds
// For App Store submission, ensure EXPO_PUBLIC_INTERNAL_TESTING is NOT set
const DEV_BYPASS_PREMIUM = __DEV__ || process.env.EXPO_PUBLIC_INTERNAL_TESTING === 'true';

/**
 * PremiumGate wraps a screen and shows a locked overlay for non-premium users.
 * Content is visible behind the overlay to create FOMO.
 * When the user is premium, the children are rendered normally.
 */
export function PremiumGate({ feature, tagline, benefits, children }: Props) {
  const { isPremium, isLoading, refreshCustomerInfo } = useMembership();

  // Refresh membership state when screen comes into focus
  // This ensures we detect purchases made on the premium screen
  useFocusEffect(
    useCallback(() => {
      refreshCustomerInfo();
    }, [refreshCustomerInfo])
  );

  // Bypass in development mode
  if (DEV_BYPASS_PREMIUM) {
    return <>{children}</>;
  }

  // While loading, show nothing (prevents flash)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {children}
      </View>
    );
  }

  // Premium users see the actual content
  if (isPremium) {
    return <>{children}</>;
  }

  // Free users see content behind frosted overlay
  return (
    <View style={styles.container}>
      {/* Content visible behind overlay */}
      <View style={styles.contentBehind} pointerEvents="none">
        {children}
      </View>

      {/* Dark overlay */}
      <View style={styles.overlay}>
        {/* Floating subscription card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.proBadge}
          >
            <Text style={styles.proBadgeText}>PRO</Text>
          </LinearGradient>

          <Text style={styles.featureTitle}>{feature}</Text>
          <Text style={styles.featureTagline}>{tagline}</Text>

          {/* Benefits - compact version */}
          <View style={styles.benefitsList}>
            {benefits.slice(0, 3).map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>{benefit.title}</Text>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricingRow}>
            <Text style={styles.price}>$4.99</Text>
            <Text style={styles.period}>/month</Text>
          </View>

          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>First month free</Text>
          </View>

          {/* CTA */}
          <SignatureButton
            title="Unlock Pro"
            onPress={() => router.push('/premium')}
            size="large"
            fullWidth
            style={styles.ctaButton}
          />

          <Pressable
            style={styles.restoreButton}
            onPress={() => router.push('/premium')}
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </Pressable>

          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <Pressable onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
              <Text style={styles.legalLink}>Terms</Text>
            </Pressable>
            <Text style={styles.legalSeparator}>•</Text>
            <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
              <Text style={styles.legalLink}>Privacy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    opacity: 0,
  },
  container: {
    flex: 1,
  },
  contentBehind: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: tokens.colors.card,
    borderRadius: 20,
    paddingVertical: tokens.spacing.xl + 8,
    paddingHorizontal: tokens.spacing.lg,
    alignItems: 'center',
    // Elevated shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  proBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.md,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  featureTagline: {
    fontSize: 15,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  benefitsList: {
    width: '100%',
    marginBottom: tokens.spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3B82F6',
    marginRight: tokens.spacing.sm,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: tokens.spacing.sm,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: tokens.colors.text,
    letterSpacing: -0.5,
  },
  period: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginLeft: 2,
  },
  trialBadge: {
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: '#DBEAFE',
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.lg,
  },
  trialText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  ctaButton: {
    marginBottom: tokens.spacing.sm,
  },
  restoreButton: {
    paddingVertical: tokens.spacing.sm,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
  },
  legalLink: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.tint,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    color: tokens.colors.muted,
    marginHorizontal: tokens.spacing.xs,
  },
});
