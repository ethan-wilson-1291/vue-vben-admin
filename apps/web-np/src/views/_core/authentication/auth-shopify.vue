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

onBeforeMount(async () => {
  const queryParams = route.query;

  resetAllStores();

  await (isShopifyEmbedded()
    ? authStore.authLoginViaShopifySession(queryParams)
    : authStore.authLogin(queryParams));
});
</script>

<template>
  <Fallback status="404" />
</template>
