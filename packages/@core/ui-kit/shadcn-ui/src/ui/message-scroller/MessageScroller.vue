<script lang="ts" setup>
import { cn } from '@vben-core/shared/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="cn('flex min-h-0 flex-1 flex-col', props.class)">
    <slot></slot>
  </div>
</template>
