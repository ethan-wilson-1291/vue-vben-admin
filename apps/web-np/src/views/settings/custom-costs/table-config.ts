import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

import { getCustomCostList } from '#/api';
import { formatReportDate } from '#/shared/utils';

import { customCostTypes } from './service';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-semibold',
      title: $t('page.settings-custom-costs.table.name'),
      minWidth: 200,
    },
    {
      field: 'startDate',
      title: $t('page.settings-custom-costs.table.startDate'),
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'endDate',
      title: $t('page.settings-custom-costs.table.endDate'),
      formatter: (time: any) => {
        if (!time.cellValue) {
          return $t('page.settings-custom-costs.table.onGoing');
        }

        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'type',
      title: $t('page.settings-custom-costs.table.type'),
      formatter: (val: any): any => {
        const type = customCostTypes.find(
          (item) => item.value === val.cellValue,
        );

        return type ? $t(type.labelKey) : '';
      },
      width: 200,
    },
    {
      field: 'dailyCost',
      title: $t('page.settings-custom-costs.table.dailyCost'),
      slots: { default: 'dailyCost' },
      align: 'left',
      width: 200,
    },
    {
      field: 'note',
      title: $t('page.settings-custom-costs.table.note'),
      align: 'left',
      width: 200,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: $t('page.settings-custom-costs.table.action'),
      fixed: 'right',
      align: 'right',
      width: 100,
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getCustomCostList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return res;
      },
    },
  },
};
