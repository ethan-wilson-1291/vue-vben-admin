import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -100,
      title: 'Onboard',
      hideInMenu: true,
    },
    name: 'Onboard',
    path: '/onboard',
    component: () => import('#/views/onboard.vue'),
  },
];

export default routes;
