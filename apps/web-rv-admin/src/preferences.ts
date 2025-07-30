import { defineOverridesPreferences } from '@vben/preferences';

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
  sidebar: {
    enable: false,
  },
  widget: {
    languageToggle: false,
    lockScreen: false,
  },
  tabbar: {
    enable: false,
  },
  navigation: {
    accordion: false,
  },
  copyright: {
    companyName: 'Riko',
    companySiteLink: 'https://www.riko.app',
  },
  logo: {
    source: '/static/images/logo.png',
  },
});
