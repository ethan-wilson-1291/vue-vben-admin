<script lang="ts" setup>
import { computed, inject } from 'vue';

import { ArrowDown } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

import { VbenButton } from '../../components/button';
import { MESSAGE_SCROLLER_KEY } from './use-message-scroller';

interface Props {
  class?: string;
  direction?: 'end' | 'start';
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'end',
});

const injectedCtx = inject(MESSAGE_SCROLLER_KEY, null);
if (!injectedCtx)
  throw new Error(
    'MessageScrollerButton must be inside MessageScrollerProvider',
  );
const ctx = injectedCtx;

const isAtEnd = computed(() => ctx.isPinned.value);

function handleClick() {
  if (props.direction === 'end') {
    ctx.scrollToEnd({ behavior: 'smooth' });
  } else {
    ctx.scrollToStart({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div
    v-if="!isAtEnd"
    :class="cn('absolute bottom-4 right-4 z-10', props.class)"
  >
    <VbenButton
      size="icon"
      variant="secondary"
      class="size-8 rounded-full shadow-float"
      @click="handleClick"
    >
      <ArrowDown class="size-4" />
      <span class="sr-only">Scroll to bottom</span>
    </VbenButton>
  </div>
</template>
