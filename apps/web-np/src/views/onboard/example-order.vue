<script lang="ts" setup>
import { computed } from 'vue';

import { $t } from '@vben/locales';

import { Card, Divider } from 'ant-design-vue';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

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
  <Card :title="$t('page.onboard.exampleOrder.title')" class="min-w-56">
    <div class="mb-2 flex justify-between font-bold">
      <div>{{ $t('field-name.netPayment') }}</div>
      <div>
        {{ formatMoney(sampleOrder.grossSales, shopStore.shop.currency) }}
      </div>
    </div>

    <Divider class="!my-1" />

    <div class="text-md mb-1 flex justify-between font-bold">
      <div>{{ $t('field-name.totalCosts') }}</div>
      <div>
        {{ formatMoney(totalCost, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-xs">
      <div class="mb-1 before:mr-1 before:text-foreground before:content-['•']">
        {{ $t('field-name.cogs') }}
      </div>
      <div>
        {{ formatMoney(sampleOrder.totalCogs, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-xs">
      <div class="mb-1 before:mr-1 before:text-foreground before:content-['•']">
        {{ $t('field-name.handlingFees') }}
      </div>
      <div>
        {{
          formatMoney(sampleOrder.totalHandlingFees, shopStore.shop.currency)
        }}
      </div>
    </div>
    <div class="flex justify-between text-xs">
      <div class="mb-1 before:mr-1 before:text-foreground before:content-['•']">
        {{ $t('field-name.shippingCosts') }}
      </div>
      <div>
        {{ formatMoney(sampleOrder.shippingFees, shopStore.shop.currency) }}
      </div>
    </div>
    <div class="flex justify-between text-xs">
      <div class="mb-1 before:mr-1 before:text-foreground before:content-['•']">
        {{ $t('field-name.transactionFees') }}
      </div>
      <div>
        {{ formatMoney(sampleOrder.transactionFees, shopStore.shop.currency) }}
      </div>
    </div>

    <Divider class="!my-1" />

    <div class="text-md mt-2 flex justify-between font-bold">
      <div>{{ $t('field-name.grossProfit') }}</div>
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
