import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SignatureButton } from '@/components/ui/SignatureButton';
import { tokens } from '@/design/tokens';
import { useMembership } from '@/hooks/useMembership';
import {
  getOfferings,
  purchasePackage,
  PurchaseErrorCode,
  type PurchasesPackage,
} from '@/lib/revenuecat';

const BENEFITS = [
  { title: 'Complete System', desc: 'Mind, body, and discipline training unified' },
  { title: 'Train Smarter', desc: 'Structured S&C programs for real results' },
  { title: 'Track Your Progress', desc: 'Analytics and insights across every area' },
];

const PRIVACY_POLICY_URL = 'https://youprjct.com/privacy';
const TERMS_OF_USE_URL = 'https://youprjct.com/terms';

export default function PremiumScreen() {
  const { isPremium, isLoading: membershipLoading, restore, refreshCustomerInfo } = useMembership();
  const [isRestoring, setIsRestoring] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [availablePackage, setAvailablePackage] = useState<PurchasesPackage | null>(null);
  const [loadingOfferings, setLoadingOfferings] = useState(true);

  const loadOfferings = useCallback(async () => {
    setLoadingOfferings(true);
    try {
      const offerings = await getOfferings();
      if (offerings?.current?.availablePackages?.length) {
        setAvailablePackage(offerings.current.availablePackages[0]);
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
    } finally {
      setLoadingOfferings(false);
    }
  }, []);

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  const handleSubscribe = async () => {
    if (isPurchasing) return;

    setIsPurchasing(true);
    try {
      if (availablePackage) {
        const result = await purchasePackage(availablePackage);

        if (result.success && result.customerInfo) {
          // Purchase successful
          await refreshCustomerInfo();
          Alert.alert('Welcome to Pro!', 'Thank you for your support.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        } else if (result.errorCode) {
          // Handle different error types appropriately
          switch (result.errorCode) {
            case PurchaseErrorCode.USER_CANCELLED:
              // User cancelled - do nothing, just return silently
              break;

            case PurchaseErrorCode.STORE_PROBLEM:
              // CRITICAL: StoreKit already showed an error alert to the user
              // (e.g., "Your account is temporarily unavailable")
              // Do NOT show another alert - it would be redundant and confusing
              console.log('Store problem - StoreKit already showed alert');
              break;

            case PurchaseErrorCode.NETWORK_ERROR:
              // Network error - show a helpful message
              Alert.alert(
                'Connection Issue',
                'Please check your internet connection and try again.'
              );
              break;

            case PurchaseErrorCode.PURCHASE_NOT_ALLOWED:
              // Purchases not allowed on this device/account
              Alert.alert(
                'Purchase Not Available',
                'Purchases are not allowed on this device. Please check your device settings.'
              );
              break;

            case PurchaseErrorCode.PRODUCT_NOT_AVAILABLE:
              // Product not available in this region or not configured
              Alert.alert(
                'Subscription Unavailable',
                'This subscription is not available at the moment. Please try again later.'
              );
              break;

            default:
              // Unknown error - show generic message only if we haven't shown one already
              Alert.alert(
                'Unable to Complete',
                'Something went wrong. Please try again later.'
              );
          }
        }
      } else {
        // No package loaded - offerings not available from RevenueCat
        // This can happen if:
        // 1. Subscriptions aren't configured in RevenueCat dashboard
        // 2. Products aren't approved in App Store Connect
        // 3. Network issue fetching offerings
        Alert.alert(
          'Subscription Unavailable',
          'Unable to load subscription options. Please try again later or contact support if this persists.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      // This catch should rarely be hit now since purchasePackage handles its own errors
      console.error('Unexpected purchase error:', error);
      Alert.alert(
        'Unable to Complete',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const restored = await restore();
      if (restored) {
        Alert.alert('Restored!', 'Your Pro membership has been restored.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          'No Purchases Found',
          'We could not find any previous purchases for this account.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Restore Failed', 'Please try again later.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Already premium - show confirmation
  if (isPremium && !membershipLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Pro Member',
            headerBackTitle: 'Back',
          }}
        />
        <ScreenContainer>
          <View style={styles.successContainer}>
            <View style={styles.successBadge}>
              <Text style={styles.successIcon}>★</Text>
            </View>
            <Text style={styles.successTitle}>You're Pro</Text>
            <Text style={styles.successSubtitle}>
              Thank you for supporting You. First
            </Text>
            <SignatureButton
              title="Back to App"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </View>
        </ScreenContainer>
      </>
    );
  }

  const isLoading = membershipLoading || loadingOfferings;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Back',
          headerTransparent: true,
        }}
      />
      <ScreenContainer>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/PRO.png')}
              style={styles.proIcon}
              resizeMode="contain"
            />
            <Text style={styles.title}>You. Pro</Text>
            <Text style={styles.tagline}>Unlock your full potential</Text>
          </View>

          {/* Pricing Card */}
          <View style={styles.pricingCard}>
            <Text style={styles.cardTagline}>Your personal excellence system</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$4.99</Text>
              <Text style={styles.period}>/month</Text>
            </View>
            <View style={styles.trialBadge}>
              <Text style={styles.trialText}>First month free</Text>
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.benefits}>
            {BENEFITS.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <View style={styles.benefitCheck}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tokens.colors.tint} />
            </View>
          ) : (
            <View style={styles.ctaContainer}>
              <SignatureButton
                title={isPurchasing ? 'Processing...' : 'Get Started'}
                onPress={handleSubscribe}
                disabled={isPurchasing}
                size="large"
                fullWidth
              />
              <Pressable
                style={styles.restoreButton}
                onPress={handleRestore}
                disabled={isRestoring}
              >
                <Text style={styles.restoreText}>
                  {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Subscription Terms */}
          <View style={styles.legalSection}>
            <Text style={styles.terms}>
              Cancel anytime. Subscription auto-renews monthly at $4.99/month after the 1-month free trial.
            </Text>
            <View style={styles.legalLinks}>
              <Pressable onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
                <Text style={styles.legalLink}>Terms of Use</Text>
              </Pressable>
              <Text style={styles.legalSeparator}>•</Text>
              <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: tokens.spacing.xl * 3,
    paddingBottom: tokens.spacing.xl * 2,
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  proIcon: {
    width: 120,
    height: 90,
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: tokens.colors.text,
    letterSpacing: -0.5,
    marginBottom: tokens.spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: tokens.colors.muted,
  },
  // Pricing Card
  pricingCard: {
    alignItems: 'center',
    backgroundColor: tokens.colors.card,
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
    paddingVertical: tokens.spacing.xl + 16,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    // Signature shadow
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTagline: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    letterSpacing: 0.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    color: tokens.colors.text,
    letterSpacing: -1,
  },
  period: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.muted,
    marginLeft: 4,
  },
  trialBadge: {
    marginTop: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: '#DBEAFE',
    borderRadius: tokens.radius.pill,
  },
  trialText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  // Benefits
  benefits: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 14,
    color: tokens.colors.muted,
    lineHeight: 20,
  },
  // CTA
  loadingContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContainer: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  restoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.muted,
  },
  // Terms & Legal
  legalSection: {
    alignItems: 'center',
    marginHorizontal: tokens.spacing.lg,
  },
  terms: {
    fontSize: 12,
    color: tokens.colors.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: tokens.spacing.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.tint,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: tokens.colors.muted,
    marginHorizontal: tokens.spacing.sm,
  },
  // Success State
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  successIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  successSubtitle: {
    fontSize: 16,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  backButton: {
    marginTop: tokens.spacing.xl,
  },
});
