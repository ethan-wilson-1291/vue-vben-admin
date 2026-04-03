import type { VbenFormProps } from '#/adapter/form';

import { markRaw } from 'vue';

import { $t } from '@vben/locales';

import { orderStatusList } from '#/shared/constants';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useShopStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const shopStore = useShopStore();

const orderStatusOptions = orderStatusList.map((item: any) => {
  return {
    ...item,
    label: item.labelKey ? $t(item.labelKey) : item.label,
  };
});

export const formOptions: VbenFormProps = {
  collapsed: false,
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
            'lastYear',
            'previousMonth',
            'thisMonth',
            'thisYear',
          ],
          true,
        ),
        disabled: shopStore.isFreeSubscription,
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
      fieldName: 'date',
      label: $t('page.reports-order.filter.date'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: orderStatusOptions,
        placeholder: $t('page.reports-order.filter.paymentStatus'),
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'financialStatus',
      label: $t('page.reports-order.filter.status'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.reports-order.filter.orderId'),
      componentProps: {
        placeholder: ' ',
        disabled: shopStore.isFreeSubscription,
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};
