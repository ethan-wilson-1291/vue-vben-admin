import type { VbenFormProps } from '@vben/common-ui';

import { $t } from '@vben/locales';

export const formOptions: VbenFormProps = {
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'adName',
      label: $t('page.ad-cost-rules.filter.ad'),
      componentProps: {
        placeholder: $t('page.ad-cost-rules.filter.searchByAdName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adGroupName',
      label: $t('page.ad-cost-rules.filter.group'),
      componentProps: {
        placeholder: $t('page.ad-cost-rules.filter.searchByGroupName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adCampaignName',
      label: $t('page.ad-cost-rules.filter.campaign'),
      componentProps: {
        placeholder: $t('page.ad-cost-rules.filter.searchByCampaignName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'adAccountName',
      label: $t('page.ad-cost-rules.filter.adAccount'),
      componentProps: {
        placeholder: $t('page.ad-cost-rules.filter.searchByAdAccountName'),
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};
