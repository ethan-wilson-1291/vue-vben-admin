import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fs } from '@vben/node-utils';

import { type PluginOption } from 'vite';

/**
 * 用于生成将loading样式注入到项目中
 * 为多app提供loading样式，无需在每个 app -> index.html单独引入
 */
async function viteInjectAppLoadingPlugin(
  isBuild: boolean,
  env: Record<string, any> = {},
  loadingTemplate = 'loading.html',
): Promise<PluginOption | undefined> {
  const loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate);
  const envRaw = isBuild ? 'prod' : 'dev';
  const cacheName = `'${env.VITE_APP_NAMESPACE}-${envRaw}-preferences-theme'`;

  // 获取缓存的主题
  // 保证黑暗主题下，刷新页面时，loading也是黑暗主题
  const injectScript = `
  <script data-app-loading="inject-js">
  var theme = localStorage.getItem(${cacheName});
  document.documentElement.classList.toggle('dark', /dark/.test(theme));
</script>
`;

  if (!loadingHtml) {
    return;
  }

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        const re = /<body\s*>/;
        html = html.replace(re, `<body>${injectScript}${loadingHtml}`);
        return html;
      },
      order: 'pre',
    },
  };
}

/**
 * 用于获取loading的html模板
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const defaultLoadingPath = join(__dirname, './default-loading.html');
  // 支持在app内自定义loading模板，模版参考default-loading.html即可
  const appLoadingPath = join(process.cwd(), loadingTemplate);
  let loadingPath = defaultLoadingPath;

  if (fs.existsSync(appLoadingPath)) {
    loadingPath = appLoadingPath;
    return;
  }

  const htmlRaw = await fs.readFile(loadingPath, 'utf8');
  return htmlRaw;
}

export { viteInjectAppLoadingPlugin };