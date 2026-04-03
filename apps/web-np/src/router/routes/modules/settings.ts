import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';
import { isShopifyEmbedded } from '#/shared/shopify-utils';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.settings-cogs.title'),
      icon: 'lsicon:goods-outline',
      order: 50,
    },
    name: 'settings.cogs-handling-fees',
    path: '/settings/cogs-and-handling',
    component: () => import('#/views/settings/cogs-handling-fees/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-transaction-fees.title'),
      icon: 'mdi:account-payment-outline',
      order: 60,
    },
    name: 'settings.transaction-fees',
    path: '/settings/transaction-fees',
    component: () => import('#/views/settings/transaction-fees/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-shipping-fees.title'),
      icon: 'carbon:car',
      order: 70,
    },
    name: 'settings.shipping-fees',
    path: '/settings/shipping-fees',
    component: () => import('#/views/settings/zone-shipping/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-custom-costs.title'),
      icon: 'ant-design:dollar-circle-twotone',
      order: 80,
    },
    name: 'settings.custom-costs',
    path: '/settings/custom-costs',
    component: () => import('#/views/settings/custom-costs/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-auto-mail.title'),
      order: 99,
      icon: 'ant-design:mail-twotone',
    },
    name: 'reports-email',
    path: '/reports/email',
    component: () => import('#/views/settings/auto-mail/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-general.title'),
      icon: 'codicon:settings',
      order: 100,
    },
    name: 'settings.general',
    path: '/settings/general',
    component: () => import('#/views/settings/general/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-pricing.title'),
      icon: 'ant-design:sketch-outlined',
      order: 110,
    },
    name: 'settings.pricing',
    path: '/settings/pricing',
    component: () => import('#/views/settings/pricing/index.vue'),
  },
  {
    meta: {
      title: $t('page.settings-fullscreen.title'),
      order: 100_000,
      icon: 'ant-design:fullscreen-outlined',
      hideInMenu: !isShopifyEmbedded(),
    },
    name: 'fullscreen',
    path: '/fullscreen',
    component: () => import('#/views/fullscreen.vue'),
  },
];

export default routes;
