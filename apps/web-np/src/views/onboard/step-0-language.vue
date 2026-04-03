<script lang="ts" setup>
import { SUPPORT_LANGUAGES } from '@vben/constants';
import { $t, loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben/preferences';

import { Card, Select } from 'ant-design-vue';

import { shopUpdateAppLocale } from '#/api';

const handleLocaleChange = async (value: string) => {
  const locale = value as any;

  await shopUpdateAppLocale({ appLocale: locale });

  updatePreferences({
    app: {
      locale,
    },
  });

  await loadLocaleMessages(locale);
};
</script>

<template>
  <Card :title="$t('page.onboard.stepLanguage.title')" class="w-full">
    <p>
      {{ $t('page.onboard.stepLanguage.description') }}
    </p>

    <Select
      class="mt-4 w-full"
      size="large"
      :value="preferences.app.locale"
      :options="SUPPORT_LANGUAGES"
      @change="handleLocaleChange"
    />
  </Card>
</template>
