import { useWatermark } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { findCurrency, format } from 'currency-formatter';

import { router } from '#/router';
import { useShopStore } from '#/store';

import { adType } from './constants';
import { dayjsInGMT } from './dayjs';

export function calcPercentage(a: number, b: number) {
  if (!b) {
    return 0;
  }

  return ((a / b) * 100).toFixed(0);
}

export function calcGrossProfitMargin(item: any) {
  const grossProfit = Number(item.grossProfit);
  const netPayment = Number(item.netPayment);

  return calcPercentage(grossProfit, netPayment);
}

export function getCurrencySymbol(currency: string) {
  const e = findCurrency(currency);

  return e ? e.symbol : currency;
}

export function formatTitle(title: string) {
  return title
    .replaceAll('_', ' ')
    .replaceAll(/\b\w/g, (l: any) => l.toUpperCase());
}

export function formatMoney(
  val: any,
  currency: any = null,
  rate = 1,
  precision = 2,
) {
  const amount = convertRate(val, rate);

  return format(amount, {
    code: currency,
    precision,
    thousand: ',',
    decimal: '.',
  });
}

export function convertRate(val: any, rate = 1) {
  return val * rate;
}

export function toPercentage(rate: number): string {
  return format(rate * 100, { precision: 2 });
}

export function toRate(number: number): number {
  return number / 100;
}

export function numberWithCommas(x: any) {
  return x.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatReportDate(date: any, fmtDate = 'YYYY-MM-DD') {
  return dayjsInGMT(date).format(fmtDate);
}

export const getFieldExplain = (id: string) => {
  switch (id) {
    case 'cogs': {
      return $t('field-name.cogsExplain');
    }

    case 'grossProfit': {
      return $t('field-name.grossProfitExplain');
    }

    case 'grossSales': {
      return $t('field-name.grossSalesExplain');
    }

    case 'netPayment': {
      return $t('field-name.netPaymentExplain');
    }

    case 'netProfit': {
      return $t('field-name.netProfitExplain');
    }

    case 'netProfitMargin': {
      return $t('field-name.netProfitMarginExplain');
    }

    case 'totalCustomCost': {
      return $t('field-name.totalCustomCostExplain');
    }

    default: {
      return '';
    }
  }
};

export const getDatePreset = (
  presets: string[],
  isDateRange: boolean = false,
) => {
  const datePresets = [
    {
      id: 'today',
      label: $t('page.date-presets.today'),
      value: dayjsInGMT(),
    },
    {
      id: 'last7Days',
      label: $t('page.date-presets.last7Days'),
      value: dayjsInGMT().add(-6, 'd'),
    },
    {
      id: 'last14Days',
      label: $t('page.date-presets.last14Days'),
      value: dayjsInGMT().add(-13, 'd'),
    },
    {
      id: 'lastMonth',
      label: $t('page.date-presets.lastMonth'),
      value: dayjsInGMT().add(-1, 'month').add(1, 'day'),
    },
    {
      id: 'last2Months',
      label: $t('page.date-presets.last2Months'),
      value: dayjsInGMT().add(-2, 'month').add(1, 'day'),
    },
    {
      id: 'last3Months',
      label: $t('page.date-presets.last3Months'),
      value: dayjsInGMT().add(-3, 'month').add(1, 'day'),
    },
    {
      id: 'last6Months',
      label: $t('page.date-presets.last6Months'),
      value: dayjsInGMT().add(-6, 'month').add(1, 'day'),
    },
    {
      id: 'lastYear',
      label: $t('page.date-presets.lastYear'),
      value: dayjsInGMT().add(-1, 'year').add(1, 'day'),
    },
    {
      id: 'previousMonth',
      label: $t('page.date-presets.previousMonth'),
      value: dayjsInGMT().add(-1, 'month').startOf('month'),
    },
    {
      id: 'thisMonth',
      label: $t('page.date-presets.thisMonth'),
      value: dayjsInGMT().startOf('month'),
    },
    {
      id: 'thisYear',
      label: $t('page.date-presets.thisYear'),
      value: dayjsInGMT().startOf('year'),
    },
  ];

  const result = datePresets.filter((item) => presets.includes(item.id));

  if (isDateRange) {
    return result.map((item) => {
      let today = dayjsInGMT();

      if (item.id === 'previousMonth') {
        today = dayjsInGMT().add(-1, 'month').endOf('month');
      }

      return {
        label: item.label,
        value: [item.value, today],
      };
    });
  }

  return result;
};

export const redirect = (name: string) => {
  router.push({
    name,
  });
};

export const redirectToPath = (path: string) => {
  router.push(path);
};

export const redirectToExternal = (url: string, newTab: boolean = false) => {
  window.open(url, newTab ? '_blank' : '_top');
};

export const authInNewTab = () => {
  const accessStore = useAccessStore();
  const url = `${window.location.origin}/auth/token?token=${accessStore.accessToken}`;

  redirectToExternal(url);
};

export const getAdsIcon = (type: string) => {
  const val = adType.find((item) => item.value === type)?.icon;
  return val || 'ant-design:question-circle-outlined';
};

export const showWatermark = (parent: string = '.vxe-table--main-wrapper') => {
  const shopStore = useShopStore();
  const { updateWatermark } = useWatermark();

  setTimeout(() => {
    if (!shopStore.isFreeSubscription) {
      return;
    }

    updateWatermark({
      parent,
      contentType: 'image',
      image: '/static/images/logo-text-512.png',
      width: 200,
      height: 200,
      imageWidth: 100, // image width
    });
  }, 1000);
};

export const calcLTV = (newCustomers: number, netPayment: number) => {
  return newCustomers ? netPayment / newCustomers : 0;
};
