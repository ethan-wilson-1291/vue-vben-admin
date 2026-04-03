<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { VbenLoading } from '@vben/common-ui';

import { useShopStore } from '#/store';

onBeforeMount(() => {
  const shopStore = useShopStore();
  shopStore.redirectToPricing();
});
</script>

<template>
  <VbenLoading spinning text="Shopify verifying..." />
</template>
