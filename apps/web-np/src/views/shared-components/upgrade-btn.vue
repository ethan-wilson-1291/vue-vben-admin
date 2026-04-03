<script lang="ts" setup>
import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useShopStore } from '#/store';

const shopStore = useShopStore();
</script>

<template>
  <VbenButton
    v-if="shopStore.isFreeSubscription"
    @click="shopStore.redirectToPricing"
    size="sm"
    type="primary"
    v-tippy="{
      content: $t('page.dashboard.upgradeTooltip'),
    }"
  >
    <IconifyIcon class="mr-2 size-4" icon="ant-design:crown-twotone" />
    {{ $t('page.dashboard.purchasePro') }}
  </VbenButton>
</template>
