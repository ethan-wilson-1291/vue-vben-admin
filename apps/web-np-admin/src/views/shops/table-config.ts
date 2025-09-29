import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { shopGetList } from '#/api';

export const orderTableOptions: VxeTableGridOptions = {
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  rowConfig: {
    height: 48,
    isHover: true,
  },
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  showFooter: true,
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 2 }],
  proxyConfig: {
    sort: true,
    ajax: {
      query: async ({ page, sort }, formValues) => {
        const res = await shopGetList({
          page: page.currentPage,
          pageSize: page.pageSize,
          sortBy: sort.field,
          sortOrder: sort.order,
          ...formValues,
        });

        return res;
      },
    },
  },
  sortConfig: {
    multiple: false,
    remote: true,
    defaultSort: {
      field: 'lastLoginAt',
      order: 'desc',
    },
  },
  columns: [
    {
      field: 'id',
      title: 'Shop',
      slots: { default: 'id' },
      width: 150,
      align: 'left',
    },
    {
      field: 'name',
      title: 'Owner',
      slots: { default: 'name' },
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'domain',
      title: 'Domain',
      slots: { default: 'domain' },
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'country',
      title: 'Country',
      slots: { default: 'country' },
      width: 150,
      align: 'left',
    },
    {
      field: 'plan',
      title: 'Plan/Charge',
      slots: { default: 'plan' },
      width: 150,
      align: 'left',
    },
    {
      field: 'status',
      title: 'Status',
      slots: { default: 'status' },
      width: 150,
    },
    {
      field: 'createdAt',
      title: 'Created',
      sortable: true,
      width: 110,
    },
    {
      field: 'lastLoginAt',
      title: 'Last Login',
      sortable: true,
      width: 110,
    },
    {
      field: 'action',
      title: 'Action',
      slots: { default: 'action' },
      width: 110,
      align: 'left',
    },
  ],
};
