<script lang="ts" setup>
import { useMessageScrollerProvider } from './use-message-scroller';

interface Props {
  autoScroll?: boolean;
  defaultScrollPosition?: 'end' | 'last-anchor' | 'start';
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: false,
  defaultScrollPosition: 'end',
  scrollEdgeThreshold: 8,
  scrollPreviousItemPeek: 64,
  scrollMargin: 0,
});

useMessageScrollerProvider(props);
</script>

<template>
  <slot></slot>
</template>
