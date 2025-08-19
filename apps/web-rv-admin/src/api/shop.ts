import { requestClient } from '#/api/request';

export async function shopGetList(params: any) {
  return requestClient.get('/admin/shop/list', { params });
}

export async function shopGenerateToken(shopId: any) {
  return requestClient.get(`/admin/shop/${shopId}/token`);
}

export async function shopResetOnboarding(shopId: any) {
  return requestClient.post(`/admin/shop/${shopId}/reset-onboarding`);
}

export async function shopUpgradePlan(shopId: any, checked: boolean) {
  return requestClient.put(`/admin/shop/${shopId}/change-plan`, {
    isPro: checked,
  });
}

export async function shopGetThemeList(shopId: any) {
  return requestClient.get(`/admin/shop/${shopId}/theme/list`);
}

export async function shopGetThemeAssets(shopId: any, themeId: any) {
  return requestClient.get(`/admin/shop/${shopId}/theme/${themeId}/asset`);
}

export async function shopGetThemeAssetContent(
  shopId: any,
  themeId: any,
  assetKey: any,
) {
  return requestClient.get(
    `/admin/shop/${shopId}/theme/${themeId}/asset/content`,
    {
      params: { assetKey },
    },
  );
}

export async function shopUpdateThemeAssetContent(
  shopId: any,
  themeId: any,
  assetKey: any,
  assetValue: any,
) {
  return requestClient.put(
    `/admin/shop/${shopId}/theme/${themeId}/asset/content`,
    {
      assetKey,
      assetValue,
    },
  );
}
