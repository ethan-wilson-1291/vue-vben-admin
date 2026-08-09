<script lang="ts" setup>
import { computed } from 'vue';

import { VbenIconButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Loader2, MessageSquare, Trash2 } from '#/icons';
import { useAiChatStore } from '#/store';

const emit = defineEmits<{
  delete: [id: string];
  select: [id: string];
}>();

const chatStore = useAiChatStore();

/**
 * Format a timestamp as a relative label (Today, Yesterday, or date).
 */
function relativeTimeLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);

  if (date >= todayStart) {
    return $t('page.common.aiChat.today');
  }
  if (date >= yesterdayStart) {
    return $t('page.common.aiChat.yesterday');
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
}

const sortedConversations = computed(() => {
  return [...chatStore.conversations].toSorted((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
});
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <!-- Loading state -->
    <div
      v-if="chatStore.conversationsLoading"
      class="flex flex-1 items-center justify-center"
    >
      <Loader2 class="size-5 animate-spin text-muted-foreground" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="sortedConversations.length === 0"
      class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center"
    >
      <MessageSquare class="size-8 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">
        {{ $t('page.common.aiChat.noConversations') }}
      </p>
    </div>

    <!-- Conversation list -->
    <div v-else class="flex-1 overflow-y-auto">
      <div
        v-for="conversation in sortedConversations"
        :key="conversation.id"
        :aria-label="conversation.title ?? undefined"
        class="group flex cursor-pointer items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-accent/50"
        :class="{
          'bg-accent/30': chatStore.conversationId === conversation.id,
          'pointer-events-none opacity-60':
            chatStore.loadingConversationId === conversation.id ||
            chatStore.deletingConversationId === conversation.id,
        }"
        role="button"
        tabindex="0"
        @click="emit('select', conversation.id)"
        @keydown.enter="emit('select', conversation.id)"
        @keydown.space.prevent="emit('select', conversation.id)"
      >
        <!-- Loading spinner when this conversation is being loaded -->
        <Loader2
          v-if="chatStore.loadingConversationId === conversation.id"
          class="size-4 shrink-0 animate-spin text-muted-foreground"
        />
        <MessageSquare v-else class="size-4 shrink-0 text-muted-foreground" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">
            {{ conversation.title || $t('page.common.aiChat.newChat') }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ relativeTimeLabel(conversation.updated_at) }}
          </p>
        </div>
        <!-- Delete button: spinner while deleting, otherwise trash icon -->
        <Loader2
          v-if="chatStore.deletingConversationId === conversation.id"
          class="size-3.5 shrink-0 animate-spin text-muted-foreground"
        />
        <VbenIconButton
          v-else
          class="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          :tooltip="$t('page.common.aiChat.deleteConversation')"
          variant="ghost"
          @click.stop="emit('delete', conversation.id)"
        >
          <Trash2
            class="size-3.5 text-muted-foreground hover:text-destructive"
          />
        </VbenIconButton>
      </div>
    </div>
  </div>
</template>
