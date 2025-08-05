// Auto-inject styles for the web component
export function injectStyles() {
  // Check if styles are already injected
  if (document.querySelector('#shopify-rv-app-styles')) {
    return;
  }

  const styleId = 'shopify-rv-app-styles';
  const existingStyle = document.querySelector(`#${styleId}`);

  if (!existingStyle) {
    // Create a link element to load the CSS
    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';

    // Try to get the CSS path relative to the script
    const scripts = document.querySelectorAll('script[src*="shopify-rv-app"]');
    if (scripts.length > 0) {
      const scriptSrc = (scripts[scripts.length - 1] as HTMLScriptElement).src;
      const basePath = scriptSrc.replace(/[^/]+$/, '');
      link.href = `${basePath}shopify-rv-app.css`;
    } else {
      // Fallback to relative path
      link.href = 'shopify-rv-app.css';
    }

    document.head.append(link);
  }
}
