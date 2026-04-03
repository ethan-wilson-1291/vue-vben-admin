<script lang="ts" setup>
import type { ITransactionFee } from '#/store';

import { onBeforeMount, reactive } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { ArrowLeft, Check } from '@vben/icons';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';

import { Flex, message, Steps } from 'ant-design-vue';

import { onboardFinished } from '#/api';
import { ArrowRight } from '#/icons';
import { DefaultRoutes } from '#/shared/constants';
import { redirectToPath, toPercentage, toRate } from '#/shared/utils';
import { useShopSettingStore, useShopStore } from '#/store';

import ExampleOrder from './example-order.vue';
import { onboardForm } from './service';
import Cogs from './step-1-cogs.vue';
import HandlingFees from './step-2-handling-fees.vue';
import ShippingFees from './step-3-shipping-fees.vue';
import TransactionFees from './step-4-transaction-fees.vue';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const state = reactive({
  currentStep: 0,
  loading: false,
});

const steps = [
  $t('page.onboard.steps.cogs'),
  $t('page.onboard.steps.handlingFees'),
  $t('page.onboard.steps.shippingCosts'),
  $t('page.onboard.steps.transactionFees'),
];
const items = steps.map((item) => ({ key: item, title: item }));

const next = () => {
  state.currentStep++;
};

const prev = () => {
  state.currentStep--;
};

const onboardFinish = () => {
  state.loading = true;
  const payload = {
    cogsRate: toRate(onboardForm.cogsRate),
    cogsSource: onboardForm.cogsFromShopify ? 'shopify' : 'manual',
    handlingFees: onboardForm.handlingFees,
    shippingCostLevel: onboardForm.shippingFeeLevel,
    shippingCostPrice: onboardForm.shippingFeePrice,
    transactionFees: onboardForm.transactionFees.map((item) => ({
      ...item,
      percentageFee: toRate(item.percentageFee),
      externalFeePercentage: toRate(item.externalFeePercentage),
    })),
  };

  onboardFinished(payload)
    .then(() => {
      message.success($t('page.onboard.index.completedSuccess'));

      // Reload the page
      window.location.reload();
    })
    .finally(() => {
      state.loading = false;
    });
};

onBeforeMount(() => {
  // Redirect to the home page if the user has already completed the onboarding
  if (!shopStore.isOnboarding) {
    redirectToPath(DefaultRoutes.HOME);
  }

  // Set the default values
  const defaultRegion = shopSettingStore.defaultRegion;
  onboardForm.shippingFeeLevel = defaultRegion.shippingCostLevel;
  onboardForm.shippingFeePrice = defaultRegion.shippingCostPrice;

  onboardForm.cogsRate = toPercentage(shopSettingStore.cogsRate) as any;
  onboardForm.handlingFees = shopSettingStore.handlingFees;
  onboardForm.transactionFees = shopSettingStore.transactionFees.map(
    (item): ITransactionFee => ({
      ...item,
      fixedFee: item.fixedFee,
      percentageFee: toPercentage(item.percentageFee) as any,
      externalFeePercentage: toPercentage(item.externalFeePercentage) as any,
    }),
  );
});
</script>

<template>
  <Page class="mt-10 h-full">
    <Flex class="h-full" vertical align="center" gap="large">
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        {{ $t('page.onboard.index.welcomePrefix') }} {{ preferences.app.name
        }}{{ $t('page.onboard.index.welcomeSuffix') }}
      </h2>

      <small class="text-sm leading-none">
        {{ $t('page.onboard.index.subtitle') }}
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
            {{ $t('page.onboard.index.previous') }}
          </VbenButton>

          <VbenButton
            class="w-32"
            v-if="state.currentStep < steps.length - 1"
            type="primary"
            @click="next"
          >
            {{ $t('page.onboard.index.next') }}
            <ArrowRight class="ml-2 size-4" />
          </VbenButton>

          <VbenButton
            :loading="state.loading"
            class="w-32"
            v-if="state.currentStep === steps.length - 1"
            type="primary"
            @click="onboardFinish"
          >
            {{ $t('page.onboard.index.finish') }}
            <Check class="ml-2 size-4" />
          </VbenButton>
        </div>

        <div class="flex flex-row space-x-5">
          <Cogs v-if="state.currentStep === 0" />
          <HandlingFees v-if="state.currentStep === 1" />
          <ShippingFees v-if="state.currentStep === 2" />
          <TransactionFees v-if="state.currentStep === 3" />

          <ExampleOrder />
        </div>
      </div>
    </Flex>
  </Page>
</template>
