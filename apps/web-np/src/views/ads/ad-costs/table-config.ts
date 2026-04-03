import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

import { getAdList } from '#/api';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'accountType',
      title: $t('page.ad-cost-rules.table.adChannel'),
      slots: { default: 'accountType' },
      width: 100,
    },
    {
      field: 'id',
      title: $t('page.ad-cost-rules.table.attachToCosts'),
      slots: { default: 'addToCosts' },
      width: 150,
    },
    {
      field: 'adName',
      title: $t('page.ad-cost-rules.table.adName'),
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adGroupName',
      title: $t('page.ad-cost-rules.table.groupName'),
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adCampaignName',
      title: $t('page.ad-cost-rules.table.campaignName'),
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adAccountName',
      title: $t('page.ad-cost-rules.table.accountName'),
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'createdAt',
      title: $t('page.ad-cost-rules.table.syncedAt'),
      align: 'center',
      minWidth: 150,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '',
      minWidth: 110,
      align: 'left',
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  height: 'auto',
  rowConfig: {
    height: 58,
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAdList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }).then((res) => {
          return res;
        });
      },
    },
  },
};
