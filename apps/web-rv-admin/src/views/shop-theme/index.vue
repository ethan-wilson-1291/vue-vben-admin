<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button, message, Select } from 'ant-design-vue';

import {
  shopGetThemeAssetContent,
  shopGetThemeAssets,
  shopGetThemeList,
  shopUpdateThemeAssetContent,
} from '#/api';

interface ThemeFile {
  key: string;
  content: string;
}

const route = useRoute();
const router = useRouter();

// State
const states = reactive({
  loading: true,
  saving: false,
  shopName: '',
  shopId: '',
  themeId: '',
  themes: [] as any[],
  themeFiles: [] as ThemeFile[],
  themeFileContent: '',
  selectedThemeFile: '',
});

onMounted(async () => {
  states.shopId = route.params.id as string;
  states.shopName = route.query.shopName as string;
  states.themeId = route.params.themeId as string;

  shopGetThemeList(states.shopId).then((res) => {
    states.themes = res;
  });

  loadThemeAssets();
});

const loadThemeAssets = () => {
  states.loading = true;

  shopGetThemeAssets(states.shopId, states.themeId)
    .then((res) => {
      states.themeFiles = res;
    })
    .finally(() => {
      states.loading = false;
    });
};

const handleSelectedThemeChanged = (value: any) => {
  states.themeId = value;

  states.selectedThemeFile = '';
  states.themeFileContent = '';
  states.themeFiles = [];

  loadThemeAssets();
};

const handleSelectedFileChanged = (value: any) => {
  states.selectedThemeFile = value;

  states.loading = true;
  shopGetThemeAssetContent(states.shopId, states.themeId, value)
    .then((res) => {
      states.themeFileContent = res.value;
    })
    .catch(() => {
      message.error('Failed to load theme file content');
    })
    .finally(() => {
      states.loading = false;
    });
};

const handleSave = async () => {
  states.saving = true;

  shopUpdateThemeAssetContent(
    states.shopId,
    states.themeId,
    states.selectedThemeFile,
    states.themeFileContent,
  )
    .then(() => {
      message.success('Theme saved successfully');
    })
    .catch(() => {
      message.error('Failed to save theme');
    })
    .finally(() => {
      states.saving = false;
    });
};
</script>

<template>
  <Page
    title="Shop Theme Editor"
    :description="`Edit theme for Shop: ${states.shopName} (${states.shopId})`"
  >
    <template #extra>
      <Button @click="router.push('/shops')"> ← Back to Shops </Button>
    </template>

    <div
      v-loading="states.loading || states.saving"
      class="rounded-lg bg-white p-6"
    >
      <div class="flex items-center justify-between pb-2">
        <div class="flex items-center justify-center gap-4">
          <div class="!mb-0 w-[100px] !pb-0">Themes</div>
          <Select
            @change="handleSelectedThemeChanged"
            style="width: 500px"
            placeholder="Select theme"
            show-search
            v-model:value="states.themeId"
            :options="
              states.themes.map((theme) => ({
                label: `${theme.name}`,
                value: theme.id,
              }))
            "
          />
        </div>
      </div>
      <div class="flex items-center justify-between pb-2">
        <div class="flex items-center justify-center gap-4">
          <div class="!mb-0 w-[100px] !pb-0">Theme Files</div>
          <Select
            @change="handleSelectedFileChanged"
            style="width: 500px"
            placeholder="Select file to edit"
            show-search
            :options="
              states.themeFiles.map((theme) => ({
                label: `${theme.key}`,
                value: theme.key,
              }))
            "
          />
        </div>

        <div class="flex gap-2">
          <Button
            @click="handleSelectedFileChanged(states.selectedThemeFile)"
            :disabled="states.selectedThemeFile === ''"
            type="default"
          >
            Reset
          </Button>
          <Button
            @click="handleSave"
            type="primary"
            :disabled="states.selectedThemeFile === ''"
            :loading="states.saving"
          >
            Save
          </Button>
        </div>
      </div>

      <!-- Main Editor Layout -->
      <div class="">
        <div class="mb-2">File: {{ states.selectedThemeFile }}</div>

        <div class="rounded border">
          <Codemirror
            v-model="states.themeFileContent"
            :style="{ height: '600px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="[oneDark, html()]"
          />
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped></style>
