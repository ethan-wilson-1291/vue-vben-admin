import { Crisp } from 'crisp-sdk-web';

export const initCrisp = () => {
  Crisp.configure(import.meta.env.VITE_GLOB_CRISP_WEBSITE_ID);
};

export const scrispSetShopInfo = (shopInfo: any) => {
  Crisp.setTokenId(shopInfo.userId);
  Crisp.session.reset();
  Crisp.session.setData({
    shopify_domain: shopInfo.shop.myshopifyDomain,
  });
  Crisp.user.setNickname(shopInfo.realName);
  Crisp.user.setEmail(shopInfo.email);
};

export const crispOpenWithText = (obj: any) => {
  Crisp.chat.open();
  Crisp.message.send('text', obj);
};

export const crispDisplay = (show: boolean) => {
  if (show) {
    Crisp.chat.show();
  } else {
    Crisp.chat.hide();
  }
};
