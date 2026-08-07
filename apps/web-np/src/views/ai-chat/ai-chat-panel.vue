<script lang="ts" setup>
import { $t } from '@vben/locales';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@vben-core/shadcn-ui';

import { AntPlus, X } from '#/icons';
import { useAiChatStore, useShopStore } from '#/store';

import ChatBubble from './chat-bubble.vue';
import ChatEmptyState from './chat-empty-state.vue';
import ChatInput from './chat-input.vue';

const chatStore = useAiChatStore();
const shopStore = useShopStore();
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div
        v-if="chatStore.isOpen"
        class="fixed bottom-0 right-0 top-16 z-[1000] flex w-full flex-col border-l bg-background shadow-2xl md:w-[420px]"
      >
        <!-- Header -->
        <div
          class="flex shrink-0 items-center justify-between border-b px-4 py-3"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg">🤖</span>
            <h2 class="text-sm font-semibold">
              {{ $t('page.aiChat.title') }}
            </h2>
          </div>
          <div class="flex items-center gap-1">
            <button
              class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              :title="$t('page.aiChat.newChat')"
              @click="chatStore.clearChat()"
            >
              <AntPlus class="size-4" />
            </button>
            <button
              class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="chatStore.closePanel()"
            >
              <X class="size-4" />
            </button>
          </div>
        </div>

        <!-- Subscription gate -->
        <div
          v-if="shopStore.isFreeSubscription"
          class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <p class="text-sm text-muted-foreground">
            {{ $t('page.aiChat.upgradeRequired') }}
          </p>
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            @click="shopStore.redirectToPricing()"
          >
            {{ $t('page.aiChat.upgrade') }}
          </button>
        </div>

        <!-- Chat body -->
        <template v-else>
          <MessageScrollerProvider
            auto-scroll
            default-scroll-position="last-anchor"
            :scroll-previous-item-peek="64"
          >
            <MessageScroller class="relative flex min-h-0 flex-1 flex-col">
              <!-- Empty state -->
              <ChatEmptyState
                v-if="chatStore.messages.length === 0"
                @select-question="chatStore.sendMessage($event)"
              />

              <!-- Messages -->
              <MessageScrollerViewport
                v-else
                class="flex-1 overflow-y-auto px-4 py-4"
                preserve-scroll-on-prepend
              >
                <MessageScrollerContent>
                  <MessageScrollerItem
                    v-for="message in chatStore.messages"
                    :key="message.id"
                    :message-id="message.id"
                    :scroll-anchor="message.role === 'user'"
                  >
                    <ChatBubble
                      :message="message"
                      @retry="chatStore.retryMessage($event)"
                    />
                  </MessageScrollerItem>
                </MessageScrollerContent>
              </MessageScrollerViewport>

              <MessageScrollerButton
                direction="end"
                class="absolute bottom-4 right-4"
              />
            </MessageScroller>
          </MessageScrollerProvider>

          <!-- Input -->
          <ChatInput @send="chatStore.sendMessage($event)" />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
