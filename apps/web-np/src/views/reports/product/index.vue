<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Image as AImage } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useSubscriptionGate } from '#/shared/subscription-gate';
import { formatMoney, numberWithCommas } from '#/shared/utils';
import { useShopStore } from '#/store';
import UpgradeBtn from '#/views/shared-components/upgrade-btn.vue';

import { formOptions, gridOptions } from './table-config';

const shopStore = useShopStore();
const { gateClass } = useSubscriptionGate();

const [Grid] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <UpgradeBtn class="mr-2 w-[150px]" />
      </template>

      <template #productName="{ row }: { row: any }">
        <!-- Avatar and Title - Only show for parent level -->
        <div class="my-1 flex items-center justify-start space-x-2">
          <div class="h-[35px] w-[35px] flex-none">
            <AImage
              :src="row.productImage || 'static/images/no-image.png'"
              fallback="/static/images/no-image.png"
              class="!h-[35px] !w-[35px] rounded-lg border"
            />
          </div>
          <div class="ml-1 shrink">
            {{ row.productName }}
          </div>
        </div>
      </template>

      <template #netPayment="{ row, column }">
        <span
          :class="gateClass"
          class="inline-block w-full text-right font-semibold"
        >
          {{
            formatMoney(
              row[column.field],
              shopStore.shop.currencyFromApp,
              shopStore.shop.currencyRate,
            )
          }}
        </span>
      </template>

      <template #grossProfit="{ row, column }">
        <span
          :class="gateClass"
          class="inline-block w-full text-right font-semibold"
        >
          {{
            formatMoney(
              row[column.field],
              shopStore.shop.currencyFromApp,
              shopStore.shop.currencyRate,
            )
          }}
        </span>
      </template>

      <template #grossProfitMargin="{ row, column }">
        <span
          :class="gateClass"
          class="inline-block w-full text-right font-semibold"
        >
          {{ numberWithCommas(`${row[column.field]}%`) }}
        </span>
      </template>
    </Grid>
  </Page>
</template>
