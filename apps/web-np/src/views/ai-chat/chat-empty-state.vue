<script lang="ts" setup>
import { $t } from '@vben/locales';

const emit = defineEmits<{
  selectQuestion: [text: string];
}>();

const suggestions = [
  $t('page.aiChat.suggestion1'),
  $t('page.aiChat.suggestion2'),
  $t('page.aiChat.suggestion3'),
];
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center p-6 text-center">
    <div class="mb-4 text-4xl">🤖</div>
    <h3 class="mb-1 text-lg font-semibold">
      {{ $t('page.aiChat.emptyTitle') }}
    </h3>
    <p class="mb-6 text-sm text-muted-foreground">
      {{ $t('page.aiChat.emptyDescription') }}
    </p>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="emit('selectQuestion', suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>
