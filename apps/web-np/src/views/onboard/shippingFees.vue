<script lang="ts" setup>
import { useUserStore } from '@vben/stores';

import { Card, InputNumber, RadioButton, RadioGroup } from 'ant-design-vue';

import { ShippingCostLevel } from '#/constants';
import { getCurrencySymbol } from '#/utils';

const props = defineProps<{
  level: any;
  price: any;
}>();
const emit = defineEmits(['levelChange', 'priceChange']);

const userStore = useUserStore();

const handleLevelChange = (e: any) => {
  emit('levelChange', e.target.value);
};

const handlePriceChange = (e: any) => {
  emit('priceChange', e);
};

const getUnitName = () => {
  return props.level === ShippingCostLevel.QUANTITY ? 'Item' : 'Kg';
};
</script>

<template>
  <Card title="Shipping Costs">
    <p>
      Shipping costs are the fees charged to transport goods from one location
      to another. They are added to the cost of the products ordered by a
      customer.
    </p>

    <div class="mt-5 flex justify-between">
      <div class="font-semibold">The shipping costs will be calculated by</div>

      <RadioGroup
        @change="handleLevelChange"
        class="w-full max-w-48"
        :value="level"
      >
        <RadioButton
          class="w-full max-w-24"
          :value="ShippingCostLevel.QUANTITY"
        >
          Quantity
        </RadioButton>
        <RadioButton class="w-full max-w-24" :value="ShippingCostLevel.WEIGHT">
          Weight
        </RadioButton>
      </RadioGroup>
    </div>

    <div class="mt-2 flex justify-between">
      <div class="font-semibold">Default shipping cost for one unit</div>

      <InputNumber
        :addon-after="getUnitName()"
        :prefix="getCurrencySymbol(userStore.shop.currency)"
        @change="handlePriceChange"
        :value="price"
        class="w-full max-w-48"
      />
    </div>
  </Card>
</template>
