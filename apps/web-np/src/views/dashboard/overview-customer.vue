<script setup lang="ts">
import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenButton,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { formatMoney, redirect, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';

import { state } from './service';

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;
const getData = computed(() => {
  const repurchasedRate = state.customerTotal.newCustomers
    ? state.customerTotal.quantityRepurchase / state.customerTotal.newCustomers
    : 0;

  const ltv = state.customerTotal.newCustomers
    ? state.customerTotal.netPayment / state.customerTotal.newCustomers
    : 0;

  return [
    {
      title: 'New customers',
      value: state.customerTotal.newCustomers,
    },
    {
      title: 'Repurchase rate',
      value: `${toPercentage(repurchasedRate)}%`,
      explain: 'Repurchase Rate = (Repurchase customers / New customers) * 100',
    },
    {
      title: 'New customers revenue',
      value: formatMoney(state.customerTotal.netPayment, currency, rate),
    },
    {
      title: 'Lifetime Value (LTV)',
      value: formatMoney(ltv, currency, rate),
      explain:
        'Lifetime Value (LTV) represents the average revenue a customer generates over their entire duration as a paying customer.',
    },
  ];
});
</script>

<template>
  <Card class="w-full" title="Order Summary">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Customer Summary</span>
        <VbenButton
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
          @click="redirect('reports-customer-analytics')"
        >
          View details
        </VbenButton>
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
      >
        <div class="flex items-center space-x-1">
          <span>{{ item.title }}</span>

          <template v-if="item.explain">
            <IconifyIcon
              v-tippy="{
                content: item.explain,
              }"
              icon="ant-design:question-circle-outlined"
            />
          </template>
        </div>
        <div>
          {{ item.value }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>
