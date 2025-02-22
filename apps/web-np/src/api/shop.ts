import { requestClient } from '#/api/request';

export async function updateGeneralSettings(data: any) {
  return requestClient.put('/api/shop/settings/general', data);
}

export async function getHandlingFeesAndCOGS(params: any) {
  return requestClient.get('/api/shop/settings/cogs-handling-fees', { params });
}

export async function updateCalcCOGSBy(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/calc-by',
    data,
  );
}

export async function updateCogsByDate(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/cogs/by-date',
    data,
  );
}

export async function updateHandlingFees(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/handling-fees',
    data,
  );
}
