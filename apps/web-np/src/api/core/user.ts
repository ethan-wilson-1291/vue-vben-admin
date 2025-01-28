import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/auth/me');
}
