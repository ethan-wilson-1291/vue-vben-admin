<script setup lang="ts">
export interface ButtonProps {
  disabled?: boolean;
  loading?: boolean;
  size?: 'large' | 'medium' | 'small';
  variant?: 'danger' | 'primary' | 'secondary';
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    class="rv-button"
    :class="[
      `rv-button--${variant}`,
      `rv-button--${size}`,
      { 'rv-button--disabled': disabled, 'rv-button--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="rv-button__spinner">⏳</span>
    <slot></slot>
  </button>
</template>

<style scoped>
.rv-button {
  @apply inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.rv-button--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.rv-button--secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
}

.rv-button--danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

.rv-button--small {
  @apply px-3 py-1 text-xs;
}

.rv-button--medium {
  @apply px-4 py-2 text-sm;
}

.rv-button--large {
  @apply px-6 py-3 text-base;
}

.rv-button--disabled {
  @apply cursor-not-allowed opacity-50;
}

.rv-button--loading {
  @apply cursor-wait;
}

.rv-button__spinner {
  @apply mr-2;
}
</style>
