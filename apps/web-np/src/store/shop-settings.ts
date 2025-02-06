import { defineStore } from 'pinia';

export interface ITransactionFee {
  externalFeePercentage: any;
  fixedFee: any;
  handleName: string;
  name: string;
  percentageFee: any;
  uuid: string;
}

interface IRegion {
  countries: string[];
  name: string;
  shippingCostLevel: any;
  shippingCostPrice: any;
  uuid: string;
}

interface IShopSettings {
  cogsRate: number;
  handlingFees: any;
  regions: IRegion[];
  transactionFees: ITransactionFee[];
}

export const useShopSettingStore = defineStore('np-shop-setting', {
  actions: {
    setStates(settings: any) {
      this.cogsRate = settings.cogsRate;
      this.handlingFees = settings.handlingFees;
      this.regions = settings.regions;
      this.transactionFees = settings.transactionFees;
    },
  },

  getters: {
    defaulRegion(): IRegion {
      return this.regions.find((region) => region.uuid === 'default');
    },
  },

  state: (): IShopSettings => ({
    cogsRate: 0,
    handlingFees: {},
    regions: [],
    transactionFees: [],
  }),
});
