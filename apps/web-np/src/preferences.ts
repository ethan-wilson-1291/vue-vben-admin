import { defineOverridesPreferences } from '@vben/preferences';

import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';

export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    locale: 'en-US',
    enablePreferences: false,
    enableCheckUpdates: false,
  },
  theme: {
    mode: 'light',
    radius: '0.25',
  },
  widget: {
    languageToggle: false,
    lockScreen: false,
    fullscreen: !isShopifyEmbedded(),
  },
  tabbar: {
    enable: false,
  },
  navigation: {
    accordion: false,
  },
  copyright: {
    companyName: 'Finily',
    companySiteLink: 'https://www.finily.com',
  },
  logo: {
    source: '/static/images/logo.png',
  },
});
