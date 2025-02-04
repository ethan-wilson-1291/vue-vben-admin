<script lang="ts" setup>
import { useUserStore } from '@vben/stores';

import { Card, InputNumber } from 'ant-design-vue';

defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const userStore = useUserStore();

const handleChange = (e: any) => {
  emit('update:modelValue', e);
};
</script>

<template>
  <Card title="Handling Fees">
    <p>
      A handling fee is a charge added to an order total to cover the costs of
      processing, packaging, and shipping. Handling fees are used by online
      retailers and businesses to help offset the costs of fulfilling customer
      orders.
    </p>

    <div class="mt-5 flex justify-between">
      <div class="font-semibold">Default handling fees for one product</div>

      <InputNumber
        :addon-before="userStore.shop.currency"
        @change="handleChange"
        :value="modelValue"
        class="max-w-32"
      />
    </div>
  </Card>
</template>
