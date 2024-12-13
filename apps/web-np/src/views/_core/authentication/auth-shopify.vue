<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { Fallback } from '@vben/common-ui';
import { isShopifyEmbedded } from '@vben/utils';

defineOptions({ name: 'Fallback404Demo' });

onBeforeMount(() => {
  const a = isShopifyEmbedded();
  console.log(a);
});
</script>

<template>
  <Fallback status="404" />
</template>
