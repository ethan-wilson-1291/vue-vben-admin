import { requestClient } from '#/api/request';

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
  return requestClient.get('/api/order', { params });
}

export { getReportOrderApi };
