import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { $t } from '@vben/locales';

import { format } from 'currency-formatter';

import { getAdInsights } from '#/api';
import { formatReportDate } from '#/shared/utils';

const state = reactive({
  footerData: <any>null,
});

export const gridOptions: VxeTableGridOptions = {
  showFooter: true,
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 3 }],
  footerMethod: () => {
    if (!state.footerData) {
      return [];
    }

    return [state.footerData];
  },
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'accountType',
      title: $t('page.ad-cost-insights.table.adChannel'),
      footerClassName: 'font-semibold',
      slots: { default: 'accountType' },
      width: 100,
      fixed: 'left',
    },
    {
      field: 'date',
      title: $t('page.ad-cost-insights.table.date'),
      footerClassName: 'font-semibold',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      width: 110,
      fixed: 'left',
    },
    {
      field: 'adName',
      title: $t('page.ad-cost-insights.table.adName'),
      footerClassName: 'font-semibold',
      minWidth: 110,
      align: 'left',
    },
    {
      field: 'adGroupName',
      title: $t('page.ad-cost-insights.table.adGroup'),
      footerClassName: 'font-semibold',
      minWidth: 110,
      align: 'left',
    },
    {
      field: 'adCampaignName',
      title: $t('page.ad-cost-insights.table.adCampaign'),
      footerClassName: 'font-semibold',
      minWidth: 110,
      align: 'left',
    },
    {
      field: 'adAccountName',
      title: $t('page.ad-cost-insights.table.adAccount'),
      footerClassName: 'font-semibold',
      minWidth: 110,
      align: 'left',
    },
    {
      field: 'impressions',
      title: $t('page.ad-cost-insights.table.impressions'),
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'reach',
      title: $t('page.ad-cost-insights.table.reach'),
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'clicks',
      title: $t('page.ad-cost-insights.table.clicks'),
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'ctr',
      title: $t('page.ad-cost-insights.table.ctr'),
      footerClassName: 'font-semibold',
      cellRender: { name: 'CellPercentage' },
      minWidth: 120,
    },
    {
      field: 'spendUSD',
      title: $t('page.ad-cost-insights.table.spendUsd'),
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
    {
      field: 'cpcUSD',
      title: $t('page.ad-cost-insights.table.cpcUsd'),
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
    {
      field: 'cppUSD',
      title: $t('page.ad-cost-insights.table.cppUsd'),
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
    custom: true,
  },
  height: 'auto',
  rowConfig: {
    height: 58,
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAdInsights({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }).then((res) => {
          res.items.forEach((item: any) => {
            item.ctr = format(item.ctr, { precision: 2 });
          });

          if (res.summary) {
            state.footerData = res.summary;

            // Reset some fields
            state.footerData.accountType = $t(
              'page.ad-cost-insights.table.totalItems',
              {
                count: res.total,
              },
            );
            state.footerData.date = null;
            state.footerData.ctr = format(state.footerData.ctr, {
              precision: 2,
            });
          } else {
            state.footerData = null;
          }

          return res;
        });
      },
    },
  },
};
