<script lang="ts" setup>
import { h, markRaw, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { importCogsHandlingFees } from '#/api';
import { $t } from '#/locales';
import { useShopSettingStore } from '#/store';

import UploadCmp from './modules/upload.vue';

const shopSettingStore = useShopSettingStore();
const state = reactive({
  zoneUUID: '',
  zoneName: '',
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  importCogsHandlingFees(values)
    .then(() => {
      message.success($t('page.settings-cogs.message.importUploaded'), 5);
    })
    .finally(() => {
      modalApi.setData({ processing: true });
      modalApi.close();
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
    labelClass: 'w-1/6',
  },
  schema: [
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => state.zoneName,
        };
      },
      fieldName: 'zoneUUID',
      label: $t('page.settings-cogs.filter.zone'),
    },
    {
      component: markRaw(UploadCmp),
      fieldName: 'csvFile',
      rules: 'required',
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
      const { zoneUUID, deleteMode } = modalApi.getData<any>();

      if (!zoneUUID) {
        return;
      }

      state.zoneUUID = zoneUUID;
      state.zoneName = shopSettingStore.getZoneName(zoneUUID);
      formApi.setValues({
        deleteMode,
        zoneUUID,
        zoneProducts: [],
      });
    }
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    :confirm-text="$t('page.settings-cogs.action.submit')"
    :title="$t('page.settings-cogs.modal.importProducts.title')"
    :close-on-click-modal="false"
  >
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">{{
        $t('page.settings-cogs.common.note')
      }}</span>
      {{ $t('page.settings-cogs.modal.importProducts.note') }}
    </TypographyParagraph>
  </Modal>
</template>
