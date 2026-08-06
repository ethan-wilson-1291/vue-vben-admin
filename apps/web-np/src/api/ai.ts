import { requestClient } from '#/api/request';

const AI_CHAT_ENDPOINT = '/api/ai/chat';

/**
 * Send a chat message with streaming support via the built-in SSE client.
 *
 * The RequestClient.postSSE method:
 * - Runs request interceptors (auth header, locale header applied automatically)
 * - Bypasses response interceptors (no code-envelope unwrapping for SSE)
 * - Calls onMessage with raw text chunks from the SSE stream
 */
export function postChatMessage(
  message: string,
  history: Array<{ content: string; role: string }> = [],
  onToken: (chunk: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let sseBuffer = '';

    (requestClient as any)
      .postSSE(
        AI_CHAT_ENDPOINT,
        { history, message },
        {
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
        },
      )
      .catch((error: Error) => {
        reject(error);
      });
  });
}
