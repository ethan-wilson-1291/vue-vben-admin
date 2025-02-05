<script lang="ts" setup>
import type { ITransactionFee } from '@vben/stores';

import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, VbenButton } from '@vben/common-ui';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { ArrowLeft, ArrowRight, Check } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Flex, message, Steps } from 'ant-design-vue';

import { onboardFinished } from '#/api/onboard';
import { ShippingCostLevel } from '#/constants';

import Cogs from './cogs.vue';
import ExampleOrder from './exampleOrder.vue';
import HandlingFees from './handlingFees.vue';
import ShippingFees from './shippingFees.vue';
import TransactionFees from './transactionFees.vue';

const userStore = useUserStore();
const router = useRouter();

const state = reactive({
  cogsRate: 0,
  handlingFees: 0,
  shippingFeeLevel: ShippingCostLevel.QUANTITY,
  shippingFeePrice: 0,
  currentStep: 0,
  loading: false,
  transactionFees: [] as ITransactionFee[],
});

const next = () => {
  state.currentStep++;
};

const prev = () => {
  state.currentStep--;
};

const steps = ['COGS', 'Handling Fees', 'Shipping Costs', 'Transaction Fees'];
const items = steps.map((item) => ({ key: item, title: item }));

const onboardFinish = () => {
  state.loading = true;
  const payload = {
    cogsRate: state.cogsRate / 100,
    handlingFees: state.handlingFees,
    shippingCostLevel: state.shippingFeeLevel,
    shippingCostPrice: state.shippingFeePrice,
    transactionFees: state.transactionFees,
  };

  onboardFinished(payload)
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
  const defaultRegion = userStore.defaulRegion;

  state.cogsRate = userStore.settings.cogsRate * 100;
  state.handlingFees = userStore.settings.handlingFees;
  state.shippingFeeLevel = defaultRegion.shippingCostLevel;
  state.shippingFeePrice = defaultRegion.shippingCostPrice;
  state.transactionFees = userStore.transactionFees;
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
        To calculate your profits, we need your cost details.
      </small>

      <div class="mt-5 w-full max-w-4xl">
        <Steps :current="state.currentStep" :items="items" class="mb-10" />

        <div class="mb-10 flex items-center justify-center space-x-5">
          <VbenButton
            variant="outline"
            class="w-32"
            :disabled="state.currentStep === 0"
            style="margin-left: 8px"
            @click="prev"
          >
            <ArrowLeft class="mr-2 size-4" />
            Previous
          </VbenButton>

          <VbenButton
            class="w-32"
            v-if="state.currentStep < steps.length - 1"
            type="primary"
            @click="next"
          >
            Next
            <ArrowRight class="ml-2 size-4" />
          </VbenButton>

          <VbenButton
            :loading="state.loading"
            class="w-32"
            v-if="state.currentStep === steps.length - 1"
            type="primary"
            @click="onboardFinish"
          >
            Finish
            <Check class="ml-2 size-4" />
          </VbenButton>
        </div>

        <div class="flex flex-row space-x-5">
          <Cogs v-if="state.currentStep === 0" v-model="state.cogsRate" />
          <HandlingFees
            v-if="state.currentStep === 1"
            v-model="state.handlingFees"
          />
          <ShippingFees
            v-if="state.currentStep === 2"
            :level="state.shippingFeeLevel"
            :price="state.shippingFeePrice"
            @level-change="state.shippingFeeLevel = $event"
            @price-change="state.shippingFeePrice = $event"
          />
          <TransactionFees
            v-if="state.currentStep === 3"
            :model-value="state.transactionFees"
          />

          <ExampleOrder />
        </div>
        <!-- {{ state }} -->
      </div>
    </Flex>
  </Page>
</template>
