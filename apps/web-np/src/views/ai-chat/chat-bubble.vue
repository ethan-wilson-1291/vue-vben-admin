<script lang="ts" setup>
import type { ChatMessage } from '#/store';

import { VbenButton } from '@vben/common-ui';

import { Loader2, RefreshCw } from '#/icons';

defineProps<{
  message: ChatMessage;
}>();

const emit = defineEmits<{
  retry: [messageId: string];
}>();

const TOOL_LABELS: Record<string, string> = {
  get_p_and_l_report: 'Analyzing financial data...',
};
</script>

<template>
  <div
    class="mb-4 flex"
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
  >
    <!-- Assistant avatar -->
    <div
      v-if="message.role === 'assistant'"
      class="mr-2 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary"
    >
      AI
    </div>

    <div
      class="max-w-[80%] rounded-lg px-3 py-2 text-sm"
      :class="[
        message.role === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-foreground',
      ]"
    >
      <!-- Tool call status indicator -->
      <div
        v-if="message.toolCallStatus"
        class="mb-2 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Loader2 class="size-3 animate-spin" />
        <span>{{
          TOOL_LABELS[message.toolCallStatus] ||
          `Running ${message.toolCallStatus}...`
        }}</span>
      </div>

      <!-- Message content -->
      <div class="whitespace-pre-wrap break-words">
        {{ message.content }}
        <span
          v-if="message.status === 'streaming'"
          class="ml-0.5 inline-block h-4 w-1 animate-pulse bg-current"
        ></span>
      </div>

      <!-- Thinking indicator (before first token) -->
      <div
        v-if="message.status === 'thinking' && !message.content"
        class="flex items-center gap-2 text-muted-foreground"
      >
        <Loader2 class="size-3 animate-spin" />
        <span>Thinking...</span>
      </div>

      <!-- Error state -->
      <div
        v-if="message.status === 'error'"
        class="mt-2 flex items-center gap-2"
      >
        <span class="text-xs text-destructive">
          {{ message.errorMessage || 'Something went wrong' }}
        </span>
        <VbenButton
          class="gap-1"
          size="sm"
          variant="ghost"
          @click="emit('retry', message.id)"
        >
          <RefreshCw class="size-3" />
          Retry
        </VbenButton>
      </div>
    </div>
  </div>
</template>
