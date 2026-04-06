<script lang="ts" setup>
import type { INotification } from '#/store';

import { onMounted } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { capitalizeFirstLetter } from '@vben/utils';

import { Dropdown, Menu, MenuItem, Modal, Switch, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  adAttachToCosts,
  deleteAccount,
  syncAccount,
  syncAdInsight,
} from '#/api';
import { StateStatus } from '#/shared/constants';
import {
  formatReportDate,
  getAdsIcon,
  redirectToExternal,
} from '#/shared/utils';
import { useShopStore } from '#/store';
import UpgradeBtn from '#/views/shared-components/upgrade-btn.vue';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions as any,
  formOptions: formOptions as any,
});

onMounted(() => {
  shopStore.pusherChannel.bind(
    shopStore.pusherEventName,
    (payload: INotification) => {
      switch (payload.type) {
        case 'SyncAccountNotification': {
          gridApi.query();
          break;
        }

        default: {
          break;
        }
      }
    },
  );
});

const addNewConnection = (type: string) => {
  const metaEnv = (import.meta as any).env;
  const { apiURL } = useAppConfig(metaEnv, metaEnv.PROD);
  const url = `${apiURL}/auth-social/generate?type=${type}&shopId=${shopStore.shop.id}`;

  redirectToExternal(url);
};

const statusList = [
  // Sync Status
  {
    value: 'pending',
    label: $t('page.ad-connections.status.syncPending'),
    className: 'warning',
  },
  {
    value: 'processing',
    label: $t('page.ad-connections.status.syncing'),
    className: 'warning',
  },
  {
    value: 'processed',
    label: $t('page.ad-connections.status.synced'),
    className: 'success',
  },
  {
    value: 'failed',
    label: $t('page.ad-connections.status.syncFailed'),
    className: 'error',
  },

  // Account - Status
  {
    value: 'connected',
    label: $t('page.ad-connections.status.connected'),
    className: 'success',
  },
  {
    value: 'disconnected',
    label: $t('page.ad-connections.status.disconnected'),
    className: 'error',
  },

  // Ad Account - Status
  {
    value: 'active',
    label: $t('page.ad-connections.status.active'),
    className: 'success',
  },
  {
    value: 'inactive',
    label: $t('page.ad-connections.status.inactive'),
    className: 'error',
  },
];

const getStatusClass = (val: string) => {
  const item = statusList.find((item) => item.value === val);
  return item ? item.className : 'default';
};

const getStatusLabel = (val: string) => {
  const item = statusList.find((item) => item.value === val);
  return item ? item.label : '';
};

const handleDelete = (row: any) => {
  Modal.confirm({
    title: $t('page.ad-connections.modal.removeConnection.title'),
    content: $t('page.ad-connections.modal.removeConnection.content'),
    okType: 'danger',
    okText: $t('page.common.confirm'),
    cancelText: $t('page.common.cancel'),
    onOk: async () => {
      await deleteAccount(row.id).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleManualSync = (row: any) => {
  Modal.confirm({
    title: $t('page.ad-connections.modal.syncAccountInformation.title'),
    content: $t('page.ad-connections.modal.syncAccountInformation.content'),
    okText: $t('page.ad-connections.action.sync'),
    onOk: async () => {
      await syncAccount(row.id).then(() => {
        gridApi.query();
      });
    },
  });
};

const handleManualSyncAdInsight = (row: any) => {
  Modal.confirm({
    title: $t('page.ad-connections.modal.syncAdInsights.title'),
    content: $t('page.ad-connections.modal.syncAdInsights.content', {
      name: row.name,
    }),
    okText: $t('page.ad-connections.action.sync'),
    onOk: async () => {
      await syncAdInsight(row.parentId, row.id).then(() => {
        gridApi.query().then(() => {
          const _accountRow = gridApi.grid
            .getData()
            .find((c: any) => c.id === row.parentId);

          if (!_accountRow) {
            return;
          }

          gridApi.grid.setTreeExpand([_accountRow], true);
        });
      });
    },
  });
};

const handleSwitchCosts = (adAccount: any, checked: any) => {
  adAccount.loading = true;

  Modal.confirm({
    title: checked
      ? $t('page.ad-connections.modal.attachToCostTracking.title')
      : $t('page.ad-connections.modal.detachFromCostTracking.title'),
    content: $t('page.ad-connections.modal.switchCostTracking.content', {
      name: adAccount.name,
    }),
    onOk: async () => {
      adAttachToCosts(
        'ad_account_id',
        adAccount.parentId.split('-')[0],
        adAccount.parentId.split('-')[1],
        adAccount.id,
        checked,
      ).finally(() => {
        gridApi.reload();
      });
    },
    onCancel: () => {
      adAccount.loading = false;
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />

    <Grid>
      <template #toolbar-tools>
        <UpgradeBtn class="mr-2 w-[150px]" />

        <Dropdown :disabled="shopStore.isFreeSubscription">
          <VbenButton size="sm" type="primary">
            <IconifyIcon
              class="mr-2 size-4"
              icon="ant-design:plus-circle-outlined"
            />
            {{ $t('page.ad-connections.action.addAdConnection') }}
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem @click="addNewConnection('facebook')">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon :icon="getAdsIcon('facebook')" />
                  <span>{{ $t('page.ad-connections.channel.facebook') }}</span>
                </div>
              </MenuItem>
              <MenuItem @click="addNewConnection('tiktok')">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon :icon="getAdsIcon('tiktok')" />
                  <span>{{ $t('page.ad-connections.channel.tiktok') }}</span>
                </div>
              </MenuItem>
              <MenuItem @click="addNewConnection('google')">
                <div class="flex items-center justify-start space-x-2">
                  <IconifyIcon :icon="getAdsIcon('google')" />
                  <span>{{ $t('page.ad-connections.channel.google') }}</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>

      <template #type="{ row }: { row: any }">
        <div
          v-if="row.parentId === undefined"
          class="my-1 flex items-center justify-start space-x-2"
        >
          <!-- Avatar and Title - Only show for parent level -->
          <div class="h-[35px] w-[35px] flex-none">
            <IconifyIcon class="size-[35px]" :icon="getAdsIcon(row.type)" />
          </div>
          <div class="ml-1 shrink">
            <div class="font-semibold">
              {{ row.name }}
            </div>
            <div class="text-xs italic text-muted-foreground">
              {{ row.email }}
            </div>
          </div>
        </div>
        <div v-else class="pl-10">
          {{ row.name }}
        </div>
      </template>

      <template #status="{ row }: { row: any }">
        <Tag :color="getStatusClass(row.status)" class="w-[100px] text-center">
          {{ getStatusLabel(row.status) || capitalizeFirstLetter(row.status) }}
        </Tag>
      </template>

      <template #nextSyncedAt="{ row }: { row: any }">
        <!-- Show Account status -->
        <template
          v-if="
            !row.parentId && row.status !== 'disconnected' && row.nextSyncedAt
          "
        >
          <template v-if="row.syncStatus === StateStatus.PROCESSED">
            {{ formatReportDate(row.nextSyncedAt) }}
          </template>
          <Tag
            v-else
            :color="getStatusClass(row.syncStatus)"
            class="w-[100px] text-center"
          >
            {{ getStatusLabel(row.syncStatus) }}
          </Tag>
        </template>

        <!-- Show Ad Account status -->
        <template v-if="row.parentId && row.syncStatus">
          <Tag
            :color="getStatusClass(row.syncStatus)"
            class="w-[100px] text-center"
          >
            {{ getStatusLabel(row.syncStatus) }}
          </Tag>
        </template>
      </template>

      <template #addToCosts="{ row }: { row: any }">
        <template v-if="row.parentId === undefined">
          <VbenButton
            class="!p-0 text-xs"
            @click="gridApi.grid.toggleTreeExpand(row)"
            :disabled="row.loading"
            variant="link"
          >
            {{ $t('page.ad-connections.action.viewDetail') }}
          </VbenButton>
        </template>
        <template v-else>
          <Switch
            @change="
              (checked) => {
                handleSwitchCosts(row, checked);
              }
            "
            :loading="row.loading"
            :checked="!row.detachFromCosts?.includes(shopStore.shop.id)"
          />
        </template>
      </template>

      <template #action="{ row }: { row: any }">
        <Dropdown v-if="row.parentId === undefined">
          <VbenButton size="sm" variant="outline">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            {{ $t('page.ad-connections.action.actions') }}
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem
                @click="handleManualSync(row)"
                :disabled="
                  row.status !== 'connected' ||
                  row.syncStatus !== StateStatus.PROCESSED
                "
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:sync-outlined" />
                  <span>
                    {{ $t('page.ad-connections.action.syncAdAccounts') }}
                  </span>
                </div>
              </MenuItem>
              <MenuItem @click="addNewConnection(row.type)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:link-outlined" />
                  <span>{{ $t('page.ad-connections.action.reconnect') }}</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleDelete(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:delete-twotone" />
                  <span>{{ $t('page.ad-connections.action.remove') }}</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>

        <VbenButton
          v-if="row.parentId !== undefined"
          size="sm"
          variant="outline"
          :disabled="
            row.syncStatus === StateStatus.PROCESSING ||
            row.syncStatus === StateStatus.PENDING ||
            row.status === 'disconnected'
          "
          @click="handleManualSyncAdInsight(row)"
        >
          <IconifyIcon icon="ant-design:sync-outlined" class="mr-2" />
          <span>{{ $t('page.ad-connections.action.syncInsights') }}</span>
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
