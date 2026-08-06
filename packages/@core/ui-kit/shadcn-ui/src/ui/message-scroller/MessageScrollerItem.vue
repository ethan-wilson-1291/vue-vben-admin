<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { MESSAGE_SCROLLER_KEY } from './use-message-scroller';

interface Props {
  class?: string;
  messageId: string;
  scrollAnchor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  scrollAnchor: false,
});

const injectedCtx = inject(MESSAGE_SCROLLER_KEY, null);
if (!injectedCtx)
  throw new Error('MessageScrollerItem must be inside MessageScrollerProvider');
const ctx = injectedCtx;

const elRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (elRef.value && props.messageId) {
    ctx.registerItem(props.messageId, elRef.value);
  }
  if (props.scrollAnchor && props.messageId) {
    ctx.registerAnchor(props.messageId);
  }
});

onUnmounted(() => {
  ctx.unregisterItem(props.messageId);
  if (props.scrollAnchor) {
    ctx.unregisterAnchor(props.messageId);
  }
});
</script>

<template>
  <div
    ref="elRef"
    :data-message-id="messageId"
    :data-scroll-anchor="scrollAnchor ? '' : undefined"
    :class="cn('', props.class)"
  >
    <slot></slot>
  </div>
</template>
