// IAPService: Direct StoreKit 2 integration via react-native-iap
// Replaces RevenueCat for simpler, more reliable purchases

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product IDs - must match App Store Connect exactly
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'youprjct_pro_monthly',
} as const;

// Storage key for premium status (cached locally for offline access)
const PREMIUM_STATUS_KEY = '@iap:premium_status';
const PREMIUM_EXPIRY_KEY = '@iap:premium_expiry';

// Type definitions
export type Product = {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
};

export type Purchase = {
  productId: string;
  transactionId: string;
  transactionDate: number;
  transactionReceipt: string;
};

// Lazy load react-native-iap to prevent crashes if not available
let RNIap: typeof import('react-native-iap') | null = null;

function getIAPModule(): typeof import('react-native-iap') | null {
  if (RNIap) return RNIap;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    RNIap = require('react-native-iap');
    return RNIap;
  } catch (error) {
    console.warn('IAPService: react-native-iap not available');
    return null;
  }
}

// Track initialization state
let isInitialized = false;

/**
 * Initialize the IAP connection.
 * Call once at app startup.
 */
export async function initializeIAP(): Promise<boolean> {
  if (isInitialized) return true;

  const IAP = getIAPModule();
  if (!IAP) return false;

  try {
    // Initialize connection to the store
    const result = await IAP.initConnection();
    console.log('IAP connection initialized:', result);

    // On iOS, we should flush any pending transactions
    if (Platform.OS === 'ios') {
      await IAP.flushFailedPurchasesCachedAsPendingAndroid?.();
    }

    isInitialized = true;
    return true;
  } catch (error) {
    console.error('IAPService: Failed to initialize:', error);
    return false;
  }
}

/**
 * End the IAP connection.
 * Call when app is closing (optional).
 */
export async function endIAPConnection(): Promise<void> {
  const IAP = getIAPModule();
  if (!IAP || !isInitialized) return;

  try {
    await IAP.endConnection();
    isInitialized = false;
  } catch (error) {
    console.error('IAPService: Failed to end connection:', error);
  }
}

/**
 * Get available subscription products from the App Store.
 */
export async function getProducts(): Promise<Product[]> {
  const IAP = getIAPModule();
  if (!IAP) return [];

  try {
    // Ensure connection is initialized
    if (!isInitialized) {
      await initializeIAP();
    }

    // Fetch subscription products
    const products = await IAP.getSubscriptions({
      skus: [PRODUCT_IDS.PRO_MONTHLY],
    });

    console.log('IAP products fetched:', products.length);

    return products.map((p) => {
      // Handle iOS vs Android subscription structure differences
      // iOS extends ProductCommon with price/currency/localizedPrice
      // Android has pricing in subscriptionOfferDetails
      const isIOS = 'price' in p;

      let price = '4.99';
      let localizedPrice = '$4.99';
      let currency = 'USD';

      if (isIOS) {
        // iOS subscription - has price fields directly
        const iosProduct = p as { price?: string; localizedPrice?: string; currency?: string };
        price = iosProduct.price || price;
        localizedPrice = iosProduct.localizedPrice || localizedPrice;
        currency = iosProduct.currency || currency;
      } else if ('subscriptionOfferDetails' in p) {
        // Android subscription - price in subscriptionOfferDetails
        const androidProduct = p as { subscriptionOfferDetails?: Array<{ pricingPhases?: { pricingPhaseList?: Array<{ formattedPrice?: string; priceCurrencyCode?: string }> } }> };
        const pricingPhase = androidProduct.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[0];
        if (pricingPhase) {
          localizedPrice = pricingPhase.formattedPrice || localizedPrice;
          currency = pricingPhase.priceCurrencyCode || currency;
        }
      }

      return {
        productId: p.productId,
        title: p.title || 'You. Pro',
        description: p.description || 'Monthly subscription',
        price,
        localizedPrice,
        currency,
      };
    });
  } catch (error) {
    console.error('IAPService: Failed to get products:', error);
    return [];
  }
}

/**
 * Purchase a subscription product.
 * Returns true if purchase was successful.
 */
export async function purchaseSubscription(productId: string): Promise<boolean> {
  const IAP = getIAPModule();
  if (!IAP) return false;

  try {
    // Ensure connection is initialized
    if (!isInitialized) {
      await initializeIAP();
    }

    // Request the purchase
    const purchase = await IAP.requestSubscription({
      sku: productId,
    });

    console.log('Purchase successful:', purchase);

    // Finish the transaction (important for iOS)
    if (purchase && 'transactionId' in purchase) {
      await IAP.finishTransaction({
        purchase: purchase as import('react-native-iap').Purchase,
        isConsumable: false,
      });
    }

    // Cache premium status locally
    await setPremiumStatus(true);

    return true;
  } catch (error: unknown) {
    // Check if user cancelled
    if (error && typeof error === 'object' && 'code' in error) {
      const errorWithCode = error as { code: string };
      if (errorWithCode.code === 'E_USER_CANCELLED') {
        console.log('User cancelled purchase');
        return false;
      }
    }

    console.error('IAPService: Purchase failed:', error);
    throw error;
  }
}

/**
 * Restore previous purchases.
 * Returns true if user has an active subscription.
 */
export async function restorePurchases(): Promise<boolean> {
  const IAP = getIAPModule();
  if (!IAP) return false;

  try {
    // Ensure connection is initialized
    if (!isInitialized) {
      await initializeIAP();
    }

    // Get available purchases (this restores on iOS)
    const purchases = await IAP.getAvailablePurchases();

    console.log('Restored purchases:', purchases.length);

    // Check if any purchase is for our product
    const hasProSubscription = purchases.some(
      (p) => p.productId === PRODUCT_IDS.PRO_MONTHLY
    );

    // Update local cache
    await setPremiumStatus(hasProSubscription);

    return hasProSubscription;
  } catch (error) {
    console.error('IAPService: Restore failed:', error);
    return false;
  }
}

/**
 * Check if user has active premium subscription.
 * First checks local cache, then verifies with store if needed.
 */
export async function checkPremiumStatus(): Promise<boolean> {
  // First check local cache for faster response
  const cachedStatus = await getCachedPremiumStatus();
  if (cachedStatus !== null) {
    return cachedStatus;
  }

  // If no cache, try to restore/check purchases
  const IAP = getIAPModule();
  if (!IAP) return false;

  try {
    if (!isInitialized) {
      await initializeIAP();
    }

    // Get current purchases to verify subscription status
    const purchases = await IAP.getAvailablePurchases();

    const hasProSubscription = purchases.some(
      (p) => p.productId === PRODUCT_IDS.PRO_MONTHLY
    );

    // Cache the result
    await setPremiumStatus(hasProSubscription);

    return hasProSubscription;
  } catch (error) {
    console.error('IAPService: Check status failed:', error);
    return false;
  }
}

/**
 * Get cached premium status (for fast, offline access).
 */
async function getCachedPremiumStatus(): Promise<boolean | null> {
  try {
    const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
    if (status === null) return null;
    return status === 'true';
  } catch {
    return null;
  }
}

/**
 * Set cached premium status.
 */
async function setPremiumStatus(isPremium: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(PREMIUM_STATUS_KEY, isPremium ? 'true' : 'false');
  } catch (error) {
    console.error('IAPService: Failed to cache status:', error);
  }
}

/**
 * Clear cached premium status (for testing/debugging).
 */
export async function clearPremiumCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([PREMIUM_STATUS_KEY, PREMIUM_EXPIRY_KEY]);
  } catch (error) {
    console.error('IAPService: Failed to clear cache:', error);
  }
}
