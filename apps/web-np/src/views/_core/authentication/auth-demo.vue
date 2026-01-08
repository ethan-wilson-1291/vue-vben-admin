<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { VbenLoading } from '@vben/common-ui';
import { resetAllStores } from '@vben/stores';

import { useAuthStore } from '#/store';

const authStore = useAuthStore();

onBeforeMount(() => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdWF0LWFwaS5maW5pbHkuYXBwL2F1dGgvdmVyaWZ5LXNob3BpZnktc2Vzc2lvbi1pZCIsImlhdCI6MTc2Nzg1NzcxNywibmJmIjoxNzY3ODU3NzE3LCJqdGkiOiJrNGt6aUJsR1VDYWVCRUhNIiwic3ViIjoiOTcxNjg2MjE4NzAiLCJwcnYiOiIzMmRjMGZhMTI2YTljMzc1ZDYyZjEyMmQ4MzhjMmY0OGEyZDBmMDAyIn0.sF0jRAwuWH4CXZyc4fjQM8bdBg1u9sjQX_Xy2fvsm9s';

  resetAllStores();

  authStore.authLoginViaToken(token);
});
</script>

<template>
  <VbenLoading spinning text="Verifying token..." />
</template>
