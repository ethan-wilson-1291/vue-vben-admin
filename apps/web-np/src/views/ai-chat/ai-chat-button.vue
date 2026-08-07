<script lang="ts" setup>
import { VbenIconButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { MessageCircle } from '#/icons';
import { useAiChatStore } from '#/store';

const chatStore = useAiChatStore();
</script>

<template>
  <Transition name="fade-scale">
    <VbenIconButton
      v-if="!chatStore.isOpen"
      :tooltip="$t('page.common.aiChat.title')"
      class="fixed bottom-6 right-6 z-[999] size-12 shadow-float transition-all duration-300 hover:scale-110 hover:shadow-lg"
      variant="default"
      @click="chatStore.openPanel()"
    >
      <MessageCircle class="size-5" />
    </VbenIconButton>
  </Transition>
</template>
