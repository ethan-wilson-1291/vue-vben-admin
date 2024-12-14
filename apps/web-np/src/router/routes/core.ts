import type { RouteRecordRaw } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';

import { AuthPageLayout } from '#/layouts';
import { $t } from '#/locales';
import Login from '#/views/_core/authentication/login.vue';

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('#/views/_core/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
};

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: DEFAULT_HOME_PATH,
  },
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
        meta: {
          title: $t('page.auth.login'),
        },
      },
    ],
    props: {
      toolbar: true,
      toolbarList: ['color', 'language', 'theme'],
    },
  },
  {
    name: 'Auth With Shopify',
    path: '/auth/shopify',
    component: () => import('#/views/_core/authentication/auth-shopify.vue'),
    meta: {
      ignoreAccess: true,
      title: 'Auth With Shopify',
    },
  },
  // This route should not be added to loginPaths, because it is not a login route for normal shop.
  // This route will be used by Admin Staff to login to the shop.
  // This route will remove all pinia stores and then login to the shop.
  {
    name: 'Auth With Token',
    path: '/auth/token',
    component: () => import('#/views/_core/authentication/auth-token.vue'),
    meta: {
      ignoreAccess: true,
      title: 'Auth With Token',
    },
  },
];

const loginPaths = [LOGIN_PATH, '/auth/shopify'];

export { coreRoutes, fallbackNotFoundRoute, loginPaths };
