import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.reports-p-and-l.title'),
      order: 10,
      icon: 'clarity:analytics-outline-badged',
    },
    name: 'reports-p-and-l',
    path: '/reports/p-and-l-report',
    component: () => import('#/views/reports/p-and-l/index.vue'),
  },
  {
    meta: {
      title: $t('page.reports-order.title'),
      order: 20,
      icon: 'fluent-mdl2:reservation-orders',
    },
    name: 'reports-order',
    path: '/reports/order',
    component: () => import('#/views/reports/order/index.vue'),
  },
  {
    meta: {
      title: $t('page.reports-product.title'),
      order: 30,
      icon: 'lsicon:goods-outline',
    },
    name: 'ProductAnalytics',
    path: '/reports/product-analytics',
    component: () => import('#/views/reports/product/index.vue'),
  },
  {
    meta: {
      title: $t('page.reports-customer.title'),
      order: 40,
      icon: 'carbon:customer',
    },
    name: 'reports-customer-analytics',
    path: '/reports/customer-analytics',
    component: () => import('#/views/reports/customer-ltv/index.vue'),
  },
];

export default routes;
