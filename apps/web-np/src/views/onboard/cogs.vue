<script lang="ts" setup>
import { ref } from 'vue';

import { Card, Slider } from 'ant-design-vue';

defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const marks = ref<Record<number, any>>({
  0: '0%',
  75: '75%',
  100: '100%',
});

const handleChange = (e: any) => {
  emit('update:modelValue', e);
};
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
      <div class="font-semibold">Default COGS rate for one product:</div>
      <div class="ml-5 font-bold">{{ modelValue }}%</div>
    </div>

    <Slider @change="handleChange" :value="modelValue" :marks="marks" />
  </Card>
</template>
