<script lang="ts" setup>
import { reactive } from 'vue';

import { useUserStore } from '@vben/stores';

import { Card } from 'ant-design-vue';

import { formatMoney } from '#/utils';

const props = defineProps<{
  grossSales: number;
  totalCogs: number;
  totalQuantity: number;
}>();

const userStore = useUserStore();
const currencySymbol = userStore.shop.currency;
const state = reactive({
  handlingFees: formatMoney(3.4, currencySymbol),
  shippingFees: formatMoney(5.2, currencySymbol),
  transactionFees: formatMoney(2.21, currencySymbol),
});
</script>

<template>
  <Card title="Example Order" class="min-w-56">
    <div class="mb-2 flex justify-between font-bold">
      <div>Revenue</div>
      <div>{{ formatMoney(props.grossSales, currencySymbol) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Total COGS</div>
      <div>{{ formatMoney(props.totalCogs, currencySymbol) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Handling Fees</div>
      <div>{{ state.handlingFees }}</div>
    </div>
    <div class="flex justify-between">
      <div>Shipping Costs</div>
      <div>{{ state.shippingFees }}</div>
    </div>
    <div class="flex justify-between">
      <div>Transaction Fees</div>
      <div>{{ state.transactionFees }}</div>
    </div>
    <div class="text-md mt-2 flex justify-between font-bold">
      <div>Profit</div>
      <div>
        {{
          formatMoney(
            props.grossSales - props.totalCogs - 3.4 - 5.2 - 2.21,
            currencySymbol,
          )
        }}
      </div>
    </div>
  </Card>
</template>
