import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'codicon:settings',
      keepAlive: true,
      order: 90_000,
      title: 'Settings',
    },
    name: 'settings',
    path: '/setttings',
    children: [
      {
        meta: {
          title: 'COGS & Handling',
          icon: 'lsicon:goods-outline',
        },
        name: 'COGSAndHandling',
        path: '/setttings/cogs-and-handling',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Shipping Fees',
          icon: 'carbon:car',
        },
        name: 'ShippingFees',
        path: '/setttings/shipping-fees',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Transaction Fees',
          icon: 'mdi:account-payment-outline',
        },
        name: 'Transaction Fees',
        path: '/setttings/transcation-fees',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Zones',
          icon: 'file-icons:moment-timezone',
        },
        name: 'Zones',
        path: '/setttings/zones',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Currency',
          icon: 'fluent-mdl2:all-currency',
        },
        name: 'Currency',
        path: '/setttings/currency',
        component: () => import('#/views/reports/order/index.vue'),
      },
    ],
  },
];

export default routes;
