import type { Conversation } from '#/api/ai';

import { defineStore } from 'pinia';

import {
  deleteConversation,
  fetchConversation,
  fetchConversations,
} from '#/api/ai';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  status: 'done' | 'error' | 'sending' | 'streaming' | 'thinking';
  errorMessage?: string;
  /** Name of the tool currently being called, e.g. "get_p_and_l_report" */
  toolCallStatus?: string;
}

interface AiChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  /** Current conversation ID from the BE. null = new conversation. */
  conversationId: null | string;
  /** Current conversation title (shown in header). */
  conversationTitle: string;
  /** List of past conversations. */
  conversations: Conversation[];
  /** Whether the conversation list is loading. */
  conversationsLoading: boolean;
  /** Which view is currently shown. */
  view: 'chat' | 'list';
  /** ID of the conversation currently being loaded. */
  loadingConversationId: null | string;
  /** ID of the conversation currently being deleted. */
  deletingConversationId: null | string;
}

const STORAGE_KEY = 'np-ai-chat-messages';
const CONVERSATION_KEY = 'np-ai-chat-conversation';

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

function loadConversationId(): null | string {
  try {
    return localStorage.getItem(CONVERSATION_KEY);
  } catch {
    return null;
  }
}

function saveConversationId(id: null | string): void {
  try {
    if (id) {
      localStorage.setItem(CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(CONVERSATION_KEY);
    }
  } catch {
    // silently ignore
  }
}

let nextId = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++nextId}`;
}

export const useAiChatStore = defineStore('np-ai-chat', {
  actions: {
    addMessage(role: 'assistant' | 'user', content = ''): ChatMessage {
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
        Pick<
          ChatMessage,
          'content' | 'errorMessage' | 'status' | 'toolCallStatus'
        >
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
      if (updates.toolCallStatus !== undefined) {
        msg.toolCallStatus = updates.toolCallStatus;
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
        const { postChatMessage } = await import('#/api/ai');

        const result = await postChatMessage(
          text.trim(),
          this.conversationId,
          // onToken — append each chunk
          (chunk: string) => {
            this.updateMessage(assistantMsg.id, {
              content: (assistantMsg.content + chunk) as string,
              status: 'streaming',
            });
          },
          // onToolCall — show tool name while running
          (name: string) => {
            this.updateMessage(assistantMsg.id, {
              status: 'thinking',
              toolCallStatus: name,
            });
          },
          // onToolResult — tool done, back to streaming for next text
          () => {
            this.updateMessage(assistantMsg.id, {
              status: 'streaming',
              toolCallStatus: undefined,
            });
          },
        );

        // Store conversation ID for multi-turn
        if (result.conversationId) {
          this.conversationId = result.conversationId;
          this.conversationTitle = result.title || this.conversationTitle;
          saveConversationId(result.conversationId);
        }

        // Mark complete
        this.updateMessage(assistantMsg.id, { status: 'done' });

        // Refresh the conversation list to include the new/updated conversation
        this.fetchConversations();
      } catch (error: any) {
        const errorMessage =
          error?.message || 'Something went wrong. Please try again.';
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
      if (!userMsg || userMsg.role !== 'user') return;

      // Remove the failed assistant message
      this.messages.splice(idx, 1);
      saveMessages(this.messages);

      // Re-send the user message
      this.sendMessage(userMsg.content);
    },

    // ---- Conversation management ----

    async fetchConversations() {
      this.conversationsLoading = true;
      try {
        this.conversations = await fetchConversations();
      } catch {
        // Silently fail — list stays as-is
      } finally {
        this.conversationsLoading = false;
      }
    },

    async loadConversation(id: string) {
      this.loadingConversationId = id;
      try {
        const detail = await fetchConversation(id);
        this.conversationId = detail.id;
        this.conversationTitle = detail.title ?? '';
        saveConversationId(detail.id);

        // Convert API messages to our ChatMessage format
        this.messages = detail.messages.map((msg, index) => ({
          id: `msg_loaded_${index}_${Date.now()}`,
          role: msg.role,
          content: msg.content,
          timestamp: Date.now(),
          status: 'done' as const,
        }));
        saveMessages(this.messages);

        this.view = 'chat';
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        this.loadingConversationId = null;
      }
    },

    async removeConversation(id: string) {
      this.deletingConversationId = id;
      try {
        await deleteConversation(id);
      } catch {
        // Proceed with local removal even if API fails
      }

      this.deletingConversationId = null;

      // Remove from local list
      this.conversations = this.conversations.filter((c) => c.id !== id);

      // If the deleted conversation was the active one, reset to list view
      if (this.conversationId === id) {
        this.conversationId = null;
        this.conversationTitle = '';
        this.messages = [];
        saveConversationId(null);
        saveMessages([]);
        this.view = 'list';
      }
    },

    newChat() {
      this.messages = [];
      this.conversationId = null;
      this.conversationTitle = '';
      saveMessages([]);
      saveConversationId(null);
      this.view = 'chat';
    },

    clearChat() {
      this.newChat();
    },

    // ---- Panel controls ----

    togglePanel() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.fetchConversations();
      }
    },

    closePanel() {
      this.isOpen = false;
    },

    openPanel() {
      this.isOpen = true;
      this.fetchConversations();

      // If no active conversation and conversations exist, show list
      if (!this.conversationId && this.conversations.length > 0) {
        this.view = 'list';
      }
    },

    showConversationList() {
      this.view = 'list';
    },
  },

  state: (): AiChatState => ({
    messages: loadMessages(),
    isOpen: false,
    isLoading: false,
    conversationId: loadConversationId(),
    conversationTitle: '',
    conversations: [],
    conversationsLoading: false,
    view: 'chat',
    loadingConversationId: null,
    deletingConversationId: null,
  }),
});
