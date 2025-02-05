<script lang="ts" setup>
import { reactive } from 'vue';

import { useUserStore } from '@vben/stores';

import { Card } from 'ant-design-vue';

import { formatMoney } from '#/utils';

const userStore = useUserStore();
const currencySymbol = userStore.shop.currency;

const state = reactive({
  neyPayment: formatMoney(85.52, currencySymbol),
  totalCOGS: formatMoney(12.3, currencySymbol),
  handlingFees: formatMoney(3.4, currencySymbol),
  shippingFees: formatMoney(5.2, currencySymbol),
  transactionFees: formatMoney(2.21, currencySymbol),
  profit: formatMoney(85.52 - 12.3 - 3.4 - 5.2 - 2.21, currencySymbol),
});
</script>

<template>
  <Card title="Example Order" class="min-w-56">
    <div class="mb-2 flex justify-between font-bold">
      <div>Net payment</div>
      <div>{{ state.neyPayment }}</div>
    </div>
    <div class="flex justify-between">
      <div>Total COGS</div>
      <div>{{ state.totalCOGS }}</div>
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
      <div>{{ state.profit }}</div>
    </div>
  </Card>
</template>
