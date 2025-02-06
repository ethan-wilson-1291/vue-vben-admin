<script lang="ts" setup>
import { computed } from 'vue';

import { Card } from 'ant-design-vue';

import { useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import { sampleOrder } from './service';

const shopStore = useShopStore();
const totalCost = computed(() => {
  return (
    sampleOrder.totalCogs +
    sampleOrder.totalHandlingFees +
    sampleOrder.shippingFees +
    sampleOrder.transactionFees
  );
});
</script>

<template>
  <Card title="Example Order" class="min-w-56">
    <div class="mb-2 flex justify-between font-bold">
      <div>Net Payment</div>
      <div>
        {{ formatMoney(sampleOrder.grossSales, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="text-md flex justify-between font-bold">
      <div>Total costs</div>
      <div>
        {{ formatMoney(totalCost, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-sm">
      <div>- Total COGS</div>
      <div>
        {{ formatMoney(sampleOrder.totalCogs, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-sm">
      <div>- Handling Fees</div>
      <div>
        {{
          formatMoney(sampleOrder.totalHandlingFees, shopStore.shop.currency)
        }}
      </div>
    </div>
    <div class="flex justify-between text-sm">
      <div>- Shipping Costs</div>
      <div>
        {{ formatMoney(sampleOrder.shippingFees, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-sm">
      <div>- Transaction Fees</div>
      <div>
        {{ formatMoney(sampleOrder.transactionFees, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="text-md mt-2 flex justify-between font-bold">
      <div>Gross Profit</div>
      <div>
        {{
          formatMoney(
            sampleOrder.grossSales - totalCost,
            shopStore.shop.currency,
          )
        }}
      </div>
    </div>
  </Card>
</template>
