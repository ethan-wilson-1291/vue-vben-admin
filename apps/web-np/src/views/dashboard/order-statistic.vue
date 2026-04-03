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

import { Alert } from 'ant-design-vue';

import { formatMoney, redirectToExternal } from '#/shared/utils';
import { useShopSettingStore, useShopStore } from '#/store';

import UpgradeBtn from '../shared-components/upgrade-btn.vue';
import {
  currentPeriod,
  dashboardState,
  getChangePercentColor,
  previousPeriod,
} from './service';

defineOptions({
  name: 'CustomerStatistic',
});

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getOverview = computed(() => {
  return [
    {
      title: $t('field-name.totalOrders'),
      value: currentPeriod.pAndLReport.quantityOrder,
      changePercent: dashboardState.changePercent.quantityOrder,
      previousValue: previousPeriod.pAndLReport.quantityOrder,
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netPayment, currency, rate),
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netPayment,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalCosts'),
      explain: $t('field-name.totalCostsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.totalCosts, currency, rate),
      changePercent: dashboardState.changePercent.totalCosts,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalCosts,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netProfit, currency, rate),
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.pAndLReport.netProfitMargin}%`,
    },
  ];
});

const getDetails = computed(() => {
  return [
    {
      title: $t('field-name.totalShipping'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalShipping,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalShipping,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalShipping,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalTip'),
      value: formatMoney(currentPeriod.pAndLReport.totalTip, currency, rate),
      changePercent: dashboardState.changePercent.totalTip,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalTip,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.grossSales'),
      explain: $t('field-name.grossSalesExplain'),
      value: formatMoney(currentPeriod.pAndLReport.grossSales, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.grossSales,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.grossSales,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalDiscount'),
      value: formatMoney(currentPeriod.pAndLReport.discount, currency, rate),
      changePercent: dashboardState.changePercent.discount,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.discount,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalRefund'),
      value: formatMoney(currentPeriod.pAndLReport.refund, currency, rate),
      changePercent: dashboardState.changePercent.refund,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.refund,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netPayment, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netPayment,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.cogs, currency),
      changePercent: dashboardState.changePercent.cogs,
      previousValue: formatMoney(previousPeriod.pAndLReport.cogs, currency),
    },
    {
      title: $t('field-name.handlingFees'),
      explain: $t('field-name.handlingFeesExplain'),
      value: formatMoney(
        currentPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.handlingFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.shippingCosts'),
      value: formatMoney(
        currentPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.shippingCosts,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.transactionFees'),
      value: formatMoney(
        currentPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.transactionFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.grossProfit'),
      explain: $t('field-name.grossProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.grossProfit, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.grossProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.grossProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalTax'),
      explain: $t('field-name.totalTaxExplain'),
      value: formatMoney(currentPeriod.pAndLReport.totalTax, currency, rate),
      changePercent: dashboardState.changePercent.totalTax,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalTax,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalCustomCost'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalCustomCost,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalAdSpend'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalAdSpend,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.roas'),
      explain: $t('field-name.roasExplain'),
      value: formatMoney(currentPeriod.pAndLReport.roas, currency, rate),
      changePercent: dashboardState.changePercent.roas,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.roas,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.poas'),
      explain: $t('field-name.poasExplain'),
      value: formatMoney(currentPeriod.pAndLReport.poas, currency, rate),
      changePercent: dashboardState.changePercent.poas,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.poas,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netProfit, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.pAndLReport.netProfitMargin}%`,
      isBold: true,
    },
  ];
});

const handleWriteReview = () => {
  const url = `https://apps.shopify.com/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}#modal-show=WriteReviewModal`;
  redirectToExternal(url);
};

const closeNewFeatureNotice = () => {
  shopSettingStore.showNewFeatureNotice = false;
};
</script>

<template>
  <div
    v-loading="dashboardState.loading"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  >
    <template v-for="item in getOverview" :key="item.title">
      <Card class="w-full" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle
            class="flex flex-nowrap items-center justify-between text-lg"
          >
            <div class="flex flex-nowrap items-center space-x-1">
              <span>
                {{ item.title }}
              </span>

              <template v-if="item.explain">
                <IconifyIcon
                  v-tippy="{
                    content: item.explain,
                  }"
                  icon="ant-design:question-circle-outlined"
                  class="size-4"
                />
              </template>
            </div>

            <template v-if="item.changePercent">
              <span
                class="text-sm"
                :class="getChangePercentColor(item.changePercent)"
                :style="
                  shopStore.isFreeSubscription
                    ? {
                        filter: 'blur(4px)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }
                    : undefined
                "
                v-tippy="{
                  content: item.previousValue
                    ? $t('page.dashboard.comparedWithValue', [
                        item.previousValue,
                      ])
                    : '',
                }"
              >
                {{ item.changePercent }}
              </span>
            </template>
          </CardTitle>
        </CardHeader>

        <CardContent
          class="flex items-center justify-between text-lg"
          :class="{
            'pointer-events-none select-none blur-sm':
              shopStore.isFreeSubscription,
          }"
        >
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </div>

  <Alert
    v-if="shopStore.isFreeSubscription"
    :show-icon="true"
    class="mt-5"
    type="warning"
    closable
  >
    <template #icon>
      <IconifyIcon icon="emojione-v1:ringing-bell" />
    </template>
    <template #message>
      <span class="font-semibold">
        {{ $t('page.dashboard.reviewPromoTitle') }}
      </span>
    </template>
    <template #description>
      {{ $t('page.dashboard.reviewPromoLine1') }}
      <div>
        {{ $t('page.dashboard.reviewPromoLine2') }}
        <strong>{{ $t('page.dashboard.reviewPromoBonus') }}</strong>
        !
      </div>

      <div class="flex items-center space-x-2">
        <UpgradeBtn class="mt-2" size="sm" variant="secondary" />

        <VbenButton
          class="mt-2"
          size="sm"
          variant="secondary"
          @click="handleWriteReview"
        >
          <IconifyIcon class="mr-2" icon="ant-design:export-outlined" />
          {{ $t('page.dashboard.writeReview') }}
        </VbenButton>
      </div>
    </template>
    <template #action> </template>
  </Alert>

  <Alert
    v-if="shopSettingStore.showNewFeatureNotice"
    :show-icon="true"
    class="mt-5"
    type="info"
    closable
    @close="closeNewFeatureNotice"
  >
    <template #icon>
      <IconifyIcon icon="lucide:languages" />
    </template>
    <template #message>
      <span class="font-semibold">
        {{ $t('page.dashboard.newFeatureLanguageTitle') }}
      </span>
    </template>
    <template #description>
      <div class="flex flex-col gap-3 md:flex-row md:items-start">
        <div class="md:w-3/5">
          <p class="mb-2">
            {{ $t('page.dashboard.newFeatureLanguageDescription') }}
          </p>
          <p class="mb-1 text-sm">
            {{ $t('page.dashboard.newFeatureLanguageListTitle') }}
          </p>
          <ul class="m-0 list-disc pl-5 text-sm leading-6">
            <li>English</li>
            <li>Español</li>
            <li>Français</li>
            <li>Italiano</li>
            <li>简体中文</li>
            <li>Tiếng Việt</li>
          </ul>
        </div>
        <img
          :alt="$t('page.dashboard.newFeatureLanguageImageAlt')"
          class="w-full rounded border border-gray-200 md:w-3/5"
          src="/static/images/feature-multiple-language.png"
        />
      </div>
    </template>
  </Alert>

  <Card
    class="mt-5 grid grid-cols-1 gap-4 pb-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    v-loading="dashboardState.loading"
  >
    <template v-for="item in getDetails" :key="item.title">
      <Card class="w-full border-0" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle
            class="flex flex-nowrap items-center space-x-1"
            :class="item.isBold ? 'font-semibold' : 'font-normal'"
          >
            <span>
              {{ item.title }}
            </span>

            <template v-if="item.explain">
              <IconifyIcon
                v-tippy="{
                  content: item.explain,
                }"
                icon="ant-design:question-circle-outlined"
              />
            </template>

            <template v-if="item.changePercent">
              <span
                :class="getChangePercentColor(item.changePercent)"
                :style="
                  shopStore.isFreeSubscription
                    ? {
                        filter: 'blur(4px)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }
                    : undefined
                "
                v-tippy="{
                  content: item.previousValue
                    ? $t('page.dashboard.comparedWithValue', [
                        item.previousValue,
                      ])
                    : '',
                }"
              >
                {{ item.changePercent }}
              </span>
            </template>
          </CardTitle>
        </CardHeader>

        <CardContent
          class="pb-0 !text-lg"
          :class="{
            'pointer-events-none select-none blur-sm':
              shopStore.isFreeSubscription,
          }"
        >
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </Card>
</template>
