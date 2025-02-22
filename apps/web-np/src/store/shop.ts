import { defineStore } from 'pinia';

import { updateGeneralSettings } from '#/api';

import { useCurrencyStore } from './currency';

enum ShopState {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PROCESSING = 'processing',
}

interface IShop {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  currencyFromApp: string;
  currencyRate: number;
  domain: string;
  myshopifyDomain: string;
  plan: string;
}

interface IShopState {
  product_sync: ShopState;
  order_sync: ShopState;
  customer_sync: ShopState;
  onboard: ShopState;
  cogs_config: ShopState;
  handling_fees_config: ShopState;
  shipping_fee_config: ShopState;
  transaction_fee_config: ShopState;
}

export const useShopStore = defineStore('np-shop', {
  actions: {
    setStates(shop: any, state: any) {
      this.shop = shop;
      this.state = state;
    },
    updateAppCurrency(appCurrency: string) {
      const currencyStore = useCurrencyStore();

      return updateGeneralSettings({ appCurrency }).finally(() => {
        // Update the currency and rate in the shop store
        this.shop.currencyFromApp = appCurrency;
        this.shop.currencyRate = currencyStore.getRate(
          this.shop.currency,
          appCurrency,
        );
      });
    },
  },

  getters: {
    isOnboarding(): boolean {
      return this.state.onboard === ShopState.PROCESSING;
    },
  },

  state: (): { shop: IShop; state: IShopState } => ({
    shop: {
      countryCode: '',
      countryName: '',
      currency: '',
      currencySymbol: '',
      currencyFromApp: '',
      currencyRate: 1,
      domain: '',
      myshopifyDomain: '',
      plan: '',
    },
    state: {
      product_sync: ShopState.PROCESSED,
      order_sync: ShopState.PROCESSED,
      customer_sync: ShopState.PROCESSED,
      onboard: ShopState.PROCESSED,
      cogs_config: ShopState.PROCESSED,
      handling_fees_config: ShopState.PROCESSED,
      shipping_fee_config: ShopState.PROCESSED,
      transaction_fee_config: ShopState.PROCESSED,
    },
  }),
});
