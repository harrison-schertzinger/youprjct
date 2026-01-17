import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { tokens } from '@/design/tokens';
import { useMembership } from '@/hooks/useMembership';
import {
  getOfferings,
  purchasePackage,
  type PurchasesPackage,
} from '@/lib/revenuecat';

const BENEFITS = [
  'Unlock all training tracks',
  'Detailed performance analytics',
  'Priority support',
  'Early access to new features',
  'Support continued development',
];

export default function PremiumScreen() {
  const { isPremium, isLoading: membershipLoading, restore, refreshCustomerInfo } = useMembership();
  const [offerCode, setOfferCode] = useState('');
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

  const handleContinue = async () => {
    if (!availablePackage) {
      Alert.alert(
        'Coming Soon',
        'Subscriptions are coming online soon. Check back shortly!',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsPurchasing(true);
    try {
      const customerInfo = await purchasePackage(availablePackage);
      if (customerInfo) {
        await refreshCustomerInfo();
        Alert.alert('Welcome to Pro!', 'Thank you for your support.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Failed', 'Please try again later.');
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

  const handleRedeemOfferCode = async () => {
    // Build the App Store offer code redemption URL
    const appleAppId = process.env.EXPO_PUBLIC_APPLE_APP_ID;
    let redeemUrl: string;

    if (appleAppId) {
      redeemUrl = `https://apps.apple.com/redeem?ctx=offercodes&id=${appleAppId}`;
    } else {
      // Fallback to generic redemption page
      redeemUrl = 'https://apps.apple.com/redeem';
    }

    try {
      const supported = await Linking.canOpenURL(redeemUrl);
      if (supported) {
        await Linking.openURL(redeemUrl);
      } else {
        Alert.alert('Cannot Open', 'Unable to open the App Store redemption page.');
      }
    } catch (error) {
      console.error('Error opening redeem URL:', error);
      Alert.alert('Error', 'Failed to open the redemption page.');
    }
  };

  // If already premium, show confirmation state
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
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>★</Text>
            </View>
            <Text style={styles.title}>You&apos;re a Pro!</Text>
            <Text style={styles.subtitle}>
              Thank you for supporting You. First
            </Text>
            <PrimaryButton
              label="Back to Profile"
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
          title: 'Upgrade',
          headerBackTitle: 'Back',
        }}
      />
      <ScreenContainer>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>★</Text>
            </View>
            <Text style={styles.title}>Upgrade to Pro</Text>
            <Text style={styles.subtitle}>
              Unlock the full You. First experience
            </Text>
          </View>

          {/* Benefits Card */}
          <Card style={styles.benefitsCard}>
            {BENEFITS.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </Card>

          {/* Action Buttons */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tokens.colors.tint} />
            </View>
          ) : (
            <>
              <PrimaryButton
                label={isPurchasing ? 'Processing...' : 'Continue'}
                onPress={handleContinue}
                style={styles.continueButton}
              />
              <PrimaryButton
                label={isRestoring ? 'Restoring...' : 'Restore Purchases'}
                onPress={handleRestore}
                style={styles.restoreButton}
              />
            </>
          )}

          {/* Offer Code Section */}
          {Platform.OS === 'ios' && (
            <Card style={styles.offerCard}>
              <Text style={styles.offerTitle}>Have a code?</Text>
              <Text style={styles.offerSubtitle}>
                Redeem your offer code in the App Store
              </Text>
              <TextInput
                style={styles.input}
                value={offerCode}
                onChangeText={setOfferCode}
                placeholder="Enter offer code"
                placeholderTextColor={tokens.colors.muted}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <PrimaryButton
                label="Redeem Offer Code"
                onPress={handleRedeemOfferCode}
                style={styles.redeemButton}
              />
              <Text style={styles.redeemHint}>
                After redeeming, tap &quot;Restore Purchases&quot; to sync your membership.
              </Text>
            </Card>
          )}
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.xl * 2,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    marginTop: tokens.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  icon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
  },
  benefitsCard: {
    marginBottom: tokens.spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  checkmark: {
    fontSize: 18,
    color: tokens.colors.action,
    fontWeight: '700',
    marginRight: tokens.spacing.sm,
    width: 24,
  },
  benefitText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  loadingContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    marginBottom: tokens.spacing.sm,
  },
  restoreButton: {
    backgroundColor: tokens.colors.muted,
    marginBottom: tokens.spacing.xl,
  },
  backButton: {
    width: '100%',
    marginTop: tokens.spacing.xl,
  },
  offerCard: {
    marginTop: tokens.spacing.md,
  },
  offerTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  offerSubtitle: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.md,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    ...tokens.typography.body,
    color: tokens.colors.text,
    backgroundColor: tokens.colors.bg,
    marginBottom: tokens.spacing.md,
  },
  redeemButton: {
    backgroundColor: tokens.colors.action,
  },
  redeemHint: {
    ...tokens.typography.small,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginTop: tokens.spacing.md,
  },
});
