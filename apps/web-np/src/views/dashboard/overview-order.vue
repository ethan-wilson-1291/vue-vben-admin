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
import { $t } from '@vben/locales';

import { formatMoney, redirect } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod } from './service';

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getData = computed(() => {
  const avgOrderRevenue = currentPeriod.pAndLReport.quantityOrder
    ? currentPeriod.pAndLReport.netPayment /
      currentPeriod.pAndLReport.quantityOrder
    : 0;

  const avgOrderCost = currentPeriod.pAndLReport.quantityOrder
    ? currentPeriod.pAndLReport.totalCosts /
      currentPeriod.pAndLReport.quantityOrder
    : 0;

  const avgOrderNetProfit = currentPeriod.pAndLReport.quantityOrder
    ? currentPeriod.pAndLReport.netProfit /
      currentPeriod.pAndLReport.quantityOrder
    : 0;

  return [
    {
      title: $t('field-name.totalOrders'),
      value: currentPeriod.pAndLReport.quantityOrder,
    },
    {
      title: $t('field-name.netPayment'),
      value: formatMoney(currentPeriod.pAndLReport.netPayment, currency, rate),
    },
    {
      title: $t('page.dashboard.avgOrderRevenue'),
      value: formatMoney(avgOrderRevenue, currency, rate),
      class: 'text-normal',
      explain: $t('page.dashboard.avgOrderRevenueExplain'),
    },
    {
      title: $t('field-name.totalCosts'),
      value: formatMoney(currentPeriod.pAndLReport.totalCosts, currency, rate),
    },
    {
      title: $t('page.dashboard.avgOrderCost'),
      value: formatMoney(avgOrderCost, currency, rate),
      class: 'text-normal',
      explain: $t('page.dashboard.avgOrderCostExplain'),
    },
    {
      title: $t('page.dashboard.totalNetProfit'),
      value: formatMoney(currentPeriod.pAndLReport.netProfit, currency, rate),
    },
    {
      title: $t('page.dashboard.avgOrderProfit'),
      value: formatMoney(avgOrderNetProfit, currency, rate),
      class: 'text-normal',
      explain: $t('page.dashboard.avgOrderProfitExplain'),
    },
  ];
});
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>{{ $t('page.dashboard.orderSummary') }}</span>
        <VbenButton
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
          @click="redirect('reports-order')"
        >
          {{ $t('page.dashboard.viewDetails') }}
        </VbenButton>
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
        :class="item.class ?? 'text-muted-foreground'"
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
