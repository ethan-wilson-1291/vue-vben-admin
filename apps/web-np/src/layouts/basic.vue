<script lang="ts" setup>
import { computed, watch } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { isShopifyEmbedded, redirectToExternal } from '#/shared/utils';
import { useAuthStore, useShopStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

import Chat from './chat.vue';
import Notification from './notification.vue';
import ShopStatistic from './shop-statistic.vue';

const shopStore = useShopStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();

const menus = computed(() => {
  const profileMenus = [
    {
      handler: () => {
        const url = `https://${shopStore.shop.myshopifyDomain}`;
        redirectToExternal(url);
      },
      icon: 'ic:baseline-shopify',
      text: 'Shopify store',
      order: 20,
    },
    {
      handler: () => {
        const url = `https://apps.shopify.com/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}`;
        redirectToExternal(url);
      },
      icon: 'ant-design:global-outlined',
      text: 'Finily app page',
      order: 30,
    },
    {
      handler: shopStore.redirectToPricing,
      icon: 'ant-design:rocket-twotone',
      text: 'Pricing plans',
      order: 50,
    },
  ];

  if (!isShopifyEmbedded()) {
    profileMenus.push({
      handler: () => {
        shopStore.redirectToAdmin();
      },
      icon: 'ic:baseline-shopify',
      text: 'Shopify admin page',
      order: 10,
    });
  }

  // Sort the menus by order
  profileMenus.sort((a, b) => a.order - b.order);

  return profileMenus;
});

const avatar = computed(() => {
  return '/static/images/shopify-header-logo.png';
});

async function handleLogout() {
  await authStore.logout(false);
}

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus="menus as any"
        :text="userStore.userInfo?.username"
        :description="shopStore.shop.domain ?? shopStore.shop.myshopifyDomain"
        :tag-text="shopStore.shop.subscriptionName"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <ShopStatistic />
      <Notification />
      <Chat />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
