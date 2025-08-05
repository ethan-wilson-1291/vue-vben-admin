import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/web-component.ts'),
      name: 'ShopifyRvApp',
      fileName: 'shopify-rv-app',
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
});
