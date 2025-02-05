<script lang="ts" setup>
import type { ITransactionFee } from '@vben/stores';

import { useUserStore } from '@vben/stores';

import { Card, InputNumber } from 'ant-design-vue';

import { getCurrencySymbol } from '#/utils';

defineProps<{ modelValue: ITransactionFee[] }>();

const userStore = useUserStore();
const currencySymbol = getCurrencySymbol(userStore.shop.currency);
</script>

<template>
  <Card title="Transaction Fees">
    <p>
      A transaction fee is a charge for processing a financial transaction, such
      as a purchase or money transfer. Transaction fees are usually collected by
      payment processors or merchant banks.
    </p>

    <table class="min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Payment gateways
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Fixed fees
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Percentage fees
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Shopify external fees
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="item in modelValue" :key="item.uuid">
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :prefix="currencySymbol"
              v-model:value="item.fixedFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              addon-after="%"
              v-model:value="item.percentageFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              addon-after="%"
              v-model:value="item.externalFeePercentage"
              class="w-full max-w-48"
              size="small"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
