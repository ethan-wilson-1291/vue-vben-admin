import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import { $t } from '@vben/locales';

import { getDatePreset } from '#/shared/utils';
import { useShopStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import { customCostTypes } from './service';

const shopStore = useShopStore();

export const formOptions: VbenFormProps = {
  fieldMappingTime: [['date', ['from', 'to'], 'YYYY-MM-DDTHH:mm:ssZ']],
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.settings-custom-costs.filter.name'),
      componentProps: {
        placeholder: $t('page.settings-custom-costs.filter.searchByCostName'),
        disabled: shopStore.isFreeSubscription,
      },
    },
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'last3Months',
            'lastYear',
            'thisMonth',
            'thisYear',
          ],
          true,
        ),
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'date',
      label: $t('page.settings-custom-costs.filter.date'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: customCostTypes.map((item) => ({
          ...item,
          label: $t(item.labelKey),
        })),
        placeholder: $t('page.settings-custom-costs.filter.selectCostType'),
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'type',
      label: $t('page.settings-custom-costs.filter.type'),
    },
  ],
  showCollapseButton: false,
  collapsed: true,
  submitOnChange: true,
  submitOnEnter: true,
  showDefaultActions: true,
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};
