// useMembership: Hook for accessing subscription/membership state
// Uses direct StoreKit 2 integration via react-native-iap

import { useState, useEffect, useCallback } from 'react';
import {
  checkPremiumStatus,
  restorePurchases as iapRestorePurchases,
  getProducts,
  purchaseSubscription,
  type Product,
} from '@/lib/iap';

type MembershipState = {
  isPremium: boolean;
  isLoading: boolean;
  products: Product[];
  restore: () => Promise<boolean>;
  purchase: (productId: string) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
};

/**
 * Hook for accessing membership/subscription state.
 *
 * Features:
 * - Checks premium status on mount
 * - Provides isPremium boolean for gating features
 * - Exposes restore() for restoring purchases
 * - Exposes purchase() for buying subscriptions
 * - Exposes refreshStatus() for manual refresh
 * - Fails gracefully offline (returns cached status)
 */
export function useMembership(): MembershipState {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Load premium status and products on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Check premium status (uses cache first, then verifies with store)
        const status = await checkPremiumStatus();
        if (mounted) setIsPremium(status);

        // Load available products for purchase UI
        const availableProducts = await getProducts();
        if (mounted) setProducts(availableProducts);
      } catch (error) {
        console.error('useMembership: Error loading status:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const restored = await iapRestorePurchases();
      setIsPremium(restored);
      return restored;
    } catch (error) {
      console.error('useMembership: Error restoring purchases:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Purchase subscription
  const purchase = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const success = await purchaseSubscription(productId);
      if (success) {
        setIsPremium(true);
      }
      return success;
    } catch (error) {
      console.error('useMembership: Error purchasing:', error);
      throw error; // Re-throw so UI can show error
    }
  }, []);

  // Manual refresh
  const refreshStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const status = await checkPremiumStatus();
      setIsPremium(status);
    } catch (error) {
      console.error('useMembership: Error refreshing status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isPremium,
    isLoading,
    products,
    restore,
    purchase,
    refreshStatus,
  };
}
