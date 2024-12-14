<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { Fallback } from '@vben/common-ui';
import { resetAllStores } from '@vben/stores';
import { isShopifyEmbedded } from '@vben/utils';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Fallback404Demo' });

const authStore = useAuthStore();
const route = useRoute();

onBeforeMount(() => {
  const queryParams = route.query;

  resetAllStores();

  isShopifyEmbedded()
    ? authStore.authLoginViaShopifySession(queryParams)
    : authStore.authLogin({ myshopifyDomain: queryParams.shop as string });
});
</script>

<template>
  <Fallback status="404" />
</template>
