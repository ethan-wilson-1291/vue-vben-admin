import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lsicon:column-line-outline',
      keepAlive: true,
      order: 1000,
      title: $t('reports.title'),
    },
    name: 'reports',
    path: '/reports',
    children: [
      {
        meta: {
          title: $t('reports.order.title'),
          icon: 'fluent-mdl2:reservation-orders',
        },
        name: 'ReportsOrder',
        path: '/reports/order',
        component: () => import('#/views/reports/order/index.vue'),
      },
    ],
  },
];

export default routes;
