import { defineCustomElement } from 'vue';

import App from './App.vue';
import { injectStyles } from './style-injector';

import '@core-rv/components/style.css';
import './style.css';

// Auto-inject styles when the component loads
injectStyles();

// Define the custom element
const ShopifyRvApp = defineCustomElement(App);

// Register the custom element
customElements.define('shopify-rv-app', ShopifyRvApp);

// Export for usage in other environments
export { ShopifyRvApp };
