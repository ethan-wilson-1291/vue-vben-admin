<script setup lang="ts">
import { ref } from 'vue';

import { RvButton, RvCard, RvInput } from '@core-rv/components';

const message = ref('Hello from Shopify RV Embedded App!');
const inputValue = ref('');

const handleButtonClick = () => {
  message.value = `Button clicked! Input value: ${inputValue.value}`;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="mx-auto max-w-2xl">
      <RvCard title="Shopify RV Embedded App" elevated padding="large">
        <div class="space-y-6">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ message }}
            </h1>
            <p class="mt-2 text-gray-600">
              This is a Vue.js application using RV components that can be
              embedded as a Web Component in Shopify.
            </p>
          </div>

          <div class="space-y-4">
            <RvInput
              v-model="inputValue"
              label="Enter a message"
              placeholder="Type something..."
              required
            />

            <div class="flex justify-center space-x-4">
              <RvButton variant="primary" @click="handleButtonClick">
                Primary Button
              </RvButton>
              <RvButton variant="secondary" @click="handleButtonClick">
                Secondary Button
              </RvButton>
              <RvButton variant="danger" @click="handleButtonClick">
                Danger Button
              </RvButton>
            </div>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-500">
              This app demonstrates the RV component library with consistent
              design system.
            </p>
          </div>
        </div>
      </RvCard>
    </div>
  </div>
</template>
