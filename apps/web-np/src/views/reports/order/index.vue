<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getReportOrderApi } from '#/api';

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
      align: 'left',
    },
    // { field: 'totalReceivedMoney', title: 'netPayment before Refund' },
    { field: 'grossSales', title: 'Gross Sales' },
    // { field: 'subTotal', title: 'subTotal' },
    { field: 'discount', title: 'discount' },
    { field: 'customerFee', title: 'customerFee' },
    // { field: 'subTotalCurrent', title: 'subTotalCurrent' },
    { field: 'refundTotal', title: 'refundTotal' },
    { field: 'netPayment', title: 'netPayment' },
    { field: 'taxesTotal', title: 'taxesTotal' },
    { field: 'handlingFees', title: 'handlingFees' },
    { field: 'cogs', title: 'cogs' },
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="Order" table-title-help="Helper">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="() => gridApi.query()">
          Calc all COGS
        </Button>
      </template>
    </Grid>
  </Page>
</template>
