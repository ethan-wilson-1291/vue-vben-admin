<script lang="ts" setup>
import { cn } from '@vben-core/shared/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div role="log" aria-relevant="additions" :class="cn('', props.class)">
    <slot></slot>
  </div>
</template>
