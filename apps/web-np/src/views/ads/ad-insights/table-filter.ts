import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import { $t } from '@vben/locales';

import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

export const formOptions: VbenFormProps = {
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  fieldMappingTime: [['date', ['fromDate', 'toDate'], 'YYYY-MM-DDTHH:mm:ssZ']],
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
            'previousMonth',
            'thisMonth',
          ],
          true,
        ),
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
      fieldName: 'date',
      label: $t('page.ad-cost-insights.filter.date'),
    },
    {
      component: 'Input',
      fieldName: 'adName',
      label: $t('page.ad-cost-insights.filter.ad'),
      componentProps: {
        placeholder: $t('page.ad-cost-insights.filter.searchByAdName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adGroupName',
      label: $t('page.ad-cost-insights.filter.group'),
      componentProps: {
        placeholder: $t('page.ad-cost-insights.filter.searchByGroupName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adCampaignName',
      label: $t('page.ad-cost-insights.filter.campaign'),
      componentProps: {
        placeholder: $t('page.ad-cost-insights.filter.searchByCampaignName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adAccountName',
      label: $t('page.ad-cost-insights.filter.adAccount'),
      componentProps: {
        placeholder: $t('page.ad-cost-insights.filter.searchByAdAccountName'),
      },
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};
