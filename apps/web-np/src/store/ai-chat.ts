import { defineStore } from 'pinia';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  status: 'done' | 'error' | 'sending' | 'streaming';
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
        Pick<ChatMessage, 'content' | 'errorMessage' | 'status'>
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
          .map((m) => ({ content: m.content, role: m.role }));

        await postChatMessage(
          text.trim(),
          history,
          // onToken callback — append each chunk
          (chunk: string) => {
            this.updateMessage(assistantMsg.id, {
              content: (assistantMsg.content + chunk) as string,
              status: 'streaming',
            });
          },
        );

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
