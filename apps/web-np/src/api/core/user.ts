import { requestClient } from '#/api/request';
import { getCurrencySymbol } from '#/utils';

interface IAuth {
  [key: string]: any;
  shop: any;
  settings: any;
  state: any;
}

export async function getUserInfoApi(): Promise<IAuth> {
  return requestClient.get<IAuth>('/auth/me').then((res: any) => {
    res.shop.currencySymbol = getCurrencySymbol(res.shop.currency);

    return res;
  });
}
