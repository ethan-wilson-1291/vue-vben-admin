import { useAppConfig } from '@vben/hooks';

import { baseRequestClient, requestClient } from '#/api/request';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    myshopifyDomain?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export function loginApi(data: AuthApi.LoginParams) {
  const shopifyDomain: string =
    data.myshopifyDomain
      ?.replaceAll(/\s/g, '')
      .replace('https://', '')
      .replace('http://', '')
      .replace('.myshopify.com', '') ?? '';

  const url: string = `${apiURL}/auth/generate?subdomain=${shopifyDomain}`;

  window.location.href = url;
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
