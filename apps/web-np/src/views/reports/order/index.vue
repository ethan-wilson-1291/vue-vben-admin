<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { calcGrossProfitMargin, getReportOrderApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'RangePicker',
      componentProps: {
        // Show last week button
        presets: [
          { label: 'Today', value: [dayjs().add(-1, 'd'), dayjs()] },
          { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
          { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
          { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
          { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
          { label: 'Last year', value: [dayjs().add(-365, 'd'), dayjs()] },
          { label: 'Last 2 year', value: [dayjs().add(-730, 'd'), dayjs()] },
        ],
      },
      defaultValue: [dayjs().subtract(30, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: [
          {
            value: 'AUTHORIZED',
            label: 'Authorized',
          },
          {
            value: 'PAID',
            label: 'Paid',
          },
          {
            value: 'PARTIALLY_PAID',
            label: 'Partially Paid',
          },
          {
            value: 'PARTIALLY_REFUNDED',
            label: 'Partially Refunded',
          },
          {
            value: 'PENDING',
            label: 'Pending',
          },
          {
            value: 'VOIDED',
            label: 'Voided',
          },
        ],
        placeholder: 'Payment status',
      },
      fieldName: 'financialStatus',
      label: 'Status',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Order ID',
      componentProps: {
        placeholder: ' ',
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};

let footerData = {
  name: '',
  processedAt: '',
  quantityTotal: '_',
  grossSales: '_',
  customerFee: '_',
  discount: '_',
  refundTotal: '_',
  netPayment: '_',
  shippingCosts: '_',
  cogs: '_',
  handlingFees: '_',
  transactionFees: '_',
  grossProfit: '_',
  grossProfitMargin: '_',
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-bold',
      title: 'Order ID',
      minWidth: 120,
    },
    {
      field: 'processedAt',
      title: 'Date',
      formatter: 'npFormatDateTime',
      minWidth: 110,
    },
    {
      field: 'quantityTotal',
      footerClassName: 'font-bold',
      title: 'Items',
      minWidth: 100,
    },
    {
      field: 'quantityCurrent',
      footerClassName: 'font-bold',
      title: 'Current Items',
      minWidth: 130,
      visible: false,
    },
    {
      field: 'quantityRefund',
      footerClassName: 'font-bold',
      title: 'Refund Items',
      minWidth: 130,
      visible: false,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      footerClassName: 'font-bold',
      field: 'grossSales',
      title: 'Gross Sales',
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      footerClassName: 'font-bold',
      field: 'customerFee',
      title: 'Customer Paid',
      titlePrefix: {
        content: 'The fees paid by the customer. Ex: shipping, tips, etc.',
      },
      align: 'right',
      minWidth: 140,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'discount',
      title: 'Discount',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'refundTotal',
      title: 'Refund',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      footerClassName: 'font-bold',
      field: 'netPayment',
      title: 'Revenue',
      titlePrefix: {
        content:
          'Net payment = Revenue = Gross sales + Customer paid - Discount - Refund',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'shippingCosts',
      title: 'Shipping Cost',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'cogs',
      title: 'COGS',
      titlePrefix: {
        content:
          'Cost of Goods Sold (COGS) is the direct costs attributable to the production of the goods sold in a company. This amount includes the cost of the materials used in creating the good along with the direct labor costs used to produce the good.',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'handlingFees',
      title: 'Handling',
      titlePrefix: {
        content:
          'Handling fees are the costs associated with the handling of goods, including the cost of labor, packaging, and shipping.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      footerClassName: 'font-bold',
      field: 'transactionFees',
      title: 'Transaction',
      titlePrefix: {
        content:
          'Transaction fees are fees that a merchant must pay every time a customer makes a purchase with a credit card. These fees can vary depending on the credit card company and the merchant account provider.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      footerClassName: 'font-bold',
      field: 'grossProfit',
      title: 'Gross Profit',
      titlePrefix: {
        content:
          'Gross profit = Revenue - COGS - Shipping cost - Handling - Transaction',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellPercentage', props: { strong: true } },
      footerClassName: 'font-bold',
      field: 'grossProfitMargin',
      title: 'Gross Profit Margin',
      titlePrefix: {
        content: 'Gross profit margin = (Gross profit / Revenue) * 100%',
      },
      align: 'right',
      minWidth: 170,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getReportOrderApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        if (res.summary) {
          footerData = res.summary;

          // Reset some fields
          footerData.name = `${res.total} order(s)`;
          footerData.processedAt = '';
          footerData.grossProfitMargin =
            calcGrossProfitMargin(footerData).toString();
        }

        return res;
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  showFooter: true,
  footerMethod: () => {
    return [footerData];
  },
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 2 }],
};

const [Grid] = useVbenVxeGrid({ gridOptions, formOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="Order Report" />
  </Page>
</template>
