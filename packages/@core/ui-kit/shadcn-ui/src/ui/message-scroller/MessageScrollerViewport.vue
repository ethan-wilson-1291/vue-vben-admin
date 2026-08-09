<script lang="ts" setup>
import { inject, ref, watch } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { MESSAGE_SCROLLER_KEY } from './use-message-scroller';

interface Props {
  class?: string;
  preserveScrollOnPrepend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  preserveScrollOnPrepend: true,
});

const injectedCtx = inject(MESSAGE_SCROLLER_KEY, null);
if (!injectedCtx) {
  throw new Error(
    'MessageScrollerViewport must be inside MessageScrollerProvider',
  );
}
const ctx = injectedCtx;

const elRef = ref<HTMLElement | null>(null);

// Bind viewport ref to context
watch(
  () => elRef.value,
  (el) => {
    ctx.viewportRef.value = el;
    if (el) {
      ctx.resolveDefaultPosition?.();
    }
  },
  { immediate: true },
);

// Handle scroll events
function onScrollEvent() {
  ctx.onScroll?.();
}

// Observe content changes for auto-scroll
let observer: MutationObserver | null = null;
watch(
  () => elRef.value,
  (el) => {
    observer?.disconnect();
    if (el) {
      observer = new MutationObserver(() => {
        ctx.onContentMutation?.();
      });
      observer.observe(el, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  },
  { immediate: true },
);

defineExpose({ elRef });
</script>

<template>
  <div
    ref="elRef"
    role="region"
    aria-label="Messages"
    tabindex="0"
    :class="cn('min-h-0 flex-1 overflow-y-auto', props.class)"
    @scroll.passive="onScrollEvent"
  >
    <slot></slot>
  </div>
</template>
