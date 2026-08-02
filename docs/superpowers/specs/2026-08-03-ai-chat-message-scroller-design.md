# AI Chat with Message Scroller — Design Spec

**Date:** 2026-08-03  
**Status:** Draft  
**Approach:** A — Install shadcn-vue message-scroller, build chat UI around it

## Overview

Add an AI-powered data analyst chatbot to the web-np app. A floating action button (FAB) in the bottom-right corner opens a slide-out chat panel. Users can ask questions about their store analytics and receive streaming AI responses. The chat panel is available across the entire app and uses the shadcn-vue `message-scroller` component for anchoring, auto-scroll, and prepend-restore behavior.

## Motivation

Users need a quick way to ask analytical questions about their store without navigating away from their current view. An AI assistant embedded as a floating chat panel provides on-demand insights.

## Architecture

### Component Tree

```
app.vue (or root layout)
├── ...existing layout content...
├── AiChatButton          ← floating FAB, always visible
└── AiChatPanel           ← slide-out panel (conditionally rendered)
    └── MessageScrollerProvider
        └── MessageScroller
            ├── MessageScrollerViewport
            │   └── MessageScrollerContent
            │       └── MessageScrollerItem (v-for each message)
            │           └── ChatBubble (message renderer)
            ├── MessageScrollerButton (direction="end")
            └── ChatInput (text area + send button, pinned below viewport)
```

### File Layout

- `packages/@core/ui-kit/shadcn-ui/src/ui/message-scroller/` — shadcn-vue message-scroller primitives (installed via CLI)
- `apps/web-np/src/views/ai-chat/` — app-level chat components
  - `ai-chat-button.vue` — floating button
  - `ai-chat-panel.vue` — the slide-out chat panel
  - `chat-bubble.vue` — individual message renderer
  - `chat-input.vue` — text input + send button
  - `chat-empty-state.vue` — suggested questions for new conversations
- `apps/web-np/src/store/ai-chat.ts` — Pinia store for chat state
- `apps/web-np/src/api/ai.ts` — API client for the AI endpoint

### Integration Point

`AiChatButton` and `AiChatPanel` are mounted once in the root layout (`apps/web-np/src/layouts/`) so they are available on every page without per-route boilerplate.

## UI Design

### Floating Button (`AiChatButton`)

- Fixed position: `bottom: 24px, right: 24px`
- Icon: `MessageCircle` from Lucide (or similar)
- Subtle pulse animation on idle to invite engagement
- On click: toggles `useAiChatStore.isOpen`
- Hidden when the chat panel is already open
- References the existing `back-top` component for styling patterns (`size-10 rounded-full shadow-float`)

### Chat Panel (`AiChatPanel`)

- Fixed overlay, slides in from the right edge
- Width: ~400px on desktop, full-width on mobile (`< md` breakpoint)
- Height: `calc(100vh - 64px)` (respects the app header)
- Header: "AI Assistant" title + collapse/X button
- Body: `MessageScroller` with the chat transcript
- Footer: `ChatInput` pinned below the viewport
- z-index high enough to sit above dashboard content but below modals
- Respects `shopStore.isFreeSubscription` — free-tier users see the panel but messages are gated

### Messages (`ChatBubble`)

- User messages: right-aligned, primary color background
- Assistant messages: left-aligned, muted background, small AI avatar/icon
- States per message: `sending`, `streaming` (animated cursor), `done`, `error` (red tint + retry button)

### Empty State (`ChatEmptyState`)

Shown when there are no messages. Displays 3-4 suggested questions as tappable chips, e.g.:
- "What were my top-selling products this week?"
- "How did my ad spend change month-over-month?"
- "What's my current profit margin trend?"

## Data Flow

### Pinia Store: `useAiChatStore`

```ts
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  status: 'sending' | 'streaming' | 'done' | 'error'
}

interface AiChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
}
```

- `sendMessage(text)` — pushes user message, calls AI API, streams response into assistant message
- `clearChat()` — resets message list
- Persisted to `localStorage` so chat history survives page navigation within the session

### API Client: `src/api/ai.ts`

- Function: `postChatMessage(message, history?)`
- Uses the existing `requestClient` (token, headers, envelope unwrapping)
- Endpoint: the existing AI API endpoint
- Supports streaming responses (SSE or similar); falls back to non-streaming if unavailable
- On error: assistant message transitions to `status: 'error'` with the error message

### Message Send Flow

1. User types message → hits Enter or clicks send
2. User bubble appears immediately (`status: 'sending'`)
3. API call fires with message + optional history
4. `MessageScrollerProvider` `autoScroll` pins viewport to bottom
5. First token arrives → `status: 'streaming'`, content begins appending
6. Streaming completes → `status: 'done'`
7. On error → `status: 'error'` with retry affordance
8. `MessageScrollerButton` appears when user scrolls up; click jumps to live edge

## Error Handling

| Scenario | UI Treatment |
|---|---|
| API network error / 5xx | Assistant bubble: "Something went wrong" + retry button |
| API 4xx (rate limit, etc.) | Show the specific API error message in the assistant bubble |
| Token expired mid-chat | Handled by `requestClient` interceptor; on failure show "Please log in again" |

## Edge Cases

- **Long responses**: Scroller handles overflow; auto-scroll stays pinned
- **Rapid-fire questions**: Each message spawns its own API call; previous streams continue (not cancelled)
- **Panel re-open**: Chat history persists; transcript shows at last scroll position
- **Mobile keyboards**: Input stays above keyboard; viewport height adjusts
- **Shopify iframe**: Panel is constrained to iframe bounds; `position: fixed` works inside the Shopify App Bridge context
- **Free subscription**: AI chat respects `shopStore.isFreeSubscription`; gated with upgrade prompt

## Dependencies

- shadcn-vue `message-scroller` component (installed via CLI into `@vben-core/shadcn-ui`)
- Existing `@vben-core/shadcn-ui` infrastructure (reka-ui, cn helper, CSS variables)
- Existing `requestClient` for API calls
- Existing `useShopStore` for subscription gating
- Lucide icons (already available via `@lucide/vue`)

## Testing Strategy

- **Unit**: `useAiChatStore` — message management, send flow, error states (Vitest)
- **Component**: `AiChatButton` toggle, `ChatInput` validation, `ChatBubble` rendering states
- **Integration**: Mock API → full send-and-receive flow
- **E2E**: Open chat, send message, verify response renders (Playwright)

## Out of Scope

- Multi-turn conversation context management (handled by the AI backend)
- File/image attachments in messages
- Voice input
- Chat history across browser sessions (server-side persistence)
