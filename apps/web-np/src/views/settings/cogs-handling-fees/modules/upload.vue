<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message, Upload } from 'ant-design-vue';

import { $t } from '#/locales';

const selectedFile = defineModel();

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isCSV = file.type === 'text/csv';
  if (!isCSV) {
    message.error($t('page.settings-cogs.message.fileNotCsv', [file.name]));
    return false;
  }

  selectedFile.value = file;
  return false;
};

const handleRemove: UploadProps['onRemove'] = () => {
  selectedFile.value = null;
};
</script>
<template>
  <div>
    <Upload
      accept=".csv"
      :max-count="1"
      :before-upload="beforeUpload"
      @remove="handleRemove"
    >
      <VbenButton variant="outline">
        <IconifyIcon icon="ant-design:upload-outlined" class="mr-2 size-5" />
        {{ $t('page.settings-cogs.action.chooseCsv') }}
      </VbenButton>
    </Upload>
  </div>
</template>
