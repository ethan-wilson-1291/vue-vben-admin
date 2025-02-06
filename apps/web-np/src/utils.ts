import { findCurrency, format } from 'currency-formatter';

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

export function formatMoney(val: any, currency: any) {
  return format(val, { code: currency });
}

export function toPercentage(rate: number): number {
  return Number.parseFloat((rate * 100).toFixed(2));
}

export function toRate(number: number): number {
  return number / 100;
}
