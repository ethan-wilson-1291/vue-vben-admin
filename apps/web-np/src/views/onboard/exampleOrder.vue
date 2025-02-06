<script lang="ts" setup>
import { Card } from 'ant-design-vue';

import { useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import { sampleOrder } from './service';

const shopStore = useShopStore();
const currencySymbol = shopStore.shop.currencySymbol;
</script>

<template>
  <Card title="Example Order" class="min-w-56">
    <div class="mb-2 flex justify-between font-bold">
      <div>Net Payment</div>
      <div>{{ formatMoney(sampleOrder.grossSales, currencySymbol) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Total COGS</div>
      <div>{{ formatMoney(sampleOrder.totalCogs, currencySymbol) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Handling Fees</div>
      <div>
        {{ formatMoney(sampleOrder.totalHandlingFees, currencySymbol) }}
      </div>
    </div>
    <div class="flex justify-between">
      <div>Shipping Costs</div>
      <div>{{ formatMoney(sampleOrder.shippingFees, currencySymbol) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Transaction Fees</div>
      <div>{{ formatMoney(sampleOrder.transactionFees, currencySymbol) }}</div>
    </div>
    <div class="text-md mt-2 flex justify-between font-bold">
      <div>Profit</div>
      <div>
        {{
          formatMoney(
            sampleOrder.grossSales -
              sampleOrder.totalCogs -
              sampleOrder.totalHandlingFees -
              sampleOrder.shippingFees -
              sampleOrder.transactionFees,
            currencySymbol,
          )
        }}
      </div>
    </div>
  </Card>
</template>
