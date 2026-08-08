<script lang="ts" setup>
import { computed } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

const emit = defineEmits<{
  selectQuestion: [text: string];
}>();

const suggestions = computed(() => [
  $t('page.common.aiChat.suggestion1'),
  $t('page.common.aiChat.suggestion2'),
  $t('page.common.aiChat.suggestion3'),
]);
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center p-6 text-center">
    <div class="mb-4 text-4xl">🤖</div>
    <h3 class="mb-1 text-lg font-semibold">
      {{ $t('page.common.aiChat.emptyTitle') }}
    </h3>
    <p class="mb-6 text-sm text-muted-foreground">
      {{ $t('page.common.aiChat.emptyDescription') }}
    </p>
    <div class="flex flex-wrap justify-center gap-2">
      <VbenButton
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="rounded-full"
        size="sm"
        variant="outline"
        @click="emit('selectQuestion', suggestion)"
      >
        {{ suggestion }}
      </VbenButton>
    </div>
  </div>
</template>
