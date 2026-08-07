import { requestClient } from '#/api/request';

const AI_CHAT_ENDPOINT = '/api/ai/chat';

interface ChatDonePayload {
  conversationId: string;
  title: string;
}

/**
 * Send a chat message with streaming support via SSE.
 *
 * The BE sends named SSE events:
 *   event: text_delta   data: "token text"
 *   event: tool_call    data: {"name":"get_p_and_l_report","input":{...}}
 *   event: tool_result  data: {"name":"get_p_and_l_report"}
 *   event: done         data: {"conversation_id":"...","title":"..."}
 *   event: error        data: {"code":"...","message":"..."}
 */
export function postChatMessage(
  message: string,
  conversationId: null | string,
  onToken: (chunk: string) => void,
  onToolCall?: (name: string, input: Record<string, any>) => void,
  onToolResult?: (name: string) => void,
): Promise<ChatDonePayload> {
  return new Promise((resolve, reject) => {
    let sseBuffer = '';

    (requestClient as any)
      .postSSE(
        AI_CHAT_ENDPOINT,
        {
          message,
          conversation_id: conversationId || undefined,
        },
        {
          onEnd() {
            // Flush any remaining buffered data
            const remaining = sseBuffer.trim();
            if (remaining) {
              const { eventType, data } = parseSseFrame(remaining);
              if (eventType && data) {
                handleEvent(eventType, data, {
                  onToken,
                  onToolCall,
                  onToolResult,
                  resolve,
                  reject,
                });
              }
            }
            reject(new Error('Stream ended without a done event.'));
          },
          onMessage(rawChunk: string) {
            sseBuffer += rawChunk;

            // SSE frames are separated by "\n\n"
            const parts = sseBuffer.split('\n\n');
            // Keep the last (possibly incomplete) part in the buffer
            sseBuffer = parts.pop() ?? '';

            for (const part of parts) {
              const { eventType, data } = parseSseFrame(part);
              if (!data) continue;

              handleEvent(eventType, data, {
                onToken,
                onToolCall,
                onToolResult,
                resolve,
                reject,
              });
            }
          },
        },
      )
      .catch((error: Error) => {
        reject(error);
      });
  });
}

/**
 * Parse a single SSE frame into its event type and data.
 *
 * SSE frame format:
 *   event: <event-name>\n
 *   data: <json-or-plain-text>\n
 */
function parseSseFrame(frame: string): { data: string; eventType: string } {
  const lines = frame.split('\n');
  let eventType = '';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      eventType = line.slice(7).trim();
    } else if (line.startsWith('data: ')) {
      data = line.slice(6).trim();
    }
  }

  return { eventType, data };
}

/**
 * Dispatch an SSE event to the appropriate handler.
 */
function handleEvent(
  eventType: string,
  data: string,
  callbacks: {
    onToken: (chunk: string) => void;
    onToolCall?: (name: string, input: Record<string, any>) => void;
    onToolResult?: (name: string) => void;
    reject: (reason: Error) => void;
    resolve: (value: ChatDonePayload) => void;
  },
): void {
  switch (eventType) {
    case 'done': {
      try {
        const parsed = JSON.parse(data);
        callbacks.resolve({
          conversationId: parsed.conversation_id,
          title: parsed.title,
        });
      } catch {
        callbacks.resolve({ conversationId: '', title: '' });
      }
      break;
    }

    case 'error': {
      try {
        const parsed = JSON.parse(data);
        callbacks.reject(new Error(parsed.message || 'An error occurred.'));
      } catch {
        callbacks.reject(new Error('An error occurred.'));
      }
      break;
    }

    case 'text_delta': {
      // data is a plain JSON string (double-encoded by the BE)
      // e.g. data: "Your P&L"
      let text = data;
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'string') text = parsed;
      } catch {
        // not JSON — use raw data as text
      }
      callbacks.onToken(text);
      break;
    }

    case 'tool_call': {
      try {
        const parsed = JSON.parse(data);
        callbacks.onToolCall?.(parsed.name, parsed.input);
      } catch {
        // ignore malformed tool_call events
      }
      break;
    }

    case 'tool_result': {
      try {
        const parsed = JSON.parse(data);
        callbacks.onToolResult?.(parsed.name);
      } catch {
        // ignore malformed tool_result events
      }
      break;
    }

    default: {
      // Unknown event type — attempt fallback token parsing
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed?.content ?? parsed?.delta ?? parsed?.text ?? '';
        if (chunk) callbacks.onToken(chunk);
      } catch {
        if (data) callbacks.onToken(data);
      }
      break;
    }
  }
}
