import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      ignoreAccess: true,
      title: 'External Authentication',
    },
    path: '/ext-auth',
    redirect: '/ext-auth/shopify',
    children: [
      {
        path: 'shopify',
        component: () =>
          import('#/views/_core/authentication/auth-shopify.vue'),
        meta: {
          ignoreAccess: true,
          title: 'Auth With Shopify',
        },
      },
      {
        path: 'token',
        component: () => import('#/views/_core/fallback/not-found.vue'),
        meta: {
          ignoreAccess: true,
          title: 'Auth With Token',
        },
      },
    ],
  },
];

export default routes;
