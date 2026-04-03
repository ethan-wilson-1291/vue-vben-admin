<script lang="ts" setup>
import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { orderRecalculateCosts } from '#/api';
import { RecalculateCostsType, StateStatus } from '#/shared/constants';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useSystemStatisticStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const systemStatisticStore = useSystemStatisticStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  orderRecalculateCosts(values)
    .then(() => {
      message.success(
        $t('page.reports-order.recalculateModal.submitSuccess'),
        5,
      );
      modalApi.setData({ reload: true });
      modalApi.close();

      systemStatisticStore.setCalcOrder(StateStatus.PROCESSING);
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
    labelClass: 'w-1/4',
  },
  fieldMappingTime: [['date', ['from', 'to'], 'YYYY-MM-DDTHH:mm:ssZ']],
  schema: [
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'day',
        pickerLimitName: '1 year',
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'last2Months',
            'last3Months',
            'last6Months',
            'lastYear',
            'thisYear',
          ],
          true,
        ),
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
      fieldName: 'date',
      label: $t('page.reports-order.recalculateModal.date'),
      rules: 'required',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'costTypes',
        options: [
          {
            label: $t('page.reports-order.recalculateModal.cogsHandlingFees'),
            value: RecalculateCostsType.COGS_HANDLING_FEES,
          },
          {
            label: $t('page.reports-order.recalculateModal.shippingCost'),
            value: RecalculateCostsType.SHIPPING_COSTS,
          },
          {
            label: $t('page.reports-order.recalculateModal.transactionFees'),
            value: RecalculateCostsType.TRANSACTION_FEES,
          },
        ],
      },
      fieldName: 'costTypes',
      label: $t('page.reports-order.recalculateModal.costs'),
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
});
</script>
<template>
  <Modal
    class="w-[700px]"
    :title="$t('page.reports-order.recalculateModal.title')"
    :confirm-text="$t('page.reports-order.recalculateModal.submit')"
  >
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">{{
        $t('page.reports-order.recalculateModal.noteLabel')
      }}</span>
      {{ $t('page.reports-order.recalculateModal.note') }}
    </TypographyParagraph>
  </Modal>
</template>
