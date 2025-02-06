import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {
  generateAuthUrl,
  getAccessCodesApi,
  getUserInfoApi,
  loginApiViaShopifySession,
  logoutApi,
} from '#/api';
import { $t } from '#/locales';

import { useShopStore } from './shop';
import { useShopSettingStore } from './shop-settings';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const shopStore = useShopStore();
  const shopSettingStore = useShopSettingStore();

  const router = useRouter();

  const loginLoading = ref(false);

  async function authLogin(params: Recordable<any>) {
    loginLoading.value = true;
    window.location.href = generateAuthUrl(params);
  }

  async function authLoginViaShopifySession(params: Recordable<any>) {
    loginLoading.value = true;
    const { accessToken } = await loginApiViaShopifySession(params);

    return await authLoginViaToken(accessToken);
  }

  async function authLoginViaToken(accessToken: string) {
    loginLoading.value = true;
    accessStore.setAccessToken(accessToken);

    const [fetchUserInfoResult, accessCodes] = await Promise.all([
      fetchUserInfo(),
      getAccessCodesApi(),
    ]);

    const userInfo: any = fetchUserInfoResult;

    accessStore.setAccessCodes(accessCodes);

    if (accessStore.loginExpired) {
      accessStore.setLoginExpired(false);
    } else {
      const url = userInfo.homePath || DEFAULT_HOME_PATH;
      await router.push(url);
    }

    if (userInfo?.realName && !shopStore.isOnboarding) {
      notification.success({
        description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
        duration: 3,
        message: $t('authentication.loginSuccess'),
      });
    }
  }

  async function logout(redirect: boolean = true) {
    await logoutApi();

    resetAllStores();
    accessStore.setLoginExpired(false);

    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    const res = await getUserInfoApi();

    // Update stores
    userStore.setUserInfo(res as any);
    shopStore.setStates(res.shop, res.state);
    shopSettingStore.setStates(res.settings);

    return res;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    authLoginViaShopifySession,
    authLoginViaToken,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
