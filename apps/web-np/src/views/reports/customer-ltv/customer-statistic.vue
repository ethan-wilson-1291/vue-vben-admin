<script setup lang="ts">
import type { Component } from 'vue';

import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenIcon,
} from '@vben/common-ui';
import { $t } from '@vben/locales';

import { convertRate, formatMoney, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';

interface IAnalysisOverviewItem {
  icon: Component | string;
  title: string;
  value: any;
  suffix?: string;
  prefix?: string;
  explain?: string;
}

interface ILTVReportItem {
  id: string;
  netPayment: number;
  processedMonth: string;
  customerMonth: string;
  quantityNew: number;
  quantityRepurchase: number;
}

interface Props {
  items?: any | ILTVReportItem[];
  loading?: boolean;
}

defineOptions({
  name: 'CustomerStatistic',
});

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
});

const shopStore = useShopStore();

const getItems = computed((): IAnalysisOverviewItem[] => {
  let totalCutomer = 0;
  let totalCutomerRepurchase = 0;
  let totalRevenue = 0;

  props.items.forEach((item: any) => {
    totalCutomer += item.quantityNew;
    totalCutomerRepurchase += item.quantityRepurchase;
    totalRevenue += item.netPayment;
  });

  totalRevenue = convertRate(totalRevenue, shopStore.shop.currencyRate);
  const ltv = totalCutomer ? totalRevenue / totalCutomer : 0;
  const repurchase = totalCutomer ? totalCutomerRepurchase / totalCutomer : 0;

  return [
    {
      icon: 'ant-design:usergroup-add-outlined',
      title: $t('page.reports-customer.cards.newCustomers'),
      value: totalCutomer,
    },
    {
      icon: 'ant-design:user-switch-outlined',
      title: $t('page.reports-customer.cards.repurchaseRate'),
      value: `${toPercentage(repurchase)}%`,
      suffix: '%',
      explain: $t('page.reports-customer.cards.repurchaseRateExplain'),
    },
    {
      icon: 'ant-design:dollar-circle-outlined',
      title: $t('page.reports-customer.cards.newCustomerRevenue'),
      value: formatMoney(totalRevenue, shopStore.shop.currencyFromApp),
      explain: $t('page.reports-customer.cards.newCustomerRevenueExplain'),
    },
    {
      icon: 'ant-design:field-time-outlined',
      title: $t('field-name.ltv'),
      value: formatMoney(ltv, shopStore.shop.currencyFromApp),
      explain: $t('field-name.ltvExplain'),
    },
  ];
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <template v-for="item in getItems" :key="item.title">
      <Card
        class="w-full"
        :title="item.title"
        v-loading="props.loading"
        v-tippy="{
          content: item.explain,
          animation: 'scale',
        }"
      >
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between">
          <div class="text-xl">
            {{ item.value }}
          </div>
          <VbenIcon :icon="item.icon" class="size-8 flex-shrink-0" />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
