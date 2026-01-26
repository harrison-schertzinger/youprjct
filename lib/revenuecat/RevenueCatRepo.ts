// RevenueCatRepo: Manages subscription state for You.First
// Uses lazy require() to avoid crashes if native module not present

import { Platform, NativeModules, TurboModuleRegistry } from 'react-native';
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
  PurchasesError,
} from 'react-native-purchases';

// RevenueCat error codes - these indicate why a purchase failed
// See: https://www.revenuecat.com/docs/errors
export enum PurchaseErrorCode {
  USER_CANCELLED = 'USER_CANCELLED',
  STORE_PROBLEM = 'STORE_PROBLEM', // StoreKit error - system already showed alert
  NETWORK_ERROR = 'NETWORK_ERROR',
  PURCHASE_NOT_ALLOWED = 'PURCHASE_NOT_ALLOWED',
  PRODUCT_NOT_AVAILABLE = 'PRODUCT_NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

// Result type for purchase operations
export type PurchaseResult = {
  success: boolean;
  customerInfo: CustomerInfo | null;
  errorCode?: PurchaseErrorCode;
  errorMessage?: string;
};

// Check if running in Expo Go (which doesn't support native modules)
// Uses multiple indicators for robust detection
function isExpoGo(): boolean {
  // Check appOwnership - can be 'expo' or 'guest' in Expo Go
  const ownership = Constants.appOwnership;
  if (ownership === 'expo' || ownership === 'guest') {
    return true;
  }

  // Check executionEnvironment for newer Expo versions
  const execEnv = (Constants as { executionEnvironment?: string }).executionEnvironment;
  if (execEnv === 'storeClient') {
    return true;
  }

  return false;
}

// Check if RevenueCat native module is available
// Must check BEFORE requiring the package to avoid NativeEventEmitter crash
function isRevenueCatNativeModuleAvailable(): boolean {
  try {
    // Check for the native module directly
    // RevenueCat uses 'RNPurchases' as its native module name
    const nativeModule =
      TurboModuleRegistry.get('RNPurchases') ||
      NativeModules.RNPurchases;

    return nativeModule != null;
  } catch {
    return false;
  }
}

// Lazy getter for RevenueCat SDK
// Returns null if module not available (e.g., Expo Go without dev client)
function getRevenueCat(): typeof Purchases | null {
  // Skip native module loading entirely in Expo Go to prevent crashes
  if (isExpoGo()) {
    return null;
  }

  // Check if native module exists before requiring the full package
  // This prevents NativeEventEmitter crash during module initialization
  if (!isRevenueCatNativeModuleAvailable()) {
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
let configurationPromise: Promise<void> | null = null;

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

  // If already configuring, wait for that to complete
  if (configurationPromise) {
    return configurationPromise;
  }

  configurationPromise = (async () => {
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
  })();

  return configurationPromise;
}

/**
 * Get current customer info from RevenueCat.
 * Returns null if SDK not available or error occurs.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    // Wait for configuration to complete first
    if (configurationPromise) {
      await configurationPromise;
    }

    if (!isConfigured) {
      return null;
    }

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
    // Wait for configuration to complete first
    if (configurationPromise) {
      await configurationPromise;
    }

    if (!isConfigured) {
      return null;
    }

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
    // Wait for configuration to complete first
    if (configurationPromise) {
      await configurationPromise;
    }

    if (!isConfigured) {
      return null;
    }

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
 * Parse a RevenueCat error into our error code enum.
 *
 * IMPORTANT: RevenueCat PURCHASES_ERROR_CODE enum values are STRINGS, not numbers!
 * e.g., STORE_PROBLEM_ERROR = "2" (string), not 2 (number)
 *
 * See: node_modules/@revenuecat/purchases-typescript-internal/dist/errors.d.ts
 */
function parseRevenueCatError(error: unknown): { code: PurchaseErrorCode; message: string } {
  if (!error || typeof error !== 'object') {
    return { code: PurchaseErrorCode.UNKNOWN, message: 'An unknown error occurred' };
  }

  const rcError = error as Partial<PurchasesError> & {
    userCancelled?: boolean;
    code?: string | number; // Can be string enum value OR number
    message?: string;
  };

  // User cancelled - not an error, just a cancellation (deprecated but still used)
  if (rcError.userCancelled) {
    return { code: PurchaseErrorCode.USER_CANCELLED, message: 'Purchase cancelled' };
  }

  // Get the error code - handle both string and number for safety
  // RevenueCat SDK v9+ uses string enum values like "2" for STORE_PROBLEM_ERROR
  const rawCode = rcError.code;
  const errorCode: string = rawCode !== undefined ? String(rawCode) : '-1';
  const errorMessage = rcError.message || 'Purchase could not be completed';

  // Map RevenueCat PURCHASES_ERROR_CODE enum string values to our enum
  // Based on: node_modules/@revenuecat/purchases-typescript-internal/dist/errors.d.ts
  const errorCodeMap: Record<string, PurchaseErrorCode> = {
    '0': PurchaseErrorCode.UNKNOWN,           // UNKNOWN_ERROR
    '1': PurchaseErrorCode.USER_CANCELLED,    // PURCHASE_CANCELLED_ERROR
    '2': PurchaseErrorCode.STORE_PROBLEM,     // STORE_PROBLEM_ERROR - StoreKit already showed alert!
    '3': PurchaseErrorCode.PURCHASE_NOT_ALLOWED, // PURCHASE_NOT_ALLOWED_ERROR
    '4': PurchaseErrorCode.PURCHASE_NOT_ALLOWED, // PURCHASE_INVALID_ERROR
    '5': PurchaseErrorCode.PRODUCT_NOT_AVAILABLE, // PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR
    '10': PurchaseErrorCode.NETWORK_ERROR,    // NETWORK_ERROR
  };

  const mappedCode = errorCodeMap[errorCode] ?? PurchaseErrorCode.UNKNOWN;

  // Log for debugging (remove in production if too verbose)
  console.log('RevenueCat error parsed:', { rawCode, errorCode, mappedCode, errorMessage });

  // For user cancellation, use a standard message
  if (mappedCode === PurchaseErrorCode.USER_CANCELLED) {
    return { code: mappedCode, message: 'Purchase cancelled' };
  }

  // For network errors, use a more helpful message
  if (mappedCode === PurchaseErrorCode.NETWORK_ERROR) {
    return { code: mappedCode, message: 'Please check your internet connection' };
  }

  // For all other errors, use the original error message
  return { code: mappedCode, message: errorMessage };
}

/**
 * Purchase a package.
 *
 * @param pkg - The package to purchase from offerings
 * @returns PurchaseResult with success status, customer info, and error details
 *
 * IMPORTANT: When errorCode is STORE_PROBLEM, StoreKit has already shown
 * an error alert to the user. Do NOT show another alert in this case.
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<PurchaseResult> {
  try {
    // Wait for configuration to complete first
    if (configurationPromise) {
      await configurationPromise;
    }

    if (!isConfigured) {
      return {
        success: false,
        customerInfo: null,
        errorCode: PurchaseErrorCode.UNKNOWN,
        errorMessage: 'Subscription service is not available',
      };
    }

    const PurchasesSDK = getRevenueCat();
    if (!PurchasesSDK) {
      return {
        success: false,
        customerInfo: null,
        errorCode: PurchaseErrorCode.UNKNOWN,
        errorMessage: 'Subscription service is not available',
      };
    }

    const { customerInfo } = await PurchasesSDK.purchasePackage(pkg);
    return {
      success: true,
      customerInfo,
    };
  } catch (error: unknown) {
    const { code, message } = parseRevenueCatError(error);

    // Only log non-cancellation errors
    if (code !== PurchaseErrorCode.USER_CANCELLED) {
      console.error('RevenueCatRepo: Purchase error:', { code, message, error });
    }

    return {
      success: false,
      customerInfo: null,
      errorCode: code,
      errorMessage: message,
    };
  }
}

// Re-export types for use in hooks/components
export type { CustomerInfo, PurchasesPackage, PurchasesOffering, PurchasesOfferings };
