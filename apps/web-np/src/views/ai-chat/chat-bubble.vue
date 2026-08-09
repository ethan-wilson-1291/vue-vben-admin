<script lang="ts" setup>
import type { ChatMessage } from '#/store';

import { computed } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Bot, Loader2, RefreshCw } from '#/icons';
import { renderMarkdown } from '#/shared/markdown';

const props = defineProps<{
  message: ChatMessage;
}>();

const emit = defineEmits<{
  retry: [messageId: string];
}>();

const renderedContent = computed(() => {
  const html = renderMarkdown(props.message.content);
  if (props.message.status === 'streaming') {
    return `${html}<span class="ml-0.5 inline-block h-4 w-1 animate-pulse bg-current align-middle"></span>`;
  }
  return html;
});

function getToolLabel(toolCallStatus: string): string {
  const knownLabels: Record<string, string> = {
    get_p_and_l_report: $t('page.common.aiChat.analyzingFinancialData'),
  };
  return (
    knownLabels[toolCallStatus] ||
    $t('page.common.aiChat.toolRunning', { tool: toolCallStatus })
  );
}
</script>

<template>
  <div
    class="mb-4 flex"
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
  >
    <!-- Assistant avatar -->
    <Bot
      v-if="message.role === 'assistant'"
      class="mr-2 mt-1 size-6 shrink-0 rounded-full bg-primary/10 p-1 text-primary"
    />

    <div
      class="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted text-foreground"
    >
      <!-- Tool call status indicator -->
      <div
        v-if="message.toolCallStatus && message.status === 'thinking'"
        class="mb-2 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Loader2 class="size-3 animate-spin" />
        <span>{{ getToolLabel(message.toolCallStatus) }}</span>
      </div>

      <!-- Message content -->
      <div
        class="prose prose-sm max-w-none break-words dark:prose-invert"
        v-html="renderedContent"
      ></div>

      <!-- Thinking indicator (before first token) -->
      <div
        v-if="message.status === 'thinking' && !message.content"
        class="flex items-center gap-2 text-muted-foreground"
      >
        <Loader2 class="size-3 animate-spin" />
        <span>{{ $t('page.common.aiChat.thinking') }}</span>
      </div>

      <!-- Error state -->
      <div
        v-if="message.status === 'error'"
        class="mt-2 flex items-center gap-2"
      >
        <span class="text-xs text-destructive">
          {{ message.errorMessage || $t('page.common.aiChat.errorDefault') }}
        </span>
        <VbenButton
          class="gap-1"
          size="sm"
          variant="ghost"
          @click="emit('retry', message.id)"
        >
          <RefreshCw class="size-3" />
          {{ $t('page.common.aiChat.retry') }}
        </VbenButton>
      </div>
    </div>
  </div>
</template>
