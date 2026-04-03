<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { IRegion } from '#/store';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { Modal, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  countries,
  defaultRegionUUID,
  ShippingCostLevel,
} from '#/shared/constants';
import { formatMoney } from '#/shared/utils';
import { useShopSettingStore, useShopStore } from '#/store';
import UpgradeBtn from '#/views/shared-components/upgrade-btn.vue';

import FormModalRecalculate from './form-modal-recalculate.vue';
import FormModal from './form-modal.vue';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const [RecalculateFormContentModal, recalculateFormModalApi] = useVbenModal({
  connectedComponent: FormModalRecalculate,
});

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModal,
  onClosed: () => {
    const { reload } = formContentModalApi.getData();
    if (reload === true) {
      gridApi.setGridOptions({ data: shopSettingStore.regions });
    }
  },
});

const openFormModal = (row: IRegion | null = null) => {
  formContentModalApi.setData(row).open();
};

const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-semibold',
      title: $t('page.settings-shipping-fees.table.name'),
      minWidth: 200,
    },
    {
      field: 'shippingCostLevel',
      title: $t('page.settings-shipping-fees.table.shippingCostBy'),
      titlePrefix: {
        content: $t('page.settings-shipping-fees.table.shippingCostByExplain'),
      },
      slots: { default: 'shippingCostLevel' },
      width: 180,
    },
    {
      field: 'shippingCostPrice',
      title: $t('page.settings-shipping-fees.table.shippingCost'),
      slots: { default: 'shippingCostPrice' },
      width: 150,
      align: 'left',
    },
    {
      field: 'countries',
      title: $t('page.settings-shipping-fees.table.countries'),
      slots: { default: 'countries' },
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: $t('page.settings-shipping-fees.table.action'),
      fixed: 'right',
      align: 'right',
      width: 100,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  data: shopSettingStore.regions,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as any,
});

const handleDelete = (row: IRegion) => {
  Modal.confirm({
    title: $t('page.settings-shipping-fees.deleteModal.title'),
    content: $t('page.settings-shipping-fees.deleteModal.content'),
    okType: 'danger',
    okText: $t('page.common.confirm'),
    cancelText: $t('page.common.cancel'),
    onOk: async () => {
      await shopSettingStore.removeRegion(row.uuid).then(() => {
        gridApi.setGridOptions({ data: shopSettingStore.regions });
      });
    },
  });
};

const getCountries = (row: IRegion) => {
  const items: any[] = [];
  countries.forEach((element) => {
    row.countries.forEach((rEl) => {
      if (element.value === rEl) {
        items.push(element);
        return true; // break loop
      }
    });
  });

  return items;
};
</script>

<template>
  <Page auto-content-height>
    <RecalculateFormContentModal />
    <FormContentModal />

    <Grid :table-title="$t('page.settings-shipping-fees.tableTitle')">
      <template #toolbar-tools>
        <UpgradeBtn class="mr-2 w-[150px]" />

        <VbenButton
          type="primary"
          class="mr-2"
          size="sm"
          @click="recalculateFormModalApi.open()"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:calculator-twotone"
          />
          {{ $t('page.settings-shipping-fees.action.recalculateCosts') }}
        </VbenButton>
        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="openFormModal()"
          :disabled="shopStore.isFreeSubscription"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:plus-circle-outlined"
          />
          {{ $t('page.settings-shipping-fees.action.addZone') }}
        </VbenButton>
      </template>
      <template #shippingCostLevel="{ row }: { row: IRegion }">
        {{
          row.shippingCostLevel === ShippingCostLevel.WEIGHT
            ? $t('page.settings-shipping-fees.level.weight')
            : row.shippingCostLevel === ShippingCostLevel.QUANTITY
              ? $t('page.settings-shipping-fees.level.quantity')
              : $t('page.settings-shipping-fees.level.order')
        }}
      </template>
      <template #shippingCostPrice="{ row }: { row: IRegion }">
        {{ formatMoney(row.shippingCostPrice, shopStore.shop.currency) }} /
        {{
          row.shippingCostLevel === ShippingCostLevel.WEIGHT
            ? $t('page.settings-shipping-fees.unit.kg')
            : row.shippingCostLevel === ShippingCostLevel.QUANTITY
              ? $t('page.settings-shipping-fees.unit.items')
              : $t('page.settings-shipping-fees.unit.order')
        }}
      </template>
      <template #countries="{ row }: { row: IRegion }">
        <div v-if="row.uuid === defaultRegionUUID">
          {{ $t('page.settings-shipping-fees.table.allCountries') }}
        </div>
        <template v-else>
          <template v-for="country in getCountries(row)" :key="country">
            <Tag>
              {{ country.label }}&nbsp;&nbsp;
              <span role="img" :aria-label="country.label">
                {{ country.icon }}
              </span>
            </Tag>
          </template>
        </template>
      </template>
      <template #action="{ row }: { row: IRegion }">
        <VbenButton
          variant="outline"
          size="icon"
          class="mr-2 size-7"
          v-if="row.uuid !== 'default'"
          @click="handleDelete(row)"
        >
          <IconifyIcon
            class="size-4 text-red-500"
            icon="ant-design:delete-twotone"
          />
        </VbenButton>
        <VbenButton variant="outline" size="icon" class="size-7">
          <IconifyIcon
            class="size-4 text-primary-500"
            icon="ant-design:edit-twotone"
            @click="openFormModal(row)"
          />
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
