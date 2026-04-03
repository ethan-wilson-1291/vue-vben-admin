<script setup lang="ts">
import { reactive } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { Image, message, Switch } from 'ant-design-vue';

import { useShopSettingStore } from '#/store';

import FormModalSendMonthlyReport from './form-modal-send-monthly-report.vue';
import FormModalSendWeeklyReport from './form-modal-send-weekly-report.vue';

const shopSettingStore = useShopSettingStore();
const mailTemplates = reactive([
  {
    type: 'weekly',
    titleKey: 'page.settings-auto-mail.template.weekly.title',
    descriptionKey: 'page.settings-auto-mail.template.weekly.description',
    checked: shopSettingStore.mailWeeklyReport,
    loading: false,
    showSample: false,
    sampleImage: '/static/images-sample-mail/weekly-report.png',
  },
  {
    type: 'monthly',
    titleKey: 'page.settings-auto-mail.template.monthly.title',
    descriptionKey: 'page.settings-auto-mail.template.monthly.description',
    checked: shopSettingStore.mailMonthlyReport,
    loading: false,
    showSample: false,
    sampleImage: '/static/images-sample-mail/monthly-report.png',
  },
]);

const [SendWeeklyReportModal, sendWeeklyReportModalApi] = useVbenModal({
  connectedComponent: FormModalSendWeeklyReport,
});

const [SendMonthlyReportModal, sendMonthlyReportModalApi] = useVbenModal({
  connectedComponent: FormModalSendMonthlyReport,
});

const sendTestMail = (type: string) => {
  switch (type) {
    case 'monthly': {
      sendMonthlyReportModalApi.open();
      break;
    }
    case 'weekly': {
      sendWeeklyReportModalApi.open();
      break;
    }
    default: {
      console.error(
        $t('page.settings-auto-mail.errors.unknownEmailType'),
        type,
      );
    }
  }
};

const toggleSetting = (item: any, checked: boolean) => {
  item.loading = true;

  shopSettingStore
    .toggleMailReport(checked, item.type)
    .then(() => {
      item.checked = checked;
      message.success($t('page.settings-auto-mail.message.settingUpdated'));
    })
    .finally(() => {
      item.loading = false;
    });
};
</script>

<template>
  <Page>
    <SendWeeklyReportModal />
    <SendMonthlyReportModal />
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <template v-for="item in mailTemplates" :key="item.type">
        <Card class="w-full" :title="$t(item.titleKey)">
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <div>
                <span class="text-xl">{{ $t(item.titleKey) }}</span>

                <span class="ml-2 text-sm font-normal italic text-gray-500">
                  ( {{ $t(item.descriptionKey) }} )
                </span>
              </div>
              <Switch
                @change="(checked: any) => toggleSetting(item, checked)"
                :loading="item.loading"
                :checked="item.checked"
              />
            </CardTitle>
          </CardHeader>

          <CardContent class="">
            <div class="flex items-center gap-2">
              <Image
                :style="{ display: 'none' }"
                :preview="{
                  visible: item.showSample,
                  onVisibleChange: (visible: boolean) =>
                    (item.showSample = visible),
                }"
                :src="item.sampleImage"
              />
              <VbenButton
                variant="secondary"
                class="w-full"
                @click="item.showSample = true"
              >
                <IconifyIcon
                  class="mr-2 size-5"
                  icon="ant-design:eye-twotone"
                />
                {{ $t('page.settings-auto-mail.action.viewSampleEmail') }}
              </VbenButton>

              <VbenButton
                variant="secondary"
                class="w-full"
                @click="sendTestMail(item.type)"
              >
                <IconifyIcon
                  class="mr-2 size-5"
                  icon="ant-design:play-circle-twotone"
                />
                {{ $t('page.settings-auto-mail.action.testEmail') }}
              </VbenButton>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </Page>
</template>
