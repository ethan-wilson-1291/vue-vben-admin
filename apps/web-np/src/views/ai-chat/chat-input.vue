<script lang="ts" setup>
import { ref } from 'vue';

import { $t } from '@vben/locales';

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
      <textarea
        v-model="inputText"
        class="min-h-[40px] max-h-[120px] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        rows="1"
        :placeholder="$t('page.aiChat.inputPlaceholder')"
        @keydown.enter.exact.prevent="handleSend"
      ></textarea>
      <button
        :disabled="!inputText.trim()"
        class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        @click="handleSend"
      >
        <ArrowUpToLine class="size-4" />
      </button>
    </div>
  </div>
</template>
