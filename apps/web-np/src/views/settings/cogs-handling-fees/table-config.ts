import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getHandlingFeesAndCOGS } from '#/api/shop';

export const orderTableOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'regionFees.type',
      title: 'Calc By Level',
    },
    {
      field: 'name',
      title: 'Name',
      align: 'left',
    },
    {
      field: 'status',
      title: 'Status',
    },
    {
      field: 'price',
      title: 'Selling Price',
      align: 'right',
    },
    {
      field: 'latestCogs',
      title: 'Cost of Goods Sold',
      align: 'right',
    },
    {
      field: 'regionFees.handlingFees',
      title: 'Handling Fees',
      align: 'right',
    },
    {
      field: 'margin',
      title: 'Margin',
      align: 'right',
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getHandlingFeesAndCOGS({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }).then((res) => {
          res.items = res.items.map((item: any) => {
            item.regionFees = item.fees[formValues.zoneUUID];

            // item.regionFees.cogs is object with below
            // { 1: "234", 2: "345", 3: "456"}

            const maxKey = Math.max(
              ...Object.keys(item.regionFees.cogs).map(Number),
            );
            item.latestCogs = item.regionFees.cogs[maxKey];

            // Get latest cogs by key , it should return 456

            return item;
          });

          return res;
        });
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 2 }],
};
