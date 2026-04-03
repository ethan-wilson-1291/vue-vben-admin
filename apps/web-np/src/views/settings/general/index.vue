<script lang="ts" setup>
import { computed, h, reactive } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import { cogsSoures, timezones } from '#/shared/constants';
import { toPercentage } from '#/shared/utils';
import { useCurrencyStore, useShopSettingStore, useShopStore } from '#/store';

const userStore = useUserStore();
const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();
const currencyStore = useCurrencyStore();

const state = reactive({
  appCurrency: shopStore.shop.currencyFromApp,
  currencyRate: '',
});

const displayRate = computed(() => {
  return currencyStore.getDisplayRate(
    shopStore.shop.currency,
    state.appCurrency,
  );
});

const [ShopSettingForm, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  handleSubmit: onSubmit,
  handleValuesChange: (values) => {
    state.appCurrency = values.appCurrency;
    formApi.updateSchema([
      {
        fieldName: 'currencyRate',
        hideLabel: state.appCurrency === shopStore.shop.currency,
      },
    ]);
  },
  submitButtonOptions: {
    class: 'w-28',
  },
  resetButtonOptions: {
    class: 'w-28',
  },
  layout: 'horizontal',
  schema: [
    {
      component: h('span', shopStore.shop.id),
      fieldName: 'id',
      label: $t('page.settings-general.form.shopId'),
    },
    {
      component: h('span', userStore.userInfo?.username),
      fieldName: 'name',
      label: $t('page.settings-general.form.name'),
    },
    {
      component: h(
        'span',
        shopStore.shop.domain ?? shopStore.shop.myshopifyDomain,
      ),
      fieldName: 'domain',
      label: $t('page.settings-general.form.domain'),
    },
    {
      component: h('span'),
      labelClass: 'font-bold',
      formItemClass: 'font-bold',
      fieldName: 'subscriptionName',
      label: $t('page.settings-general.form.subscription'),
    },
    {
      component: h('span', userStore.userInfo?.realName),
      fieldName: 'ownerName',
      label: $t('page.settings-general.form.owner'),
    },
    {
      component: h('span', userStore.userInfo?.email),
      fieldName: 'ownerEmail',
      label: $t('page.settings-general.form.email'),
    },
    {
      component: 'Select',
      componentProps: {
        filterOption: true,
        options: timezones.map((item) => ({
          label: item,
          value: item,
        })),
        showSearch: true,
      },
      defaultValue: shopStore.shop.timezone,
      fieldName: 'timezone',
      help: $t('page.settings-general.help.timezone'),
      label: $t('page.settings-general.form.timezone'),
    },
    {
      component: 'Divider',
      fieldName: '_dividerss',
      renderComponentContent: () => {
        return {
          default: () =>
            h('div', $t('page.settings-general.section.cogsAndHandlingFees')),
        };
      },
      hideLabel: true,
      formItemClass: 'col-span-1 md:col-span-2 lg:col-span-3 !my-0 !py-0',
      componentProps: {
        dashed: true,
        orientation: 'left',
        plain: true,
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        max: 100,
        min: 0,
        addonAfter: '%',
      },
      help: $t('page.settings-general.help.defaultRate'),
      defaultValue: toPercentage(shopSettingStore.cogsRate),
      fieldName: 'cogsRate',
      label: $t('page.settings-general.form.defaultRate'),
    },
    {
      component: 'Select',
      help: $t('page.settings-general.help.source'),
      fieldName: 'cogsSource',
      label: $t('page.settings-general.form.source'),
      defaultValue: shopSettingStore.cogsSourceDefault,
      componentProps: {
        options: cogsSoures.map((item) => ({
          ...item,
          label: item.labelKey ? $t(item.labelKey) : item.label,
        })),
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        // controls: false,
        addonAfter: shopStore.shop.currency,
      },
      help: $t('page.settings-general.help.handlingFees'),
      defaultValue: shopSettingStore.handlingFees,
      fieldName: 'handlingFees',
      label: $t('page.settings-general.form.handlingFees'),
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      renderComponentContent: () => {
        return {
          default: () =>
            h(
              'div',
              $t('page.settings-general.section.currencyConverterDisplay'),
            ),
        };
      },
      hideLabel: true,
      formItemClass: 'col-span-1 md:col-span-2 lg:col-span-3 !my-0 !py-0',
      componentProps: {
        dashed: true,
        orientation: 'left',
        plain: true,
      },
    },
    {
      component: h('span', shopStore.shop.currency),
      fieldName: 'shopCurrency',
      help: $t('page.settings-general.help.fromShopify'),
      formItemClass: 'col-start-1',
      label: $t('page.settings-general.form.fromShopify'),
    },
    {
      component: 'Select',
      componentProps: {
        filterOption: true,
        options: currencyStore.rates.map((item) => ({
          label: item.currency,
          value: item.currency,
        })),
        showSearch: true,
      },
      defaultValue: shopStore.shop.currencyFromApp,
      fieldName: 'appCurrency',
      help: $t('page.settings-general.help.appDisplay'),
      label: $t('page.settings-general.form.appDisplay'),
    },
    {
      component: h('span'),
      fieldName: 'currencyRate',
      label: $t('page.settings-general.form.rate'),
      hideLabel: state.appCurrency === shopStore.shop.currency,
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  formApi.setState({
    submitButtonOptions: {
      loading: true,
    },
  });

  shopStore.updateSetting(values).then(() => {
    formApi.setState({
      submitButtonOptions: {
        loading: false,
      },
    });
    message.success({
      content: $t('page.settings-general.message.savedSuccess'),
    });
  });
}
</script>

<template>
  <Page auto-content-height>
    <Card :title="$t('page.settings-general.cardTitle')">
      <ShopSettingForm>
        <template #currencyRate>
          <span v-if="state.appCurrency !== shopStore.shop.currency">{{
            displayRate
          }}</span>
        </template>
        <template #subscriptionName>
          <VbenButton
            variant="link"
            class="pl-0"
            @click="shopStore.redirectToPricing"
          >
            {{ shopStore.shop.subscriptionName }}
            {{ $t('page.settings-general.planSuffix') }}
          </VbenButton>
        </template>
      </ShopSettingForm>
    </Card>
  </Page>
</template>
