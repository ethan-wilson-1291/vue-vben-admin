<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { $t } from '@vben/locales';

import { Card, Image, InputNumber, Slider, Switch } from 'ant-design-vue';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();

const calcCogs = (price: number, quantity: number) => {
  return (price * quantity * onboardForm.cogsRate) / 100;
};

const handleCogsRateChange = () => {
  sampleOrder.lineItems.forEach((item) => {
    item.cogs = calcCogs(item.price, item.quantity);
  });

  sampleOrder.totalCogs =
    sampleOrder.lineItems.reduce((acc, item) => acc + item.cogs, 0) || 0;

  sampleOrder.grossSales = sampleOrder.lineItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
};

onBeforeMount(() => {
  handleCogsRateChange();
});
</script>

<template>
  <Card :title="$t('page.onboard.stepCogs.title')">
    <template #extra>
      <a
        href="https://www.shopify.com/retail/cost-of-goods-sold"
        target="_blank"
      >
        {{ $t('page.onboard.common.more') }}
      </a>
    </template>
    <p>
      {{ $t('field-name.cogsExplain') }}
    </p>

    <div class="mt-5 w-full text-center">
      <Switch
        :checked-children="$t('page.onboard.stepCogs.syncFromShopify')"
        :un-checked-children="$t('page.onboard.stepCogs.manual')"
        :class="{
          '!bg-green-500': !onboardForm.cogsFromShopify,
        }"
        :checked="onboardForm.cogsFromShopify"
        @change="
          (checked: any) => {
            onboardForm.cogsFromShopify = checked;
          }
        "
      />
    </div>

    <div class="mt-5" v-show="onboardForm.cogsFromShopify">
      {{ $t('page.onboard.stepCogs.syncDescriptionPrefix') }}
      <span class="font-semibold italic">
        {{ $t('page.onboard.stepCogs.costPerItem') }}
      </span>
      {{ $t('page.onboard.stepCogs.syncDescriptionSuffix') }}
      {{ $t('page.onboard.common.forExample') }}:

      <Image class="mt-2" src="/static/images/cogs-from-shopify.png" />
    </div>

    <div class="mt-5" v-show="!onboardForm.cogsFromShopify">
      <div class="flex">
        <div class="font-semibold">
          {{ $t('page.onboard.stepCogs.defaultCogsRate') }}
        </div>
        <div class="ml-5 font-bold">{{ onboardForm.cogsRate }}%</div>
      </div>

      <Slider
        @change="handleCogsRateChange"
        v-model:value="onboardForm.cogsRate"
        :marks="{
          0: '0%',
          75: '75%',
          100: '100%',
        }"
      />

      <table class="min-w-full divide-y">
        <thead>
          <tr>
            <th class="px-6 py-3 text-start text-xs font-medium uppercase">
              {{ $t('page.onboard.common.exampleProduct') }}
            </th>
            <th class="px-6 py-3 text-start text-xs font-medium uppercase">
              {{ $t('page.onboard.common.salePrice') }}
            </th>
            <th class="px-6 py-3 text-start text-xs font-medium uppercase">
              {{ $t('page.onboard.common.quantity') }}
            </th>
            <th class="px-6 py-3 text-end text-xs font-medium uppercase">
              COGS
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="(item, index) in sampleOrder.lineItems" :key="index">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 text-start text-sm">
              <InputNumber
                :min="0"
                :prefix="shopStore.shop.currencySymbol"
                v-model:value="item.price"
                @change="handleCogsRateChange"
                class="w-full max-w-48"
                size="small"
              />
            </td>
            <td class="px-6 py-4 text-start text-sm">
              <InputNumber
                :min="0"
                class="w-full max-w-48"
                size="small"
                v-model:value="item.quantity"
                @change="handleCogsRateChange"
              />
            </td>
            <td class="px-6 py-4 text-end text-sm font-bold">
              {{ formatMoney(item.cogs, shopStore.shop.currency) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>
