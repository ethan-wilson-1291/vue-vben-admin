<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { calcPercentage, getReportOrderApi } from '#/api';

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
          { label: 'Today', value: [dayjs().add(-7, 'd'), dayjs()] },
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
        options: [
          {
            label: 'Color1',
            value: '1',
          },
          {
            label: 'Color2',
            value: '2',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'payment',
      label: 'Payment',
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

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      title: 'Order ID',
      fixed: 'left',
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
      title: 'Items',
      minWidth: 100,
    },
    {
      field: 'quantityCurrent',
      title: 'Current Items',
      minWidth: 130,
      visible: false,
    },
    {
      field: 'quantityRefund',
      title: 'Refund Items',
      minWidth: 130,
      visible: false,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      field: 'grossSales',
      title: 'Gross Sales',
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      field: 'customerFee',
      title: 'Customer Paid',
      titleHelp: {
        content: 'The fees paid by the customer. Ex: shipping, tips, etc.',
      },
      align: 'right',
      minWidth: 140,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'discount',
      title: 'Discount',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'refundTotal',
      title: 'Refund',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      field: 'netPayment',
      title: 'Revenue',
      titleHelp: {
        content:
          'Net payment = Revenue = Gross sales + Customer paid - Discount - Refund',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'shippingCosts',
      title: 'Shipping Cost',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'cogs',
      title: 'COGS',
      titleHelp: {
        content:
          'Cost of Goods Sold (COGS) is the direct costs attributable to the production of the goods sold in a company. This amount includes the cost of the materials used in creating the good along with the direct labor costs used to produce the good.',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'handlingFees',
      title: 'Handling',
      titleHelp: {
        content:
          'Handling fees are the costs associated with the handling of goods, including the cost of labor, packaging, and shipping.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'transactionFees',
      title: 'Transaction',
      titleHelp: {
        content:
          'Transaction fees are fees that a merchant must pay every time a customer makes a purchase with a credit card. These fees can vary depending on the credit card company and the merchant account provider.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      field: 'grossProfit',
      title: 'Gross Profit',
      titleHelp: {
        content:
          'Gross profit = Revenue - COGS - Shipping cost - Handling - Transaction',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      slots: { default: 'gross-profit-margin' },
      title: 'Gross Profit Margin',
      titleHelp: {
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
        return await getReportOrderApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
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
};

const [Grid] = useVbenVxeGrid({ gridOptions, formOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="Order Report">
      <template #toolbar-actions>
        <Button class="ml-8" type="primary"> Calc all COGS </Button>
      </template>
      <template #gross-profit-margin="{ row }">
        {{ calcPercentage(row.grossProfit, row.netPayment) }}%
      </template>
    </Grid>
  </Page>
</template>
