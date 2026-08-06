import type { InjectionKey, Ref } from 'vue';

import { computed, inject, nextTick, provide, ref, shallowRef } from 'vue';

import { useScroll } from '@vueuse/core';

// --- Types ---

export interface MessageScrollerContext {
  anchorIds: Ref<Set<string>>;
  autoScroll: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  isPinned: Ref<boolean>;
  itemElements: Ref<Map<string, HTMLElement>>;
  onContentMutation: () => void;
  onScroll: () => void;
  registerAnchor: (id: string) => void;
  registerItem: (id: string, el: HTMLElement) => void;
  resolveDefaultPosition: () => void;
  scrollEdgeThreshold: Ref<number>;
  scrollMargin: Ref<number>;
  scrollPreviousItemPeek: Ref<number>;
  scrollToEnd: (options?: ScrollToOptions) => void;
  scrollToMessage: (id: string) => Promise<boolean>;
  scrollToStart: (options?: ScrollToOptions) => void;
  unregisterAnchor: (id: string) => void;
  unregisterItem: (id: string) => void;
  viewportRef: Ref<HTMLElement | null>;
}

export const MESSAGE_SCROLLER_KEY: InjectionKey<MessageScrollerContext> =
  Symbol('MessageScroller');

// --- Composable ---

export function useMessageScroller() {
  const ctx = inject(MESSAGE_SCROLLER_KEY, null);
  if (!ctx) {
    throw new Error(
      'useMessageScroller must be used within a <MessageScrollerProvider>',
    );
  }
  return {
    scrollToMessage: ctx.scrollToMessage,
    scrollToEnd: ctx.scrollToEnd,
    scrollToStart: ctx.scrollToStart,
  };
}

export function useMessageScrollerVisibility() {
  const ctx = inject(MESSAGE_SCROLLER_KEY, null);
  if (!ctx) {
    throw new Error(
      'useMessageScrollerVisibility must be used within a <MessageScrollerProvider>',
    );
  }
  return ctx;
}

export function useMessageScrollerScrollable() {
  const ctx = inject(MESSAGE_SCROLLER_KEY, null);
  if (!ctx) {
    throw new Error(
      'useMessageScrollerScrollable must be used within a <MessageScrollerProvider>',
    );
  }
  const viewport = ctx.viewportRef;
  const { arrivedState } = useScroll(viewport);

  return computed(() => ({
    start: !arrivedState.left && !arrivedState.top,
    end: !arrivedState.right && !arrivedState.bottom,
  }));
}

// --- Provider composable ---

export interface UseMessageScrollerProviderOptions {
  autoScroll?: boolean;
  defaultScrollPosition?: 'end' | 'last-anchor' | 'start';
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
}

export function useMessageScrollerProvider(
  options: UseMessageScrollerProviderOptions = {},
) {
  const autoScroll = ref(options.autoScroll ?? false);
  const scrollEdgeThreshold = ref(options.scrollEdgeThreshold ?? 8);
  const scrollMargin = ref(options.scrollMargin ?? 0);
  const scrollPreviousItemPeek = ref(options.scrollPreviousItemPeek ?? 64);
  const defaultScrollPosition = options.defaultScrollPosition ?? 'end';

  const viewportRef = shallowRef<HTMLElement | null>(null);
  const contentRef = shallowRef<HTMLElement | null>(null);
  const anchorIds = ref<Set<string>>(new Set());
  const itemElements = ref<Map<string, HTMLElement>>(new Map());
  const isPinned = ref(true);
  const resolvedDefault = ref(false);

  // Track scroll position
  function isScrolledToBottom(threshold = scrollEdgeThreshold.value): boolean {
    const el = viewportRef.value;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }

  // Pin/unpin logic
  function onScroll() {
    if (autoScroll.value) {
      isPinned.value = isScrolledToBottom();
    }
  }

  // Watch for new content (auto-scroll)
  function onContentMutation() {
    if (autoScroll.value && isPinned.value) {
      nextTick(() => {
        scrollToEnd();
      });
    }
  }

  function scrollToEnd(options?: ScrollToOptions) {
    const el = viewportRef.value;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: options?.behavior ?? 'instant',
    });
    if (autoScroll.value) {
      isPinned.value = true;
    }
  }

  function scrollToStart(options?: ScrollToOptions) {
    const el = viewportRef.value;
    if (!el) return;
    el.scrollTo({
      top: 0,
      behavior: options?.behavior ?? 'smooth',
    });
  }

  async function scrollToMessage(id: string): Promise<boolean> {
    const el = itemElements.value.get(id);
    if (el) {
      el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return true;
    }
    return false;
  }

  function registerItem(id: string, el: HTMLElement) {
    itemElements.value.set(id, el);
  }

  function unregisterItem(id: string) {
    itemElements.value.delete(id);
  }

  function registerAnchor(id: string) {
    anchorIds.value.add(id);
  }

  function unregisterAnchor(id: string) {
    anchorIds.value.delete(id);
  }

  // Resolve default position on mount
  function resolveDefaultPosition() {
    if (resolvedDefault.value) return;
    resolvedDefault.value = true;

    if (defaultScrollPosition === 'end') {
      scrollToEnd();
    } else if (defaultScrollPosition === 'start') {
      scrollToStart();
    } else if (defaultScrollPosition === 'last-anchor') {
      // Find last anchor and scroll to it
      const anchors = [...anchorIds.value];
      if (anchors.length > 0) {
        const lastAnchor = anchors[anchors.length - 1]!;
        nextTick(() => {
          const el = itemElements.value.get(lastAnchor);
          if (el) {
            const viewport = viewportRef.value;
            if (viewport) {
              viewport.scrollTop = el.offsetTop - scrollPreviousItemPeek.value;
            }
          } else {
            scrollToEnd();
          }
        });
      } else {
        scrollToEnd();
      }
    }
  }

  const ctx: MessageScrollerContext = {
    anchorIds,
    autoScroll,
    contentRef,
    isPinned,
    itemElements,
    onContentMutation,
    onScroll,
    registerAnchor,
    registerItem,
    resolveDefaultPosition,
    scrollEdgeThreshold,
    scrollMargin,
    scrollPreviousItemPeek,
    scrollToEnd,
    scrollToMessage,
    scrollToStart,
    unregisterAnchor,
    unregisterItem,
    viewportRef,
  };

  provide(MESSAGE_SCROLLER_KEY, ctx);

  return {
    ctx,
    onScroll,
    onContentMutation,
    resolveDefaultPosition,
  };
}
