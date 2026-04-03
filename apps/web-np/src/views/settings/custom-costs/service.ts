export enum CustomCostType {
  DAILY = 'daily',
  GROSS_PROFIT_PERCENTAGE = 'gross_profit_percentage',
  GROSS_SALE_PERCENTAGE = 'gross_sale_percentage',
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
  REVENUE_PERCENTAGE = 'revenue_percentage',
  WEEKLY = 'weekly',
}

export const customCostTypes = [
  {
    value: CustomCostType.MONTHLY,
    labelKey: 'page.settings-custom-costs.typeOptions.monthly',
    label: 'Monthly',
  },
  {
    value: CustomCostType.WEEKLY,
    labelKey: 'page.settings-custom-costs.typeOptions.weekly',
    label: 'Weekly',
  },
  {
    value: CustomCostType.DAILY,
    labelKey: 'page.settings-custom-costs.typeOptions.daily',
    label: 'Daily',
  },
  {
    value: CustomCostType.ONE_TIME,
    labelKey: 'page.settings-custom-costs.typeOptions.oneTime',
    label: 'One-time',
  },
  {
    value: CustomCostType.GROSS_SALE_PERCENTAGE,
    labelKey: 'page.settings-custom-costs.typeOptions.grossSalePercentage',
    label: '% of Gross Sale',
  },
  {
    value: CustomCostType.REVENUE_PERCENTAGE,
    labelKey: 'page.settings-custom-costs.typeOptions.revenuePercentage',
    label: '% of Revenue',
  },
  {
    value: CustomCostType.GROSS_PROFIT_PERCENTAGE,
    labelKey: 'page.settings-custom-costs.typeOptions.grossProfitPercentage',
    label: '% of Gross Profit',
  },
];
