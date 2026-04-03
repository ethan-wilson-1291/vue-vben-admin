<script lang="ts" setup>
import { Support } from '#/icons';
import { $t } from '#/locales';
import { useShopSettingStore } from '#/store';

const shopSettingStore = useShopSettingStore();
</script>
<template>
  <div
    class="group flex h-8 cursor-pointer items-center gap-2 rounded-2xl border-none bg-none px-2 py-0.5 outline-none md:bg-accent"
    @click="shopSettingStore.toggleChatPopup()"
  >
    <Support class="size-5" />
    <span
      class="hidden text-xs text-muted-foreground duration-300 group-hover:text-foreground md:block"
    >
      {{ $t('page.common.chatWithSupport') }}
    </span>
  </div>
</template>

<style scoped></style>
