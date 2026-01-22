// IAP module exports - Direct StoreKit 2 integration

export {
  PRODUCT_IDS,
  initializeIAP,
  endIAPConnection,
  getProducts,
  purchaseSubscription,
  restorePurchases,
  checkPremiumStatus,
  clearPremiumCache,
} from './IAPService';

export type { Product, Purchase } from './IAPService';
