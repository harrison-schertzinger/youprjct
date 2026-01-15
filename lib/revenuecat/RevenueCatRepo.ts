// RevenueCatRepo: Manages subscription state for You.First
// Uses lazy require() to avoid crashes if native module not present

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getCurrentUserId } from '@/lib/supabase/AuthRepo';

// Import types from react-native-purchases for TypeScript
// These are type-only imports and won't cause runtime issues
import type Purchases from 'react-native-purchases';
import type {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
  PurchasesOfferings,
} from 'react-native-purchases';

// Check if running in Expo Go (which doesn't support native modules)
function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

// Lazy getter for RevenueCat SDK
// Returns null if module not available (e.g., Expo Go without dev client)
function getRevenueCat(): typeof Purchases | null {
  // Skip native module loading entirely in Expo Go to prevent crashes
  if (isExpoGo()) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PurchasesModule = require('react-native-purchases').default;
    return PurchasesModule;
  } catch (error) {
    console.warn('RevenueCatRepo: react-native-purchases not available');
    return null;
  }
}

// Track if we've already configured RevenueCat this session
let isConfigured = false;

/**
 * Configure RevenueCat SDK.
 *
 * - Uses EXPO_PUBLIC_REVENUECAT_IOS_API_KEY on iOS
 * - Uses EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY on Android
 * - If key missing, no-ops silently (no crash)
 * - If Supabase user exists, uses that ID as app user ID
 * - Otherwise uses anonymous RevenueCat ID
 *
 * Call this once at app start, after ensureSession().
 */
export async function configureRevenueCat(): Promise<void> {
  if (isConfigured) {
    return;
  }

  try {
    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return;
    }

    // Get the appropriate API key for this platform
    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
      android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
      default: undefined,
    });

    if (!apiKey) {
      console.warn('RevenueCatRepo: No API key configured for this platform');
      return;
    }

    // Try to get Supabase user ID for RevenueCat app user ID
    const supabaseUserId = await getCurrentUserId();

    if (supabaseUserId) {
      // Configure with Supabase user ID
      await PurchasesSDK.configure({
        apiKey,
        appUserID: supabaseUserId,
      });
    } else {
      // Configure anonymously
      await PurchasesSDK.configure({ apiKey });
    }

    isConfigured = true;
  } catch (error) {
    // Fail silently - subscriptions are non-essential
    console.error('RevenueCatRepo: Error configuring:', error);
  }
}

/**
 * Get current customer info from RevenueCat.
 * Returns null if SDK not available or error occurs.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return null;
    }

    const customerInfo = await PurchasesSDK.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('RevenueCatRepo: Error getting customer info:', error);
    return null;
  }
}

/**
 * Check if user has an active entitlement.
 *
 * @param customerInfo - Customer info from getCustomerInfo()
 * @param entitlementId - Entitlement identifier (default: 'premium')
 * @returns true if user has active entitlement
 */
export function isPremium(
  customerInfo: CustomerInfo | null,
  entitlementId: string = 'premium'
): boolean {
  if (!customerInfo) {
    return false;
  }

  const entitlement = customerInfo.entitlements.active[entitlementId];
  return entitlement?.isActive === true;
}

/**
 * Restore purchases for current user.
 * Useful after reinstall or on new device.
 *
 * @returns Updated customer info, or null on error
 */
export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return null;
    }

    const customerInfo = await PurchasesSDK.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('RevenueCatRepo: Error restoring purchases:', error);
    return null;
  }
}

/**
 * Get available offerings/packages for purchase.
 * Returns null if SDK not available, no offerings configured, or error.
 */
export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return null;
    }

    const offerings = await PurchasesSDK.getOfferings();
    return offerings;
  } catch (error) {
    console.error('RevenueCatRepo: Error getting offerings:', error);
    return null;
  }
}

/**
 * Purchase a package.
 *
 * @param pkg - The package to purchase from offerings
 * @returns Updated customer info after purchase, or null on error/cancel
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  try {
    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return null;
    }

    const { customerInfo } = await PurchasesSDK.purchasePackage(pkg);
    return customerInfo;
  } catch (error: unknown) {
    // Check if user cancelled (not a real error)
    if (
      error &&
      typeof error === 'object' &&
      'userCancelled' in error &&
      (error as { userCancelled: boolean }).userCancelled
    ) {
      return null;
    }
    console.error('RevenueCatRepo: Error purchasing package:', error);
    return null;
  }
}

// Re-export types for use in hooks/components
export type { CustomerInfo, PurchasesPackage, PurchasesOffering, PurchasesOfferings };
