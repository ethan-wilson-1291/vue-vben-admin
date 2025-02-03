<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, VbenButton } from '@vben/common-ui';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { ArrowLeft, ArrowRight, Check } from '@vben/icons';
import { useUserStore } from '@vben/stores';

import { Card, Flex, message, Steps, TypographyTitle } from 'ant-design-vue';

import { onboardFinished } from '#/api/onboard';

const userStore = useUserStore();
const router = useRouter();

const state = reactive({
  currentStep: 0,
  loading: false,
});

const next = () => {
  state.currentStep++;
};

const prev = () => {
  state.currentStep--;
};

const steps = [
  {
    title: 'COGs & Handling Fees',
    content: 'First-content',
  },
  {
    title: 'Shipping Fees',
    content: 'Second-content',
  },
  {
    title: 'Transaction Fees',
    content: 'Last-content',
  },
];

const items = steps.map((item) => ({ key: item.title, title: item.title }));

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
  if (!userStore.isOnboarding) {
    // Redirect to the dashboard
    router.push(DEFAULT_HOME_PATH);
  }
});
</script>

<template>
  <Page>
    <Flex vertical justify="center" align="center" gap="large">
      <TypographyTitle :level="3"> Setup </TypographyTitle>

      <div class="w-full max-w-4xl">
        <Steps :current="state.currentStep" :items="items" />

        <Card class="my-5">
          {{ state.currentStep }}
        </Card>

        <div class="flex items-center justify-center gap-5">
          <VbenButton
            variant="outline"
            class="w-[150px]"
            v-if="state.currentStep > 0"
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
      </div>
    </Flex>
  </Page>
</template>
