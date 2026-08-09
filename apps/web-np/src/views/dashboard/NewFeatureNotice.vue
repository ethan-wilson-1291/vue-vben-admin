<script setup lang="ts">
import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { Alert } from 'ant-design-vue';

import { shopToggleNewFeatureNotice } from '#/api';
import { Bot } from '#/icons';
import { redirect } from '#/shared/utils';
import { useAiChatStore, useShopSettingStore } from '#/store';

defineOptions({
  name: 'NewFeatureNotice',
});

const shopSettingStore = useShopSettingStore();
const chatStore = useAiChatStore();

const closeNewFeatureNotice = () => {
  shopSettingStore.showNewFeatureNotice = false;
  shopToggleNewFeatureNotice({
    showNewFeatureNotice: false,
  });
};

const goToSettings = () => {
  redirect('settings.general');
};
</script>

<template>
  <Alert
    v-if="shopSettingStore.showNewFeatureNotice"
    :show-icon="true"
    type="info"
    closable
    @close="closeNewFeatureNotice"
  >
    <template #icon>
      <IconifyIcon icon="lucide:sparkles" />
    </template>
    <template #message>
      <span class="font-semibold">
        {{ $t('page.dashboard.newFeatureTitle') }}
      </span>
    </template>
    <template #description>
      <p class="mb-3">
        {{ $t('page.dashboard.newFeatureDescription') }}
      </p>

      <!-- AI Assistant Feature -->
      <div
        class="mb-3 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3"
      >
        <Bot class="mt-0.5 size-5 shrink-0 text-blue-500" />
        <div class="min-w-0">
          <p class="font-semibold">
            {{ $t('page.dashboard.newFeatureAiTitle') }}
          </p>
          <p class="text-sm">
            {{ $t('page.dashboard.newFeatureAiDescription') }}
          </p>
          <VbenButton size="sm" class="mt-2" @click="chatStore.openPanel()">
            {{ $t('page.dashboard.newFeatureAiOpenChat') }}
          </VbenButton>
        </div>
      </div>

      <!-- Multiple Languages Feature -->
      <div class="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
        <IconifyIcon
          icon="lucide:languages"
          class="mt-0.5 size-5 shrink-0 text-blue-500"
        />
        <div class="min-w-0">
          <p class="font-semibold">
            {{ $t('page.dashboard.newFeatureLanguageTitle') }}
          </p>
          <p
            class="text-sm"
            v-html="$t('page.dashboard.newFeatureLanguageDescription')"
          ></p>
          <VbenButton size="sm" class="mt-2" @click="goToSettings">
            {{ $t('page.dashboard.newFeatureLanguageSettings') }}
          </VbenButton>
        </div>
      </div>
    </template>
  </Alert>
</template>
