<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { $t } from '@vben/locales';

import { Card, InputNumber } from 'ant-design-vue';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();
const currencySymbol = shopStore.shop.currencySymbol;

const calcFees = (quantity: number) => {
  return quantity * onboardForm.handlingFees;
};

const handleChange = () => {
  sampleOrder.lineItems.forEach((item) => {
    item.handlingFees = calcFees(item.quantity);
  });

  sampleOrder.totalHandlingFees =
    sampleOrder.lineItems.reduce((acc, item) => acc + item.handlingFees, 0) ||
    0;
};

onBeforeMount(() => {
  handleChange();
});
</script>

<template>
  <Card :title="$t('page.onboard.stepHandlingFees.title')">
    <p>
      {{ $t('field-name.handlingFeesExplain') }}
    </p>

    <div class="mt-5 flex justify-between">
      <div class="font-semibold">
        {{ $t('page.onboard.stepHandlingFees.defaultHandlingFee') }}
      </div>

      <InputNumber
        :min="0"
        :addon-after="shopStore.shop.currency"
        :prefix="currencySymbol"
        v-model:value="onboardForm.handlingFees"
        @change="handleChange"
        class="w-full max-w-40"
      />
    </div>

    <table class="mt-2 min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            {{ $t('page.onboard.common.exampleProduct') }}
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium uppercase">
            {{ $t('page.onboard.common.quantity') }}
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">
            {{ $t('field-name.handlingFees') }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="(item, index) in sampleOrder.lineItems" :key="index">
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-center text-sm">
            {{ item.quantity }}
          </td>
          <td class="px-6 py-4 text-end text-sm font-bold">
            {{ formatMoney(item.handlingFees, shopStore.shop.currency) }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
