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
