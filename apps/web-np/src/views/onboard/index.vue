<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, VbenButton } from '@vben/common-ui';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { ArrowLeft, ArrowRight, Check } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Flex, message, Steps } from 'ant-design-vue';

import { onboardFinished } from '#/api/onboard';

import Cogs from './cogs.vue';
import HandlingFees from './handlingFees.vue';

const userStore = useUserStore();
const router = useRouter();

const state = reactive({
  cogsRate: 0,
  handlingFees: 0,
  currentStep: 0,
  loading: false,
});

const next = () => {
  state.currentStep++;
};

const prev = () => {
  state.currentStep--;
};

const steps = ['COGS', 'Handling Fees', 'Shipping Fees', 'Transaction Fees'];
const items = steps.map((item) => ({ key: item, title: item }));

const onboardFinish = (params: any) => {
  state.loading = true;
  onboardFinished(params)
    .then(() => {
      message.success('Onboarding completed successfully');

      // Reload the page
      window.location.reload();
    })
    .finally(() => {
      state.loading = false;
    });
};

onMounted(() => {
  // Redirect to the home page if the user has already completed the onboarding
  if (!userStore.isOnboarding) {
    router.push(DEFAULT_HOME_PATH);
  }

  // Set the default values
  state.cogsRate = userStore.settings.cogsRate * 100;
  state.handlingFees = userStore.settings.handlingFees;
});
</script>

<template>
  <Page class="mt-10 h-full">
    <Flex class="h-full" vertical align="center" gap="large">
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Welcome to the {{ preferences.app.name }}!
      </h2>

      <small class="text-sm leading-none">
        To calculate your profits, please provide your cost details.
      </small>

      <div class="mt-5 w-full max-w-4xl">
        <Steps :current="state.currentStep" :items="items" class="mb-10" />

        <div class="mb-10 flex items-center justify-center space-x-5">
          <VbenButton
            variant="outline"
            class="w-[150px]"
            :disabled="state.currentStep === 0"
            style="margin-left: 8px"
            @click="prev"
          >
            <ArrowLeft class="mr-2 size-4" />
            Previous
          </VbenButton>

          <VbenButton
            class="w-[150px]"
            v-if="state.currentStep < steps.length - 1"
            type="primary"
            @click="next"
          >
            Next
            <ArrowRight class="ml-2 size-4" />
          </VbenButton>

          <VbenButton
            :loading="state.loading"
            class="w-[150px]"
            v-if="state.currentStep === steps.length - 1"
            type="primary"
            @click="onboardFinish"
          >
            Finish
            <Check class="ml-2 size-4" />
          </VbenButton>
        </div>

        <Cogs v-if="state.currentStep === 0" v-model="state.cogsRate" />
        <HandlingFees
          v-if="state.currentStep === 1"
          v-model="state.handlingFees"
        />

        <!-- {{ state }} -->
      </div>
    </Flex>
  </Page>
</template>
