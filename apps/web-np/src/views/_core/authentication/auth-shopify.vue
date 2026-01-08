<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import { VbenLoading } from '@vben/common-ui';

import { isShopifyEmbedded } from '#/shared/shopify-utils';
import { useAuthStore } from '#/store';

const authStore = useAuthStore();
const router = useRouter();

onBeforeMount(() => {
  if (isShopifyEmbedded()) {
    authStore.authLoginViaShopifySession();
  } else {
    router.replace({ name: 'Login' });
  }
});
</script>

<template>
  <VbenLoading spinning text="Shopify verifying..." />
</template>
