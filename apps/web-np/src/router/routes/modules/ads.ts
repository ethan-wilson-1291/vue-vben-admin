import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:ads',
      title: $t('page.ad-management.title'),
      order: 90,
    },
    name: 'ads',
    path: '/ads',
    children: [
      {
        meta: {
          title: $t('page.ad-connections.title'),
          icon: 'ant-design:link-outlined',
        },
        name: 'ads.accounts',
        path: '/ads/accounts',
        component: () => import('#/views/ads/account/index.vue'),
      },
      {
        meta: {
          title: $t('page.ad-cost-rules.title'),
          icon: 'ant-design:tags-twotone',
        },
        name: 'ads.costs',
        path: '/ads/ad-costs',
        component: () => import('#/views/ads/ad-costs/index.vue'),
      },
      {
        meta: {
          title: $t('page.ad-cost-insights.title'),
          order: 20,
          icon: 'clarity:analytics-outline-badged',
        },
        name: 'ads.insights',
        path: '/ads/ad-insights',
        component: () => import('#/views/ads/ad-insights/index.vue'),
      },
    ],
  },
];

export default routes;
