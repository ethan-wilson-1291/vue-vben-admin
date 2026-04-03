<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { shopMailReport } from '#/api';

const userStore = useUserStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  values.type = 'monthly';

  shopMailReport(values)
    .then(() => {
      message.success($t('page.settings-auto-mail.message.reportSent'));
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
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('page.settings-auto-mail.modal.common.email'),
      rules: 'required',
    },
    {
      component: 'DatePicker' as any,
      componentProps: {
        picker: 'month',
      },
      fieldName: 'duration',
      label: $t('page.settings-auto-mail.modal.monthly.month'),
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // Set value
      formApi.setValues({
        email: userStore.userInfo?.email,
      });
    }
  },
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    :title="$t('page.settings-auto-mail.modal.monthly.title')"
    :confirm-text="$t('page.settings-auto-mail.modal.common.send')"
  >
    <Form />

    <TypographyParagraph class="mt-2 px-5 italic">
      <!-- Consider - Check - Validate your email - double spam mail -->
      <span class="font-semibold">
        {{ $t('page.settings-auto-mail.modal.common.noteLabel') }}:
      </span>
      {{ $t('page.settings-auto-mail.modal.common.notePrefix') }}
      <span class="font-semibold">
        {{ $t('page.settings-auto-mail.modal.common.noteHighlight') }}
      </span>
      .
    </TypographyParagraph>
  </Modal>
</template>
