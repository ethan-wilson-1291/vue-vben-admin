<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenButton,
} from '@vben/common-ui';
import { $t } from '@vben/locales';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { formatMoney, redirect } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod, previousPeriod } from './service';

const chartRef = ref<EchartsUIType>();
const shopStore = useShopStore();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  reload();
});

watch(
  () => [
    currentPeriod.pAndLReport.totalAdSpend,
    previousPeriod.pAndLReport.totalAdSpend,
  ],
  () => {
    reload();
  },
);

const reload = () => {
  renderEcharts({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params: any) {
        const title = params[0].axisValueLabel;
        const lines = params.map((p: any) => {
          const money = formatMoney(
            p.value,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          );

          return `${p.marker} ${p.seriesName}: ${money}`;
        });
        return `${title}<br/>${lines.join('<br/>')}`;
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      top: '0%',
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: [
        $t('page.dashboard.previousPeriod'),
        $t('page.dashboard.currentPeriod'),
      ],
    },
    series: [
      {
        name: $t('field-name.facebookAds'),
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          Number(previousPeriod.pAndLReport.facebook.toFixed(2)),
          Number(currentPeriod.pAndLReport.facebook.toFixed(2)),
        ],
      },
      {
        name: $t('field-name.tiktokAds'),
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          Number(previousPeriod.pAndLReport.tiktok.toFixed(2)),
          Number(currentPeriod.pAndLReport.tiktok.toFixed(2)),
        ],
      },
      {
        name: 'Google',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          Number(previousPeriod.pAndLReport.google.toFixed(2)),
          Number(currentPeriod.pAndLReport.google.toFixed(2)),
        ],
      },
    ],
  });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between space-x-1">
        <span>{{ $t('page.dashboard.adAnalytics') }}</span>

        <VbenButton
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
          @click="redirect('reports-p-and-l')"
        >
          {{ $t('page.dashboard.viewDetails') }}
        </VbenButton>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EchartsUI height="200px" ref="chartRef" />
    </CardContent>
  </Card>
</template>
