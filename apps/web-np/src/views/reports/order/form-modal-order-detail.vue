<script lang="ts" setup>
import type { IOrder } from '#/shared/interfaces';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  Image as AImage,
  Button,
  Descriptions,
  DescriptionsItem,
  InputNumber,
  message,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderGetDetail, orderUpdateCostsManually } from '#/api';
import { countries } from '#/shared/constants';
import {
  calcGrossProfitMargin,
  formatMoney,
  formatReportDate,
  formatTitle,
} from '#/shared/utils';
import { useShopStore } from '#/store';

const state = reactive({
  order: {} as IOrder,
});

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      height: 48,
    },
    columns: [
      {
        field: 'productTitle',
        title: $t('page.reports-order.detailModal.product'),
        minWidth: 200,
        align: 'left',
        slots: { default: 'name' },
      },
      {
        field: 'quantityCurrent',
        title: $t('page.reports-order.detailModal.currentQuantity'),
        minWidth: 150,
      },
      {
        field: 'quantityRefund',
        title: $t('page.reports-order.detailModal.refundQuantity'),
        minWidth: 150,
      },
      {
        cellRender: { name: 'cellMoney' },
        field: 'pricePerUnit',
        title: $t('page.reports-order.detailModal.price'),
        minWidth: 200,
        align: 'right',
      },
      {
        cellRender: { name: 'cellMoney' },
        field: 'netPayment',
        title: $t('field-name.netPayment'),
        minWidth: 200,
        align: 'right',
      },
      {
        cellRender: { name: 'cellMoney' },
        field: 'cogs',
        title: $t('field-name.cogs'),
        minWidth: 200,
        align: 'right',
      },
      {
        cellRender: { name: 'cellMoney' },
        field: 'handlingFees',
        title: $t('field-name.handlingFees'),
        minWidth: 200,
        align: 'right',
      },
      {
        cellRender: { name: 'cellMoney' },
        field: 'grossProfit',
        title: $t('field-name.grossProfit'),
        minWidth: 200,
        align: 'right',
      },
    ],
    proxyConfig: {
      autoQuery: false,
      ajax: {
        query: async () => {
          const res = await orderGetDetail({
            page: 1,
            pageSize: 100,
            orderId: state.order.id,
          });

          // Calculate the grossProfit for each item
          res.items.forEach((item: any) => {
            item.grossProfit = item.netPayment - item.cogs - item.handlingFees;
          });

          return res;
        },
      },
    },
  },
});

const shopStore = useShopStore();

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      state.order = { ...modalApi.getData<{ order: any }>().order };
    }
  },
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    modalApi.lock();

    orderUpdateCostsManually({
      orderId: state.order.id,
      cogs: state.order.cogs,
      handlingFees: state.order.handlingFees,
      shippingCosts: state.order.shippingCosts,
    })
      .then(() => {
        message.success($t('page.reports-order.detailModal.updateSuccess'));
      })
      .finally(() => {
        modalApi.setData({ reload: true });
        modalApi.close();
      });
  },
});

const getCountryName = (countryCode: string) => {
  const country = countries.find((item) => item.value === countryCode);

  return country ? country.label : countryCode;
};

const calcGrossProfit = () => {
  state.order.grossProfit =
    state.order.grossSales -
    state.order.cogs -
    state.order.handlingFees -
    state.order.shippingCosts -
    state.order.transactionFees;

  return state.order.grossProfit;
};
</script>
<template>
  <Modal
    class="w-[1024px]"
    :title="$t('page.reports-order.detailModal.title')"
    :confirm-text="$t('page.reports-order.detailModal.save')"
  >
    <template #prepend-footer>
      <div class="flex-auto">
        <Button
          @click="shopStore.redirectToOrderPage(state.order.id)"
          type="dashed"
          size="small"
        >
          {{ $t('page.reports-order.detailModal.goToShopifyOrder') }}
        </Button>
      </div>
    </template>

    <Descriptions class="mx-2" size="small" bordered :column="2">
      <DescriptionsItem
        :label="$t('page.reports-order.detailModal.name')"
        class="font-bold"
      >
        {{ state.order.name }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('page.reports-order.detailModal.country')">
        {{ getCountryName(state.order.countryCode) }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('page.reports-order.detailModal.status')">
        {{ formatTitle(state.order.financialStatus) }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('page.reports-order.detailModal.processedDate')"
      >
        {{ formatReportDate(state.order.processedAt) }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('page.reports-order.detailModal.totalQuantity')"
      >
        {{ state.order.quantityTotal }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('page.reports-order.detailModal.weight')">
        {{ state.order.weight }} Kg
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('page.reports-order.detailModal.currentQuantity')"
      >
        {{ state.order.quantityCurrent }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('page.reports-order.detailModal.refundQuantity')"
      >
        {{ state.order.quantityRefund }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('field-name.grossSales')"
        class="font-bold"
        :span="2"
      >
        {{
          formatMoney(
            state.order.grossSales,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.totalDiscount')" :span="2">
        {{
          formatMoney(
            state.order.totalDiscount,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.totalRefund')" :span="2">
        {{
          formatMoney(
            state.order.totalRefund,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('field-name.netPayment')"
        class="font-bold"
        :span="2"
      >
        {{
          formatMoney(
            state.order.netPayment,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.cogs')" :span="2">
        <div class="flex items-center justify-between space-x-2">
          <span class="w-full flex-1">
            {{
              formatMoney(
                state.order.cogs,
                shopStore.shop.currencyFromApp,
                shopStore.shop.currencyRate,
              )
            }}
          </span>

          <InputNumber
            :min="0"
            :addon-after="shopStore.shop.currency"
            :addon-before="$t('page.reports-order.detailModal.edit')"
            v-model:value="state.order.cogs"
            class="max-w-300 min-w-20"
            size="small"
          />
        </div>
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.handlingFees')" :span="2">
        <div class="flex items-center justify-between space-x-2">
          <span class="w-full flex-1">
            {{
              formatMoney(
                state.order.handlingFees,
                shopStore.shop.currencyFromApp,
                shopStore.shop.currencyRate,
              )
            }}
          </span>

          <InputNumber
            :min="0"
            :addon-after="shopStore.shop.currency"
            :addon-before="$t('page.reports-order.detailModal.edit')"
            v-model:value="state.order.handlingFees"
            class="max-w-300 min-w-20"
            size="small"
          />
        </div>
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.shippingCosts')" :span="2">
        <div class="flex items-center justify-between space-x-2">
          <span class="w-full flex-1">
            {{
              formatMoney(
                state.order.shippingCosts,
                shopStore.shop.currencyFromApp,
                shopStore.shop.currencyRate,
              )
            }}
          </span>

          <InputNumber
            :min="0"
            :addon-after="shopStore.shop.currency"
            :addon-before="$t('page.reports-order.detailModal.edit')"
            v-model:value="state.order.shippingCosts"
            class="max-w-300 min-w-20"
            size="small"
          />
        </div>
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.transactionFees')">
        {{
          formatMoney(
            state.order.transactionFees,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.paymentGateway')">
        {{ formatTitle(state.order.paymentGateway) }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.grossProfit')" class="font-bold">
        {{
          formatMoney(
            calcGrossProfit(),
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          )
        }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('field-name.grossProfitMargin')">
        {{ calcGrossProfitMargin(state.order) }}%
      </DescriptionsItem>
    </Descriptions>

    <Grid
      class="my-5"
      :table-title="$t('page.reports-order.detailModal.lineItems')"
    >
      <template #name="{ row }: { row: any }">
        <div class="my-1 flex items-center justify-start space-x-2">
          <div class="h-[35px] w-[35px] flex-none">
            <AImage
              :src="row.productImage"
              fallback="/static/images/no-image.png"
              class="!h-[35px] !w-[35px] rounded-lg border"
            />
          </div>
          <div class="ml-1 shrink">
            <div>{{ row.productTitle }}</div>
            <div class="text-xs text-muted-foreground">
              {{ row.variantTitle }}
            </div>
          </div>
        </div>
      </template>
    </Grid>
  </Modal>
</template>
