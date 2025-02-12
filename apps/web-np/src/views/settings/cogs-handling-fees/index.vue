<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';

import { markRaw } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useShopSettingStore } from '#/store';

import Select from './modules/select.vue';
import { orderTableOptions } from './table-config';

const shopSettingStore = useShopSettingStore();

const formOptions: VbenFormProps = {
  schema: [
    {
      component: markRaw(Select),
      defaultValue: shopSettingStore.defaulRegion.uuid,
      fieldName: 'zoneUUID',
      label: 'Zone',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: [
          {
            value: 'ACTIVE',
            label: 'Active',
          },
          {
            value: 'DRAFT',
            label: 'Draft',
          },
          {
            value: 'ARCHIVE',
            label: 'Archive',
          },
        ],
      },
      fieldName: 'status',
      label: 'Status',
    },
    {
      component: 'Checkbox',
      fieldName: 'onlyZeroCOGS',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Only show zero COGS'],
        };
      },
    },
  ],
  collapsed: true,
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: true,
  showDefaultActions: true,
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions: orderTableOptions, formOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="COGS & Handling Fees Settings" />
  </Page>
</template>
