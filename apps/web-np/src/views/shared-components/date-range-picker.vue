<script lang="ts" setup>
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import { RangePicker } from 'ant-design-vue';

import { useShopStore } from '#/store';

interface Props {
  modelValue: any[];
  presets: any[];
  picker?: PickerMode;
  pickerLimit?: number;
  pickerLimitName?: null | string;
  allowClear?: boolean;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  picker: 'date',
  pickerLimit: 0,
  pickerLimitName: null,
  allowClear: true,
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const shopStore = useShopStore();

const onChange = (val: any) => {
  emit('update:modelValue', val);
};

const getLimitName = computed(() => {
  if (props.pickerLimitName) {
    return props.pickerLimitName;
  }

  return `${props.pickerLimit} ${props.picker}s`;
});
</script>

<template>
  <div>
    <RangePicker
      :picker="props.picker"
      :value="props.modelValue as any"
      :presets="props.presets"
      :allow-clear="props.allowClear"
      :disabled="props.disabled"
      @change="onChange"
    >
      <template
        #renderExtraFooter
        v-if="props.pickerLimit || props.pickerLimitName"
      >
        <div
          class="flex w-full flex-col space-y-1 py-2 text-center italic text-foreground"
        >
          <span class="leading-none">
            {{ $t('page.date-range-picker.limitHint') }}
            <strong>{{ getLimitName }}</strong>
          </span>
          <span class="text-xs">
            {{ $t('page.date-range-picker.exampleFrom') }}
            <strong>2022</strong>-01-01
            {{ $t('page.date-range-picker.exampleTo') }}
            <strong>2022</strong>-01-15
            {{ $t('page.date-range-picker.exampleValid') }}
            <span class="font-bold">({{ shopStore.shop.timezone }})</span>
          </span>
        </div>
      </template>
    </RangePicker>
  </div>
</template>
