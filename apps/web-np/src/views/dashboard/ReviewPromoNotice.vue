<script setup lang="ts">
import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { Alert } from 'ant-design-vue';

import { redirectToExternal } from '#/shared/utils';
import { useShopStore } from '#/store';

import UpgradeBtn from '../shared-components/upgrade-btn.vue';

defineOptions({
  name: 'ReviewPromoNotice',
});

const shopStore = useShopStore();

const handleWriteReview = () => {
  const url = `https://apps.shopify.com/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}#modal-show=WriteReviewModal`;
  redirectToExternal(url);
};
</script>

<template>
  <Alert
    v-if="shopStore.isFreeSubscription"
    :show-icon="true"
    type="warning"
    closable
  >
    <template #icon>
      <IconifyIcon icon="emojione-v1:ringing-bell" />
    </template>
    <template #message>
      <span class="font-semibold">
        {{ $t('page.dashboard.reviewPromoTitle') }}
      </span>
    </template>
    <template #description>
      {{ $t('page.dashboard.reviewPromoLine1') }}
      <div>
        {{ $t('page.dashboard.reviewPromoLine2') }}
        <strong>{{ $t('page.dashboard.reviewPromoBonus') }}</strong>
        !
      </div>

      <div class="flex items-center space-x-2">
        <UpgradeBtn class="mt-2" size="sm" variant="secondary" />

        <VbenButton
          class="mt-2"
          size="sm"
          variant="secondary"
          @click="handleWriteReview"
        >
          <IconifyIcon class="mr-2" icon="ant-design:export-outlined" />
          {{ $t('page.dashboard.writeReview') }}
        </VbenButton>
      </div>
    </template>
    <template #action> </template>
  </Alert>
</template>
