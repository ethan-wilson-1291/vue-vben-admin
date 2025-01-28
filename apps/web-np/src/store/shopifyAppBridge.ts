import { ref } from 'vue';

import { isShopifyEmbedded } from '@vben/utils';

import { defineStore } from 'pinia';

export const useShopifyAppBridgeStore = defineStore(
  'shopify-app-bridge',
  () => {
    const isShopifyAdminEmbedded = ref<boolean>(isShopifyEmbedded());
    return {
      isShopifyAdminEmbedded,
    };
  },
);
