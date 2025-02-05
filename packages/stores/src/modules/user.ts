import { acceptHMRUpdate, defineStore } from 'pinia';

enum ShopState {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PROCESSING = 'processing',
}

interface IShop {
  [key: string]: any;
  countryCode: string;
  countryName: string;
  currency: string;
  domain: string;
  myshopifyDomain: string;
  plan: string;
}

interface IRegion {
  countries: string[];
  name: string;
  shippingCostLevel: string;
  shippingCostPrice: any;
  uuid: string;
}

interface IShopSettings {
  [key: string]: any;
  cogsRate: number;
  handlingFees: any;
  regions: IRegion[];
  transactionFees: {
    [key: string]: any;
  };
}

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];

  /**
   * Customized by Ethan Wilson
   */
  settings: IShopSettings;
  /**
   * Customized by Ethan Wilson
   */
  shop: IShop;

  /**
   * Customized by Ethan Wilson
   */
  state: {
    [key: string]: any;

    cogs_config: string;
    customer_sync: string;
    handling_fees_config: string;
    onboard: string;
    order_sync: string;
    product_sync: string;
    shipping_fee_config: string;
    transaction_fee_config: string;
  };

  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },

  getters: {
    defaulRegion(): IRegion {
      return this.settings.regions.find((region) => region.uuid === 'default');
    },
    isOnboarding(): boolean {
      return this.userInfo?.state.onboard === ShopState.PROCESSING;
    },
    regions(): IRegion[] {
      return this.settings.regions;
    },
    settings(): IShopSettings {
      return this.userInfo?.settings;
    },
    shop(): IShop {
      return this.userInfo?.shop;
    },
  },

  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
