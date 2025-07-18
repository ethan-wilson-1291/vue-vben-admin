import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { markRaw } from 'vue';

import { $t } from '@vben/locales';

import { getProductSalesReport } from '#/api';
import dayjs from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import Products from '#/views/settings/cogs-handling-fees/modules/products.vue';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

export const gridOptions: VxeTableGridOptions = {
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    height: 48,
    isHover: true,
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        const res = await getProductSalesReport({
          ...formValues,
        });

        return res;
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  columns: [
    {
      field: 'productName',
      title: 'Name',
      slots: { default: 'productName' },
      minWidth: 300,
      align: 'left',
    },
    {
      field: 'quantityCurrent',
      className: 'font-semibold',
      title: 'Units Sold',
      minWidth: 130,
    },
    {
      field: 'quantityRefund',
      title: 'Refund',
      minWidth: 130,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      field: 'netPayment',
      title: $t('field-name.netPayment'),
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      field: 'cogs',
      title: $t('field-name.cogs'),
      titlePrefix: {
        content: $t('field-name.cogsExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      field: 'handlingFees',
      title: $t('field-name.handlingFees'),
      titlePrefix: {
        content: $t('field-name.handlingFeesExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      field: 'grossProfit',
      title: $t('field-name.grossProfit'),
      titlePrefix: {
        content: 'Gross profit = Revenue - COGS - Handling',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellPercentage' },
      className: 'font-semibold',
      field: 'grossProfitMargin',
      title: $t('field-name.grossProfitMargin'),
      titlePrefix: {
        content: $t('field-name.grossProfitMarginExplain'),
      },
      align: 'right',
      minWidth: 170,
    },
  ],
};

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['fromDate', 'toDate']]],
  schema: [
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'day',
        pickerLimitName: '6 months',
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'last2Months',
            'last3Months',
            'previousMonth',
            'thisMonth',
          ],
          true,
        ),
      },
      defaultValue: [dayjs().add(-1, 'month').add(1, 'day'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: markRaw(Products),
      defaultValue: [],
      fieldName: 'productIds',
      label: 'Products',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};
