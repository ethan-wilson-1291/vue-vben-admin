<script lang="ts" setup>
import { computed } from 'vue';

import { MessageCircle } from '#/icons';
import { useAiChatStore } from '#/store';

const chatStore = useAiChatStore();

const buttonStyle = computed(() => ({
  bottom: '24px',
  right: '24px',
}));
</script>

<template>
  <Transition name="fade-scale">
    <button
      v-if="!chatStore.isOpen"
      :style="buttonStyle"
      class="fixed z-[999] flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-300 hover:scale-110 hover:shadow-lg"
      @click="chatStore.openPanel()"
    >
      <MessageCircle class="size-5" />
    </button>
  </Transition>
</template>
