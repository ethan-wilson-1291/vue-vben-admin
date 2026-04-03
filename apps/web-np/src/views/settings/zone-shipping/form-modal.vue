<script lang="ts" setup>
import type { IRegion } from '#/store';

import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { ShippingCostLevel } from '#/shared/constants';
import { useShopSettingStore, useShopStore } from '#/store';

import Countries from './modules/countries.vue';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const shippingCostLevelOptions = [
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

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  shopSettingStore
    .setRegion(values)
    .then(() => {
      message.success($t('page.settings-cogs.message.zoneUpdated'));
    })
    .finally(() => {
      modalApi.setData({ reload: true });
      modalApi.close();
    });
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/4',
  },
  schema: [
    {
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['uuid'],
      },
      fieldName: 'uuid',
      label: 'uuid',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.settings-shipping-fees.form.name'),
      rules: 'required',
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
    },
    {
      component: 'Select' as any,
      defaultValue: ShippingCostLevel.WEIGHT,
      componentProps: {
        options: shippingCostLevelOptions,
      },
      fieldName: 'shippingCostLevel',
      label: $t('page.settings-shipping-fees.form.shippingCostBy'),
      rules: 'required',
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        prefix: shopStore.shop.currencySymbol,
        addonAfter: shopStore.shop.currency,
        min: 0,
      },
      fieldName: 'shippingCostPrice',
      label: $t('page.settings-shipping-fees.form.shippingCost'),
      rules: 'required',
    },
    {
      component: markRaw(Countries),
      defaultValue: [],
      fieldName: 'countries',
      label: $t('page.settings-shipping-fees.form.countries'),
      rules: 'required',
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<IRegion>();

      if (!values) {
        return;
      }

      formApi.setValues(values);
    }
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    :title="$t('page.settings-shipping-fees.modal.formTitle')"
    :confirm-text="$t('page.settings-cogs.action.submit')"
  >
    <Form />
    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">{{
        $t('page.settings-shipping-fees.common.example')
      }}</span>
      {{ $t('page.settings-shipping-fees.example.base') }}
      <div
        v-if="
          formApi.form.values.shippingCostLevel === ShippingCostLevel.WEIGHT
        "
        class="ml-10"
      >
        {{ $t('page.settings-shipping-fees.example.weightPrefix') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.weightRate')
        }}</span>
        {{ $t('page.settings-shipping-fees.example.weightMiddle') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.weightResult')
        }}</span>
        {{ $t('page.settings-shipping-fees.example.weightSuffix') }}
      </div>
      <div
        v-if="
          formApi.form.values.shippingCostLevel === ShippingCostLevel.QUANTITY
        "
        class="ml-10"
      >
        {{ $t('page.settings-shipping-fees.example.quantityPrefix') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.quantityRate')
        }}</span>
        {{ $t('page.settings-shipping-fees.example.quantityMiddle') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.quantityResult')
        }}</span>
        {{ $t('page.settings-shipping-fees.example.quantitySuffix') }}
      </div>
      <div
        v-if="formApi.form.values.shippingCostLevel === ShippingCostLevel.ORDER"
        class="ml-10"
      >
        {{ $t('page.settings-shipping-fees.example.orderPrefix') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.orderRate')
        }}</span>
        {{ $t('page.settings-shipping-fees.example.orderMiddle') }}
        <span class="font-semibold">{{
          $t('page.settings-shipping-fees.example.orderResult')
        }}</span>
      </div>
    </TypographyParagraph>
  </Modal>
</template>
