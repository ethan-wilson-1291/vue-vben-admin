<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Page, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Dropdown, Menu, MenuItem, message, Modal, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { shopGenerateToken, shopResetOnboarding, shopUpgradePlan } from '#/api';

import { orderTableOptions } from './table-config';
import { formOptions } from './table-filter';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: orderTableOptions,
  formOptions,
});

const route = useRouter();

const handleEditTheme = (row: any) => {
  route.push({
    name: 'shops-theme',
    query: { shopName: row.name },
    params: {
      id: row.id,
      themeId: row.themeId,
    },
  });
};

const handleLogin = async (row: any) => {
  gridApi.setLoading(true);

  const { accessToken } = await shopGenerateToken(row.id);
  const url = `${import.meta.env.VITE_APP_FE_URL}/auth/token?token=${accessToken}`;

  gridApi.setLoading(false);
  window.open(url, '_blank');
};

const handleExportReviews = (row: any) => {
  const url = `${import.meta.env.VITE_GLOB_API_URL}/admin/shop/${row.id}/export-reviews`;
  window.open(url, '_blank');
};

const handleResetOnboarding = (row: any) => {
  Modal.confirm({
    title: `Reset Onboarding for ${row.name}`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      gridApi.setLoading(true);

      shopResetOnboarding(row.id).finally(() => {
        gridApi.setLoading(false);

        message.success('Reset onboarding successfully');
      });
    },
  });
};

const handleUpgradePlan = (row: any) => {
  Modal.confirm({
    title: `Upgrade to Free Pro Plan for ${row.name}`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => {
      gridApi.setLoading(true);

      shopUpgradePlan(row.id, true).finally(() => {
        gridApi.query().finally(() => {
          gridApi.setLoading(false);
          message.success('Upgraded to Free Pro Plan successfully.');
        });
      });
    },
  });
};

const handleDowngradePlan = (row: any) => {
  Modal.confirm({
    title: `Downgrade to Free Plan for ${row.name}`,
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => {
      gridApi.setLoading(true);

      shopUpgradePlan(row.id, false).finally(() => {
        gridApi.query().finally(() => {
          gridApi.setLoading(false);
          message.success('Downgraded to Free Plan successfully.');
        });
      });
    },
  });
};

const redirectToQueueManagement = () => {
  const url = `${import.meta.env.VITE_GLOB_API_URL}/horizon-jobs`;
  window.open(url, '_blank');
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <VbenButton size="sm" type="primary" @click="redirectToQueueManagement">
          <IconifyIcon class="mr-2 size-4" icon="ant-design:export-outlined" />
          Queue Management
        </VbenButton>
      </template>

      <template #id="{ row }">
        <div class="flex flex-col gap-0">
          <div class="font-semibold">
            {{ row.name }}
          </div>
          <div class="!text-xs italic">
            {{ row.id }}
          </div>
        </div>
      </template>

      <template #name="{ row }">
        <div class="flex flex-col gap-0">
          <div class="font-semibold">
            {{ row.ownerName }}
          </div>
          <div class="!text-xs italic">
            {{ row.email }}
          </div>
        </div>
      </template>

      <template #domain="{ row }">
        <div class="flex flex-col items-start justify-center gap-0">
          <a
            :href="`https://${row.myshopifyDomain}`"
            target="_blank"
            class="cursor-pointer font-semibold text-blue-500"
          >
            {{ row.domain }}
          </a>
          <div class="!text-xs italic">
            {{ row.myshopifyDomain }}
          </div>
        </div>
      </template>

      <template #theme="{ row }">
        <div class="flex flex-col">
          <div class="font-semibold">
            {{ row.themeName }}
          </div>
          <div class="italic">{{ row.themeId }}</div>
        </div>
      </template>

      <template #country="{ row }">
        <div class="flex flex-col">
          <div class="font-semibold">
            {{ row.country }}
          </div>
          <div class="italic">{{ row.plan }}</div>
        </div>
      </template>

      <template #plan="{ row }">
        <div class="flex flex-col">
          <div class="font-semibold">
            {{ row.chargeName }}
          </div>
          <div class="italic">{{ row.quotaView }}</div>
        </div>
      </template>

      <template #status="{ row }">
        <Tag
          :color="row.status === 'Active' ? 'success' : 'error'"
          class="w-20 text-center"
        >
          {{ row.status }}
        </Tag>
      </template>

      <template #action="{ row }: { row: any }">
        <Dropdown>
          <VbenButton size="sm" variant="outline">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            Actions
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem @click="handleLogin(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:safety-outlined" />
                  <span>Login</span>
                </div>
              </MenuItem>
              <MenuItem
                v-if="row.status === 'Active'"
                @click="handleEditTheme(row)"
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:layout-twotone" />
                  <span>Edit theme</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleExportReviews(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:download-outlined" />
                  <span>Export reviews</span>
                </div>
              </MenuItem>
              <MenuItem @click="handleResetOnboarding(row)">
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:fire-twotone" />
                  <span>Reset onboarding</span>
                </div>
              </MenuItem>
              <MenuItem
                v-if="row.chargeName === 'Free'"
                @click="handleUpgradePlan(row)"
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:dollar-circle-twotone" />
                  <span>Upgrade plan</span>
                </div>
              </MenuItem>
              <MenuItem
                v-if="row.chargeName === 'Free Pro'"
                @click="handleDowngradePlan(row)"
              >
                <div class="flex items-center justify-start space-x-1">
                  <IconifyIcon icon="ant-design:dollar-circle-twotone" />
                  <span>Downgrade plan</span>
                </div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
  </Page>
</template>
