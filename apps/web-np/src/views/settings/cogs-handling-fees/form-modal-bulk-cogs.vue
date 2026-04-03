<script lang="ts" setup>
import type { IProduct } from './table-config';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { productBulkUpdateFees } from '#/api';
import { $t } from '#/locales';
import { useShopStore } from '#/store';

const state = reactive({
  zoneUUID: '' as string,
  checkedItems: [] as IProduct[],
});

const shopStore = useShopStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  if (state.checkedItems.length === 0) {
    message.error($t('page.common.selectAtLeastOneProduct'));
    modalApi.lock(false);
    return;
  }

  const payload = state.checkedItems.map((item: IProduct) => ({
    id: item.id,
    variantId: item.variantId,
    productId: item.productId,
    parentId: item.parentId,
  }));

  productBulkUpdateFees({
    ...values,
    regionId: state.zoneUUID,
    selectedItems: payload,
    type: 'COGS',
  })
    .then(() => {
      message.success($t('page.settings-cogs.message.bulkCogsUpdated'));
      modalApi.setData({ reload: true });
      modalApi.close();
    })
    .finally(() => {
      modalApi.lock(false);
    });
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/8',
  },
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'cogsFee',
      label: $t('field-name.cogs'),
      defaultValue: 1,
      componentProps: {
        addonAfter: shopStore.shop.currency,
      },
    },
  ],
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
      const { checkedItems, regionId } = modalApi.getData<any>();

      state.checkedItems = checkedItems;
      state.zoneUUID = regionId;
    }
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    :title="$t('page.settings-cogs.modal.bulkCogs.title')"
    :confirm-text="$t('page.settings-cogs.action.submit')"
  >
    <Form />

    <TypographyParagraph class="mt-5 px-5 pl-10 text-left italic">
      <span class="font-semibold">{{
        $t('page.settings-cogs.common.note')
      }}</span>
      {{ $t('page.settings-cogs.modal.bulkCogs.notePrefix') }}
      <span class="font-semibold">{{
        $t('page.settings-cogs.modal.bulkCogs.manualCogsSource')
      }}</span>
      {{ $t('page.settings-cogs.modal.bulkCogs.noteSuffix') }}
    </TypographyParagraph>
  </Modal>
</template>
