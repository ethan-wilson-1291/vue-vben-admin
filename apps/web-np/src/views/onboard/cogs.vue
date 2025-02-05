<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

import { useUserStore } from '@vben/stores';

import { Card, InputNumber, Slider } from 'ant-design-vue';

import { formatMoney, getCurrencySymbol } from '#/utils';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'totalCogsChange']);

const userStore = useUserStore();
const marks = {
  0: '0%',
  75: '75%',
  100: '100%',
};

const state = reactive({
  productAPrice: 10,
  productAQuantity: 1,

  productBPrice: 45,
  productBQuantity: 2,
});

const currencySymbol = getCurrencySymbol(userStore.shop.currency);

const calcCogs = (price: number, quantity: number) => {
  return (price * quantity * props.modelValue) / 100;
};

const handleTotalCogsChange = () => {
  const totalCogs =
    calcCogs(state.productAPrice, state.productAQuantity) +
    calcCogs(state.productBPrice, state.productBQuantity);

  const grossSales =
    state.productAPrice * state.productAQuantity +
    state.productBPrice * state.productBQuantity;

  emit('totalCogsChange', {
    grossSales,
    totalQuantity: state.productAQuantity + state.productBQuantity,
    totalCogs,
  });
};

const handleChange = (e: any) => {
  handleTotalCogsChange();

  emit('update:modelValue', e);
};

onMounted(() => {
  setTimeout(() => {
    handleTotalCogsChange();
  }, 500);
});
</script>

<template>
  <Card title="Cost of goods sold (COGS)">
    <template #extra>
      <a
        href="https://www.shopify.com/retail/cost-of-goods-sold"
        target="_blank"
      >
        More
      </a>
    </template>
    <p>
      Cost of goods sold (COGS) is the direct cost of producing products that
      your business sells. Also referred to as "cost of sales", COGS includes
      the cost of materials and labor directly related to the production of
      retail products.
    </p>

    <div class="mt-5 flex">
      <div class="font-semibold">Set default COGS rate for one product:</div>
      <div class="ml-5 font-bold">{{ modelValue }}%</div>
    </div>

    <Slider @change="handleChange" :value="modelValue" :marks="marks" />

    <table class="min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Example product
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Sale price
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Quantity
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">COGS</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            T-Shirt
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :prefix="currencySymbol"
              v-model:value="state.productAPrice"
              @change="handleTotalCogsChange"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              class="w-full max-w-48"
              size="small"
              v-model:value="state.productAQuantity"
              @change="handleTotalCogsChange"
            />
          </td>
          <td class="px-6 py-4 text-end text-sm">
            {{
              formatMoney(
                calcCogs(state.productAPrice, state.productAQuantity),
                userStore.shop.currency,
              )
            }}
          </td>
        </tr>
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">Shoes</td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :prefix="currencySymbol"
              v-model:value="state.productBPrice"
              @change="handleTotalCogsChange"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              class="w-full max-w-48"
              size="small"
              v-model:value="state.productBQuantity"
              @change="handleTotalCogsChange"
            />
          </td>
          <td class="px-6 py-4 text-end text-sm">
            {{
              formatMoney(
                calcCogs(state.productBPrice, state.productBQuantity),
                userStore.shop.currency,
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
