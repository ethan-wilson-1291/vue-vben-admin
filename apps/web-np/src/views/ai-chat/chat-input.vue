<script lang="ts" setup>
import { ref } from 'vue';

import { VbenIconButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Textarea } from '@vben-core/shadcn-ui';

import { ArrowUpToLine } from '#/icons';

const emit = defineEmits<{
  send: [text: string];
}>();

const inputText = ref('');

function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;
  emit('send', text);
  inputText.value = '';
}
</script>

<template>
  <div class="border-t p-3">
    <div class="flex items-end gap-2">
      <Textarea
        v-model="inputText"
        class="min-h-[40px] max-h-[120px] flex-1 resize-none text-sm"
        :placeholder="$t('page.common.aiChat.inputPlaceholder')"
        rows="1"
        @keydown.enter.exact.prevent="handleSend"
      />
      <VbenIconButton
        :disabled="!inputText.trim()"
        class="size-9 shrink-0"
        variant="default"
        @click="handleSend"
      >
        <ArrowUpToLine class="size-4" />
      </VbenIconButton>
    </div>
  </div>
</template>
