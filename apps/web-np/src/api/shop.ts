import { requestClient } from '#/api/request';

async function getHandlingFeesAndCOGS(params: any) {
  return requestClient
    .get('/api/shop/settings/cogs-handling-fees', { params })
    .then((res) => {
      return res;
    });
}

export { getHandlingFeesAndCOGS };
