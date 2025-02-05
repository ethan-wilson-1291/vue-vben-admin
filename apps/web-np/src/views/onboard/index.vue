<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, VbenButton } from '@vben/common-ui';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { ArrowLeft, ArrowRight, Check } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, Flex, message, Steps } from 'ant-design-vue';

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

        <div class="flex flex-row space-x-5">
          <Cogs v-if="state.currentStep === 0" v-model="state.cogsRate" />
          <HandlingFees
            v-if="state.currentStep === 1"
            v-model="state.handlingFees"
          />

          <Card title="Example Order" class="min-w-56">
            <div class="mb-2 flex justify-between font-bold">
              <div>Net payment</div>
              <div>85 {{ userStore.shop.currency }}</div>
            </div>
            <div class="flex justify-between">
              <div>Total COGS</div>
              <div>12 {{ userStore.shop.currency }}</div>
            </div>
            <div class="flex justify-between">
              <div>Handling Fees</div>
              <div>3 {{ userStore.shop.currency }}</div>
            </div>
            <div class="flex justify-between">
              <div>Shipping Fees</div>
              <div>5 {{ userStore.shop.currency }}</div>
            </div>
            <div class="flex justify-between">
              <div>Transaction Fees</div>
              <div>2 {{ userStore.shop.currency }}</div>
            </div>
            <div class="text-md mt-2 flex justify-between font-bold">
              <div>Profit</div>
              <div>{{ 85 - 12 - 3 - 5 - 2 }} {{ userStore.shop.currency }}</div>
            </div>

            <!-- <div class="font-semibold">Product B</div>
            <ul class="list-inside list-disc">
              <li>Revenue: $100</li>
              <li>Total COGS: {{ state.cogsRate }}%</li>
              <li>Handling Fees: ${{ state.handlingFees }}</li>
              <li>Shipping Fees: $0</li>
              <li>Transaction Fees: $0</li>
              <li>Profit: $0</li>
              <li class="flex items-center justify-between">
                <span>+ Sale price</span>
                <span class="text-right"> $100</span>
              </li>
            </ul> -->

            <!-- <div class="mt-5 text-center">
              <VbenButton variant="link" size="sm">View detail </VbenButton>
            </div> -->
            <!-- <Descriptions :column="1" bordered size="small">
              <Descriptions.Item
                label="Product Price"
                :content-style="{
                  margin: 0,
                  padding: 0,
                  'white-space': 'nowrap',
                }"
              >
                100
              </Descriptions.Item>
              <Descriptions.Item label="COGS Rate">
                {{ state.cogsRate }}%
              </Descriptions.Item>
              <Descriptions.Item label="Handling Fees">
                {{ state.handlingFees }}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Fees">0</Descriptions.Item>
              <Descriptions.Item label="Transaction Fees">0</Descriptions.Item>
              <Descriptions.Item label="Total Cost">0</Descriptions.Item>
              <Descriptions.Item label="Profit">0</Descriptions.Item>
            </Descriptions> -->
          </Card>
        </div>
        <!-- {{ state }} -->
      </div>
    </Flex>
  </Page>
</template>
