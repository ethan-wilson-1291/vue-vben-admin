import { requestClient } from '#/api/request';

export async function updateGeneralSettings(data: any) {
  return requestClient.put('/api/shop/settings/general', data);
}

export async function updateTransactionFees(data: any) {
  return requestClient.put('/api/shop/settings/transaction-fees', {
    transactionFees: data,
  });
}

export async function updateRegion(data: any) {
  return requestClient.post('/api/region', data);
}

export async function removeRegion(uuid: any) {
  return requestClient.delete(`/api/region/${uuid}`);
}
