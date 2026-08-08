<script lang="ts" setup>
import { $t } from '#/locales';
import { useAiChatStore } from '#/store';

const chatStore = useAiChatStore();
</script>
<template>
  <div
    class="ml-0.5 group flex h-8 cursor-pointer items-center gap-2 rounded-2xl border-none bg-none px-2 py-0.5 outline-none md:bg-accent"
    @click="chatStore.openPanel()"
  >
    🤖
    <span
      class="hidden text-xs text-muted-foreground duration-300 group-hover:text-foreground md:block"
    >
      {{ $t('page.common.aiChat.title') }}
    </span>
  </div>
</template>

<style scoped></style>
