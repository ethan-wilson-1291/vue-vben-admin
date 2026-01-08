import { baseRequestClient, requestClient } from '#/api/request';

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

export function generateAuthUrl(data: AuthApi.LoginParams) {
  const shopifyDomain: string =
    data.myshopifyDomain
      ?.replaceAll(/\s/g, '')
      .replace('https://', '')
      .replace('http://', '')
      .replace('.myshopify.com', '') ?? '';

  return `https://admin.shopify.com/store/${shopifyDomain}/apps/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}`;
}

export async function loginApiViaShopifySessionId(
  myshopifyDomain: any,
  sessionID: string,
) {
  return requestClient.post<AuthApi.LoginResult>(
    '/auth/verify-shopify-session-id',
    {
      shop: myshopifyDomain,
      sessionId: sessionID,
    },
  );
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function logoutApi() {}

export async function getAccessCodesApi() {
  return [];
}
