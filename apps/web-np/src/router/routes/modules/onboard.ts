import type { RouteRecordRaw } from 'vue-router';

import { ONBOARD_PATH } from '@vben/constants';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -100,
      title: 'Onboard',
      hideInMenu: true,
      noBasicLayout: true,
    },
    name: 'Onboard',
    path: ONBOARD_PATH,
    component: () => import('#/views/onboard/index.vue'),
  },
];

export default routes;
