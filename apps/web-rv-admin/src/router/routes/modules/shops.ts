import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-shopify',
      order: -1,
      title: 'Shops',
    },
    name: 'shops',
    path: '/shops',
    component: () => import('#/views/shops/index.vue'),
  },
  {
    meta: {
      icon: 'ic:baseline-edit',
      order: 1,
      title: 'Shop Theme Editor',
      hideInMenu: true,
    },
    name: 'shops-theme',
    path: '/shops/:id/theme/:themeId',
    component: () => import('#/views/shop-theme/index.vue'),
  },
];

export default routes;
