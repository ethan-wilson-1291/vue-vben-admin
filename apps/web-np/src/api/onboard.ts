import { requestClient } from '#/api/request';

async function onboardFinished(data: any) {
  return requestClient.post('/api/shop/onboard/finish', data);
}

export { onboardFinished };
