// useMembership: Hook for accessing subscription/membership state
// Gracefully handles offline and error states

import { useState, useEffect, useCallback } from 'react';
import {
  getCustomerInfo,
  isPremium as checkIsPremium,
  restorePurchases,
  type CustomerInfo,
} from '@/lib/revenuecat';

type MembershipState = {
  isPremium: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  restore: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
};

const ENTITLEMENT_ID = 'premium';

/**
 * Hook for accessing membership/subscription state.
 *
 * Features:
 * - Loads customer info on mount
 * - Provides isPremium boolean for gating features
 * - Exposes restore() for restoring purchases
 * - Exposes refreshCustomerInfo() for manual refresh
 * - Fails gracefully offline (returns isPremium: false)
 */
export function useMembership(): MembershipState {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomerInfo = useCallback(async () => {
    try {
      const info = await getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('useMembership: Error loading customer info:', error);
      setCustomerInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomerInfo();
  }, [loadCustomerInfo]);

  const restore = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const info = await restorePurchases();
      setCustomerInfo(info);
      return info ? checkIsPremium(info, ENTITLEMENT_ID) : false;
    } catch (error) {
      console.error('useMembership: Error restoring purchases:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCustomerInfo = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await loadCustomerInfo();
  }, [loadCustomerInfo]);

  const isPremium = checkIsPremium(customerInfo, ENTITLEMENT_ID);

  return {
    isPremium,
    isLoading,
    customerInfo,
    restore,
    refreshCustomerInfo,
  };
}
