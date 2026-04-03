<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { $t } from '@vben/locales';

import { Card, InputNumber, Select } from 'ant-design-vue';

import { ShippingCostLevel } from '#/shared/constants';
import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();

const getUnitName = () => {
  switch (onboardForm.shippingFeeLevel) {
    case ShippingCostLevel.QUANTITY: {
      return `/${$t('page.onboard.common.item')}`;
    }
    case ShippingCostLevel.WEIGHT: {
      return '/kg';
    }
    default: {
      return `/${$t('page.onboard.common.order')}`;
    }
  }
};

const shippingLevelOptions = [
  {
    label: $t('page.settings-shipping-fees.level.quantity'),
    value: ShippingCostLevel.QUANTITY,
  },
  {
    label: $t('page.settings-shipping-fees.level.weight'),
    value: ShippingCostLevel.WEIGHT,
  },
  {
    label: $t('page.settings-shipping-fees.level.order'),
    value: ShippingCostLevel.ORDER,
  },
];

const handleChange = () => {
  let totalUnit = sampleOrder.totalWeight;

  if (onboardForm.shippingFeeLevel === ShippingCostLevel.QUANTITY) {
    totalUnit = sampleOrder.lineItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  }

  if (onboardForm.shippingFeeLevel === ShippingCostLevel.ORDER) {
    totalUnit = 1;
  }

  sampleOrder.shippingFees = onboardForm.shippingFeePrice * totalUnit;
};

const totalQuantity = sampleOrder.lineItems.reduce(
  (acc, item) => acc + item.quantity,
  0,
);

onBeforeMount(() => {
  handleChange();
});
</script>

<template>
  <Card :title="$t('page.onboard.stepShippingFees.title')">
    <p>
      {{ $t('field-name.shippingCosts') }}
      {{ $t('page.onboard.stepShippingFees.description') }}
    </p>

    <div class="mt-5 flex items-center justify-between">
      <div class="font-semibold">
        {{ $t('page.onboard.stepShippingFees.calculateBy') }}
      </div>

      <Select
        v-model:value="onboardForm.shippingFeeLevel"
        class="w-full max-w-48"
        :options="shippingLevelOptions"
        @change="handleChange"
      />
    </div>

    <div class="mt-2 flex items-center justify-between">
      <div class="font-semibold">
        {{ $t('page.onboard.stepShippingFees.defaultShippingCost') }}
      </div>

      <InputNumber
        :addon-after="getUnitName()"
        :min="0"
        :prefix="shopStore.shop.currencySymbol"
        @change="handleChange"
        v-model:value="onboardForm.shippingFeePrice"
        class="w-full max-w-48"
      />
    </div>

    <table class="mt-5 min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            {{ $t('page.onboard.common.exampleOrder') }}
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium uppercase">
            {{ $t('page.onboard.stepShippingFees.itemQuantity') }}
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium uppercase">
            {{ $t('page.onboard.stepShippingFees.totalWeight') }}
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">
            {{ $t('field-name.shippingCosts') }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">#9999</td>
          <td class="px-6 py-4 text-center text-sm">
            {{ totalQuantity }}
          </td>
          <td class="px-6 py-4 text-center text-sm">
            {{ sampleOrder.totalWeight }} kg
          </td>
          <td class="px-6 py-4 text-end text-sm font-bold">
            {{ formatMoney(sampleOrder.shippingFees, shopStore.shop.currency) }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
