<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

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

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    {
      field: 'name',
      title: 'Name',
      type: 'checkbox',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      field: 'grossSales',
      title: 'Gross Sales',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'success' } },
      field: 'customerFee',
      title: 'Customer Paid Fees',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'discount',
      title: 'Discount',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'refundTotal',
      title: 'Total Refund',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      field: 'netPayment',
      title: 'Net Payment',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'shippingCosts',
      title: 'Shipping Cost',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'cogs',
      title: 'COGS',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'handlingFees',
      title: 'Handling Fees',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { type: 'danger' } },
      field: 'transactionFees',
      title: 'Transaction Fees',
      align: 'right',
    },
    {
      cellRender: { name: 'CellNumber', props: { strong: true } },
      field: 'grossProfit',
      title: 'Gross Profit',
      align: 'right',
    },
    {
      slots: { default: 'gross-profit-margin' },
      title: 'Gross Profit Margin',
      align: 'right',
    },
    {
      field: 'processedAt',
      title: 'Date',
      formatter: 'formatDateTime',
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getReportOrderApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="Order" table-title-help="Helper">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="() => gridApi.query()">
          Calc all COGS
        </Button>
      </template>
      <template #gross-profit-margin="{ row }">
        {{ calcPercentage(row.grossProfit, row.netPayment) }}%
      </template>
    </Grid>
  </Page>
</template>
