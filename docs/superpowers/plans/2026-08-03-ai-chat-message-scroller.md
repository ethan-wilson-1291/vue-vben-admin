# AI Chat with Message Scroller — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an AI-powered data analyst chatbot to the web-np app — a floating action button in the bottom-right opens a slide-out chat panel with streaming AI responses, available across all pages.

**Architecture:** Install shadcn-vue message-scroller into `@vben-core/shadcn-ui`, then build app-level chat components (`AiChatButton`, `AiChatPanel`, `ChatBubble`, `ChatInput`, `ChatEmptyState`) in `apps/web-np/src/views/ai-chat/`. A new Pinia store (`useAiChatStore`) manages chat state with localStorage persistence. A new API client (`src/api/ai.ts`) calls the existing AI endpoint using the standard `requestClient`. The components mount once in `basic.vue` layout for global availability.

**Tech Stack:** Vue 3 (Composition API), Pinia (Options API store), shadcn-vue message-scroller, reka-ui primitives, Tailwind CSS, existing `requestClient` from `@vben/request`, Iconify icons, Ant Design Vue (for subscription gate modal)

## Global Constraints

- Must use Options API Pinia stores (`defineStore` with `state`/`getters`/`actions`) to match existing stores
- Must use `requestClient` from `#/api/request` for all API calls
- Must respect `shopStore.isFreeSubscription` for gating
- Must follow existing file naming: kebab-case for components, kebab-case for store files
- Must re-export API modules from `src/api/index.ts` and stores from `src/store/index.ts`
- Must use `createIconifyIcon` from `@vben/icons` for icon definitions
- Message-scroller components go in `packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/`
- App chat components go in `apps/web-np/src/views/ai-chat/`

---

### Task 1: Install shadcn-vue message-scroller

**Files:**

- Create: `packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/` (directory + component files)
- Modify: `packages/@core/ui-kit/shadcn-ui/src/ui/index.ts`

**Interfaces:**

- Produces: `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerButton` — exported from `@vben-core/shadcn-ui`
- Produces: `useMessageScroller`, `useMessageScrollerVisibility`, `useMessageScrollerScrollable` composables

- [ ] **Step 1: Run the shadcn-vue CLI in the shadcn-ui package**

```bash
cd packages/@core/ui-kit/shadcn-ui && pnpm dlx shadcn-vue@latest add message-scroller
```

- [ ] **Step 2: Verify the installed files**

Check that the following files were created under `packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/`:

- `index.ts` (barrel export)
- `MessageScrollerProvider.vue`
- `MessageScroller.vue`
- `MessageScrollerViewport.vue`
- `MessageScrollerContent.vue`
- `MessageScrollerItem.vue`
- `MessageScrollerButton.vue`
- Composables file(s) (e.g., `useMessageScroller.ts`)

```bash
ls packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/
```

- [ ] **Step 3: Add message-scroller to the UI barrel export**

Edit `packages/@core/ui-kit/shadcn-ui/src/ui/index.ts`, add the line:

```ts
export * from './message-scroller';
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm -F @vben-core/shadcn-ui run typecheck 2>&1 || true
```

If there are type errors from the new component, fix imports (ensure it uses `@vben-core/shared/utils` for `cn` and `@vben-core/icons` or `@lucide/vue` for icons as appropriate).

- [ ] **Step 5: Commit**

```bash
git add packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/ packages/@core/ui-kit/shadcn-ui/src/ui/index.ts
git commit -m "feat: add shadcn-vue message-scroller component to shadcn-ui package

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Create AI chat Pinia store

**Files:**

- Create: `apps/web-np/src/store/ai-chat.ts`
- Modify: `apps/web-np/src/store/index.ts`

**Interfaces:**

- Produces: `useAiChatStore` — Pinia store with id `'np-ai-chat'`
  - State: `messages: ChatMessage[]`, `isOpen: boolean`, `isLoading: boolean`
  - Getters: (none initially)
  - Actions: `sendMessage(text: string)`, `clearChat()`, `togglePanel()`, `closePanel()`, `openPanel()`

```ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status: 'sending' | 'streaming' | 'done' | 'error';
  errorMessage?: string;
}
```

- [ ] **Step 1: Create the store file**

Write `apps/web-np/src/store/ai-chat.ts`:

```ts
import { defineStore } from 'pinia';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status: 'sending' | 'streaming' | 'done' | 'error';
  errorMessage?: string;
}

interface AiChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'np-ai-chat-messages';

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

let nextId = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++nextId}`;
}

export const useAiChatStore = defineStore('np-ai-chat', {
  actions: {
    addMessage(role: 'user' | 'assistant', content = ''): ChatMessage {
      const msg: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now(),
        status: role === 'user' ? 'done' : 'streaming',
      };
      this.messages.push(msg);
      saveMessages(this.messages);
      return msg;
    },

    updateMessage(
      messageId: string,
      updates: Partial<
        Pick<ChatMessage, 'content' | 'status' | 'errorMessage'>
      >,
    ) {
      const msg = this.messages.find((m) => m.id === messageId);
      if (!msg) return;
      if (updates.content !== undefined) {
        msg.content = updates.content;
      }
      if (updates.status !== undefined) {
        msg.status = updates.status;
      }
      if (updates.errorMessage !== undefined) {
        msg.errorMessage = updates.errorMessage;
      }
      saveMessages(this.messages);
    },

    async sendMessage(text: string) {
      if (this.isLoading || !text.trim()) return;

      this.isLoading = true;

      // Add user message
      this.addMessage('user', text.trim());

      // Add placeholder assistant message
      const assistantMsg = this.addMessage('assistant', '');

      try {
        // Dynamic import to avoid circular dependency at store init
        const { postChatMessage } = await import('#/api/ai');

        // Collect current history for context (exclude the placeholder)
        const history = this.messages
          .filter((m) => m.id !== assistantMsg.id && m.status === 'done')
          .map((m) => ({ role: m.role, content: m.content }));

        await postChatMessage(
          text.trim(),
          history,
          // onToken callback — append each chunk
          (chunk: string) => {
            this.updateMessage(assistantMsg.id, {
              content: assistantMsg.content + chunk,
              status: 'streaming',
            });
          },
        );

        // Mark complete
        this.updateMessage(assistantMsg.id, { status: 'done' });
      } catch (err: any) {
        const errorMessage =
          err?.message || 'Something went wrong. Please try again.';
        this.updateMessage(assistantMsg.id, {
          status: 'error',
          errorMessage,
        });
      } finally {
        this.isLoading = false;
      }
    },

    retryMessage(messageId: string) {
      const idx = this.messages.findIndex((m) => m.id === messageId);
      if (idx <= 0) return; // need a user message before this

      const userMsg = this.messages[idx - 1];
      if (userMsg.role !== 'user') return;

      // Remove the failed assistant message
      this.messages.splice(idx, 1);
      saveMessages(this.messages);

      // Re-send the user message
      this.sendMessage(userMsg.content);
    },

    clearChat() {
      this.messages = [];
      saveMessages(this.messages);
    },

    togglePanel() {
      this.isOpen = !this.isOpen;
    },

    closePanel() {
      this.isOpen = false;
    },

    openPanel() {
      this.isOpen = true;
    },
  },

  state: (): AiChatState => ({
    messages: loadMessages(),
    isOpen: false,
    isLoading: false,
  }),
});
```

- [ ] **Step 2: Register the store in the barrel export**

Edit `apps/web-np/src/store/index.ts`, add:

```ts
export * from './ai-chat';
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add apps/web-np/src/store/ai-chat.ts apps/web-np/src/store/index.ts
git commit -m "feat: add AI chat Pinia store with localStorage persistence

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Create AI API client

**Files:**

- Create: `apps/web-np/src/api/ai.ts`
- Modify: `apps/web-np/src/api/index.ts`

**Interfaces:**

- Produces: `postChatMessage(message: string, history: Array<{role: string, content: string}>, onToken: (chunk: string) => void): Promise<void>`
- Consumes: `requestClient` from `#/api/request` — uses its built-in `postSSE` method which runs request interceptors (auth headers) and handles SSE parsing

**Important:** The `requestClient` from `@vben/request` has built-in SSE support via `postSSE(url, data, options)`. It runs request interceptors (so `Authorization: Bearer` and `Accept-Language` are applied automatically) but bypasses response interceptors. The `onMessage` callback receives raw SSE chunks — we must buffer and parse SSE message boundaries ourselves. See `packages/effects/request/src/request-client/modules/sse.ts`.

- [ ] **Step 1: Create the API file**

Write `apps/web-np/src/api/ai.ts`:

```ts
import { requestClient } from '#/api/request';

const AI_CHAT_ENDPOINT = '/api/ai/chat';

/**
 * Send a chat message with streaming support via the built-in SSE client.
 *
 * The RequestClient.postSSE method:
 * - Runs request interceptors (auth header, locale header applied automatically)
 * - Bypasses response interceptors (no code-envelope unwrapping for SSE)
 * - Calls onMessage with raw text chunks from the SSE stream
 *
 * SSE parsing: we buffer chunks and split on "\n\n" (SSE message boundary),
 * then extract the "data: " line content, handling "[DONE]" sentinel.
 */
export function postChatMessage(
  message: string,
  history: Array<{ role: string; content: string }> = [],
  onToken: (chunk: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let sseBuffer = '';

    requestClient
      .postSSE(
        AI_CHAT_ENDPOINT,
        { message, history },
        {
          onMessage(rawChunk: string) {
            sseBuffer += rawChunk;

            // SSE messages are separated by "\n\n"
            const parts = sseBuffer.split('\n\n');
            // The last part may be incomplete — keep it in the buffer
            sseBuffer = parts.pop() ?? '';

            for (const part of parts) {
              const lines = part.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim();
                  if (data === '[DONE]') return;
                  try {
                    const parsed = JSON.parse(data);
                    const chunk =
                      parsed?.content ?? parsed?.delta ?? parsed?.text ?? '';
                    if (chunk) onToken(chunk);
                  } catch {
                    // Plain text — treat as content
                    if (data) onToken(data);
                  }
                }
              }
            }
          },
          onEnd() {
            // Flush any remaining buffered SSE data
            if (sseBuffer.trim()) {
              const lines = sseBuffer.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim();
                  if (data === '[DONE]') break;
                  try {
                    const parsed = JSON.parse(data);
                    const chunk =
                      parsed?.content ?? parsed?.delta ?? parsed?.text ?? '';
                    if (chunk) onToken(chunk);
                  } catch {
                    if (data) onToken(data);
                  }
                }
              }
            }
            resolve();
          },
        },
      )
      .catch((err: Error) => {
        reject(err);
      });
  });
}
```

- [ ] **Step 2: Register the API module in the barrel export**

Edit `apps/web-np/src/api/index.ts`, add:

```ts
export * from './ai';
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

If `postSSE` is not on the type definitions, verify the import — `requestClient` should have `.postSSE()` available at runtime even if the types need augmentation. Cast `requestClient as any` if needed for the initial implementation and fix types separately.

- [ ] **Step 4: Commit**

```bash
git add apps/web-np/src/api/ai.ts apps/web-np/src/api/index.ts
git commit -m "feat: add AI chat API client using requestClient.postSSE

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Create chat UI sub-components

**Files:**

- Create: `apps/web-np/src/views/ai-chat/chat-bubble.vue`
- Create: `apps/web-np/src/views/ai-chat/chat-input.vue`
- Create: `apps/web-np/src/views/ai-chat/chat-empty-state.vue`

**Interfaces:**

- Consumes: `ChatMessage` type from `#/store`
- Consumes: `useAiChatStore` from `#/store`
- `ChatBubble` props: `message: ChatMessage`, emits: `retry(messageId: string)`
- `ChatInput` props: none, emits: `send(text: string)`
- `ChatEmptyState` props: none, emits: `selectQuestion(text: string)`

- [ ] **Step 1: Create `ChatBubble` component**

Write `apps/web-np/src/views/ai-chat/chat-bubble.vue`:

```vue
<script lang="ts" setup>
import type { ChatMessage } from '#/store';

import { RefreshCw } from '@vben-core/icons';

defineProps<{
  message: ChatMessage;
}>();

const emit = defineEmits<{
  retry: [messageId: string];
}>();
</script>

<template>
  <div
    :class="[
      'flex mb-4',
      message.role === 'user' ? 'justify-end' : 'justify-start',
    ]"
  >
    <!-- Assistant avatar -->
    <div
      v-if="message.role === 'assistant'"
      class="mr-2 mt-1 size-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary"
    >
      AI
    </div>

    <div
      :class="[
        'max-w-[80%] rounded-lg px-3 py-2 text-sm',
        message.role === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-foreground',
      ]"
    >
      <!-- Message content -->
      <div class="whitespace-pre-wrap break-words">
        {{ message.content }}
        <span
          v-if="message.status === 'streaming'"
          class="ml-0.5 inline-block h-4 w-1 animate-pulse bg-current"
        />
      </div>

      <!-- Error state -->
      <div
        v-if="message.status === 'error'"
        class="mt-2 flex items-center gap-2"
      >
        <span class="text-xs text-red-500">
          {{ message.errorMessage || 'Something went wrong' }}
        </span>
        <button
          class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          @click="emit('retry', message.id)"
        >
          <RefreshCw class="size-3" />
          Retry
        </button>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create `ChatInput` component**

Write `apps/web-np/src/views/ai-chat/chat-input.vue`:

```vue
<script lang="ts" setup>
import { ref } from 'vue';

import { ArrowUpToLine } from '@vben-core/icons';

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
      />
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
```

- [ ] **Step 3: Create `ChatEmptyState` component**

Write `apps/web-np/src/views/ai-chat/chat-empty-state.vue`:

```vue
<script lang="ts" setup>
import { $t } from '#/locales';

const emit = defineEmits<{
  selectQuestion: [text: string];
}>();

const suggestions = [
  $t('page.aiChat.suggestion1'),
  $t('page.aiChat.suggestion2'),
  $t('page.aiChat.suggestion3'),
];
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center p-6 text-center">
    <div class="mb-4 text-4xl">🤖</div>
    <h3 class="mb-1 text-lg font-semibold">
      {{ $t('page.aiChat.emptyTitle') }}
    </h3>
    <p class="mb-6 text-sm text-muted-foreground">
      {{ $t('page.aiChat.emptyDescription') }}
    </p>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="emit('selectQuestion', suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/web-np/src/views/ai-chat/
git commit -m "feat: add chat UI sub-components (bubble, input, empty state)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Create AiChatPanel component

**Files:**

- Create: `apps/web-np/src/views/ai-chat/ai-chat-panel.vue`

**Interfaces:**

- Consumes: `useAiChatStore` from `#/store`
- Consumes: `useShopStore` from `#/store`
- Consumes: `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerButton` from `@vben-core/shadcn-ui`
- Consumes: `ChatBubble`, `ChatInput`, `ChatEmptyState` from local `./`

- [ ] **Step 1: Create the panel component**

Write `apps/web-np/src/views/ai-chat/ai-chat-panel.vue`:

```vue
<script lang="ts" setup>
import { X } from '@vben-core/icons';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@vben-core/shadcn-ui';

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
            <h2 class="font-semibold text-sm">{{ $t('page.aiChat.title') }}</h2>
          </div>
          <button
            class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="chatStore.closePanel()"
          >
            <X class="size-4" />
          </button>
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
            <MessageScroller class="flex min-h-0 flex-1 flex-col">
              <!-- Empty state -->
              <ChatEmptyState
                v-if="chatStore.messages.length === 0"
                @select-question="chatStore.sendMessage($event)"
              />

              <!-- Messages -->
              <MessageScrollerViewport
                v-else
                class="flex-1 overflow-y-auto px-4 py-4"
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

              <MessageScrollerButton direction="end" />
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/web-np/src/views/ai-chat/ai-chat-panel.vue
git commit -m "feat: add AiChatPanel slide-out component with message scroller

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Create AiChatButton floating FAB

**Files:**

- Create: `apps/web-np/src/views/ai-chat/ai-chat-button.vue`

**Interfaces:**

- Consumes: `useAiChatStore` from `#/store`
- Produces: Floating button that toggles `chatStore.isOpen`

- [ ] **Step 1: Create the button component**

Write `apps/web-np/src/views/ai-chat/ai-chat-button.vue`:

```vue
<script lang="ts" setup>
import { computed } from 'vue';

import { MessageCircle } from '@vben-core/icons';

import { useAiChatStore } from '#/store';

const chatStore = useAiChatStore();

const buttonStyle = computed(() => ({
  bottom: '24px',
  right: '24px',
}));
</script>

<template>
  <Transition name="fade-scale">
    <button
      v-if="!chatStore.isOpen"
      :style="buttonStyle"
      class="fixed z-[999] flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-300 hover:scale-110 hover:shadow-lg"
      @click="chatStore.openPanel()"
    >
      <MessageCircle class="size-5" />
    </button>
  </Transition>
</template>
```

- [ ] **Step 2: Add the `MessageCircle` icon to the icons file**

Edit `apps/web-np/src/icons.ts`, add:

```ts
export const MessageCircle = createIconifyIcon('lucide:message-circle');
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add apps/web-np/src/views/ai-chat/ai-chat-button.vue apps/web-np/src/icons.ts
git commit -m "feat: add AiChatButton floating action button

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Integrate into layout

**Files:**

- Modify: `apps/web-np/src/layouts/basic.vue`

**Interfaces:**

- Consumes: `AiChatButton` from `#/views/ai-chat/ai-chat-button.vue`
- Consumes: `AiChatPanel` from `#/views/ai-chat/ai-chat-panel.vue`

- [ ] **Step 1: Mount components in the basic layout**

Edit `apps/web-np/src/layouts/basic.vue`:

**In the `<script>` section**, add the imports:

```ts
import AiChatButton from '#/views/ai-chat/ai-chat-button.vue';
import AiChatPanel from '#/views/ai-chat/ai-chat-panel.vue';
```

**In the `<template>` section**, add the components right before the closing `</BasicLayout>` tag:

```html
<AiChatButton /> <AiChatPanel />
```

The section around line 113-126 should become:

```html
    <template #notification>
      <ShopStatistic />
      <Notification />
      <Chat />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>

    <!-- AI Chat: floating button + slide-out panel, available on all pages -->
    <AiChatButton />
    <AiChatPanel />
  </BasicLayout>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/web-np/src/layouts/basic.vue
git commit -m "feat: integrate AI chat button and panel into root layout

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Add i18n strings

**Files:**

- Find and modify the appropriate locale file(s) under `apps/web-np/src/locales/`

**Interfaces:**

- Produces: i18n keys used by chat components:
  - `page.aiChat.title` — "AI Assistant"
  - `page.aiChat.inputPlaceholder` — "Ask a question about your store..."
  - `page.aiChat.emptyTitle` — "Ask me anything about your store"
  - `page.aiChat.emptyDescription` — "I can analyze your sales, ads, costs, and more"
  - `page.aiChat.suggestion1` — "What were my top-selling products this week?"
  - `page.aiChat.suggestion2` — "How did my ad spend change month-over-month?"
  - `page.aiChat.suggestion3` — "What's my current profit margin trend?"
  - `page.aiChat.upgradeRequired` — "AI Assistant is available on the Pro plan"
  - `page.aiChat.upgrade` — "Upgrade to Pro"

- [ ] **Step 1: Find the locale files**

```bash
ls apps/web-np/src/locales/langs/
```

- [ ] **Step 2: Add i18n keys**

Identify the English locale file (typically `en-US.json` or similar under `apps/web-np/src/locales/langs/`). Add the following block under the `page` section:

```json
"aiChat": {
  "title": "AI Assistant",
  "inputPlaceholder": "Ask a question about your store...",
  "emptyTitle": "Ask me anything about your store",
  "emptyDescription": "I can analyze your sales, ads, costs, and more",
  "suggestion1": "What were my top-selling products this week?",
  "suggestion2": "How did my ad spend change month-over-month?",
  "suggestion3": "What's my current profit margin trend?",
  "upgradeRequired": "AI Assistant is available on the Pro plan",
  "upgrade": "Upgrade to Pro"
}
```

Add the same block to any other locale files with translated values (or copy the English values as placeholders).

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -F @vben/web-np-app run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add apps/web-np/src/locales/
git commit -m "feat: add i18n strings for AI chat

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: Smoke test and final verification

**Files:** (none created/modified — verification only)

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev:np
```

- [ ] **Step 2: Manual verification checklist**

1. **FAB visible**: Floating chat button is visible in the bottom-right corner of every page
2. **Open panel**: Click the FAB → panel slides in from the right, FAB hides
3. **Close panel**: Click the X button → panel slides out, FAB reappears
4. **Empty state**: When no messages exist, the empty state with suggested questions shows
5. **Suggested question**: Click a suggested question → it sends as a message
6. **Send message**: Type a message and press Enter → user bubble appears, assistant starts streaming
7. **Panel persistence**: Close the panel mid-response, reopen → conversation still there
8. **Error state**: If the API is unreachable, error bubble with retry button shows
9. **Subscription gate**: When `isFreeSubscription` is true, panel shows upgrade prompt
10. **Page navigation**: Navigate to different pages → chat persists in store (localStorage)
11. **Responsive**: On mobile viewport (< 768px), panel is full-width
12. **z-index**: Panel sits above page content but below Ant Design modals/notifications

- [ ] **Step 3: Run existing test suites**

```bash
pnpm run test:unit
pnpm run typecheck
```

- [ ] **Step 4: If all passes, final commit**

```bash
git commit --allow-empty -m "chore: smoke test AI chat — all checks pass

Co-Authored-By: Claude <noreply@anthropic.com>"
```
