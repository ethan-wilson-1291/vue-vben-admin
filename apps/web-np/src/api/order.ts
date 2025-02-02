import { requestClient } from '#/api/request';

import { calcGrossProfitMargin } from './helpers';

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

/**
 * 获取示例表格数据
 */
async function getReportOrderApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/api/order', { params }).then((res) => {
    res.items = res.items.map((item: any) => {
      item.grossProfitMargin = calcGrossProfitMargin(item);
      return item;
    });

    return res;
  });
}

export { getReportOrderApi };
