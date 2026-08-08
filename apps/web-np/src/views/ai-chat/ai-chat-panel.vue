<script lang="ts" setup>
import { VbenButton, VbenIconButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@vben-core/shadcn-ui';

import { AntPlus, ArrowLeft, Bot, X } from '#/icons';
import { useAiChatStore, useShopStore } from '#/store';

import ChatBubble from './chat-bubble.vue';
import ChatEmptyState from './chat-empty-state.vue';
import ChatInput from './chat-input.vue';
import ConversationList from './conversation-list.vue';

const chatStore = useAiChatStore();
const shopStore = useShopStore();

function handleDeleteConversation(id: string) {
  chatStore.removeConversation(id);
}

function handleSelectConversation(id: string) {
  chatStore.loadConversation(id);
}

function handleNewChat() {
  chatStore.newChat();
}
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
          <!-- Chat view header: back arrow + title -->
          <template
            v-if="
              chatStore.view === 'chat' && chatStore.conversations.length > 0
            "
          >
            <div class="flex min-w-0 flex-1 items-center gap-2">
              <VbenIconButton
                class="text-muted-foreground shrink-0"
                :tooltip="$t('page.common.aiChat.backToList')"
                @click="chatStore.showConversationList()"
              >
                <ArrowLeft class="size-4" />
              </VbenIconButton>
              <h2 class="truncate text-sm font-semibold">
                {{
                  chatStore.conversationTitle || $t('page.common.aiChat.title')
                }}
              </h2>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <VbenIconButton
                class="text-muted-foreground"
                :tooltip="$t('page.common.aiChat.newChat')"
                @click="handleNewChat()"
              >
                <AntPlus class="size-4" />
              </VbenIconButton>
              <VbenIconButton
                class="text-muted-foreground"
                @click="chatStore.closePanel()"
              >
                <X class="size-4" />
              </VbenIconButton>
            </div>
          </template>

          <!-- List view / new chat header -->
          <template v-else>
            <div class="flex items-center gap-2">
              <Bot class="size-5" />
              <h2 class="text-sm font-semibold">
                {{ $t('page.common.aiChat.title') }}
              </h2>
            </div>
            <div class="flex items-center gap-1">
              <VbenIconButton
                class="text-muted-foreground"
                :tooltip="$t('page.common.aiChat.newChat')"
                @click="handleNewChat()"
              >
                <AntPlus class="size-4" />
              </VbenIconButton>
              <VbenIconButton
                class="text-muted-foreground"
                @click="chatStore.closePanel()"
              >
                <X class="size-4" />
              </VbenIconButton>
            </div>
          </template>
        </div>

        <!-- Subscription gate -->
        <div
          v-if="shopStore.isFreeSubscription"
          class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <p class="text-sm text-muted-foreground">
            {{ $t('page.common.aiChat.upgradeRequired') }}
          </p>
          <VbenButton variant="default" @click="shopStore.redirectToPricing()">
            {{ $t('page.common.aiChat.upgrade') }}
          </VbenButton>
        </div>

        <!-- Conversation list view -->
        <ConversationList
          v-else-if="chatStore.view === 'list'"
          @delete="handleDeleteConversation"
          @select="handleSelectConversation"
        />

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
