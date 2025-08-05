<script setup lang="ts">
export interface CardProps {
  elevated?: boolean;
  padding?: 'large' | 'medium' | 'none' | 'small';
  title?: string;
}

withDefaults(defineProps<CardProps>(), {
  elevated: false,
  padding: 'medium',
  title: '',
});
</script>

<template>
  <div
    class="rv-card"
    :class="[`rv-card--padding-${padding}`, { 'rv-card--elevated': elevated }]"
  >
    <div v-if="title" class="rv-card__title">
      {{ title }}
    </div>
    <div class="rv-card__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.rv-card {
  @apply rounded-lg border border-gray-200 bg-white;
}

.rv-card--elevated {
  @apply shadow-lg;
}

.rv-card--padding-none {
  @apply p-0;
}

.rv-card--padding-small {
  @apply p-3;
}

.rv-card--padding-medium {
  @apply p-6;
}

.rv-card--padding-large {
  @apply p-8;
}

.rv-card__title {
  @apply mb-4 text-lg font-semibold text-gray-900;
}

.rv-card__content {
  @apply text-gray-700;
}
</style>
