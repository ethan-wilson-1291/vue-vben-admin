import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import { $t } from '#/locales';
import { defaultRegionUUID } from '#/shared/constants';
import { useShopStore } from '#/store';

import Select from './modules/select.vue';

const shopStore = useShopStore();

const statusList = [
  {
    value: 'ACTIVE',
    label: $t('page.settings-cogs.status.active'),
    className: 'success',
  },
  {
    value: 'DRAFT',
    label: $t('page.settings-cogs.status.draft'),
    className: 'warning',
  },
  {
    value: 'ARCHIVED',
    label: $t('page.settings-cogs.status.archived'),
    className: 'error',
  },
];

export const getStatusClass = (status: string) => {
  const item = statusList.find((item) => item.value === status);
  return item ? item.className : 'default';
};

export const formOptions: VbenFormProps = {
  schema: [
    {
      component: markRaw(Select),
      componentProps: {
        disabled: shopStore.isFreeSubscription,
      },
      defaultValue: defaultRegionUUID,
      fieldName: 'zoneUUID',
      label: $t('page.settings-cogs.filter.zone'),
    },
    {
      component: 'Input',
      fieldName: 'id',
      label: $t('page.settings-cogs.filter.id'),
      componentProps: {
        placeholder: $t('page.settings-cogs.filter.searchProductId'),
        disabled: shopStore.isFreeSubscription,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.settings-cogs.filter.name'),
      componentProps: {
        placeholder: $t('page.settings-cogs.filter.searchProductName'),
        disabled: shopStore.isFreeSubscription,
      },
    },
    {
      component: 'Select',
      defaultValue: ['ACTIVE'],
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: statusList,
        placeholder: $t('page.settings-cogs.filter.selectStatus'),
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'status',
      label: $t('page.settings-cogs.filter.status'),
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};
