import { defineStore } from 'pinia';

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
          saveConversationId(result.conversationId);
        }

        // Mark complete
        this.updateMessage(assistantMsg.id, { status: 'done' });
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

    clearChat() {
      this.messages = [];
      this.conversationId = null;
      saveMessages(this.messages);
      saveConversationId(null);
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
    conversationId: loadConversationId(),
  }),
});
