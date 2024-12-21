import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
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
        },
        name: 'ReportsOrder',
        path: '/reports/order',
        component: () => import('#/views/reports/order/index.vue'),
      },
    ],
  },
];

export default routes;
