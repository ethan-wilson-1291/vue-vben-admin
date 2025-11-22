export const isShopifyEmbedded = () => {
  try {
    return shopify.environment.embedded;
  } catch {
    return false;
  }
};

export const redirectFromShopify = (url: string, force: boolean = false) => {
  // eslint-disable-next-line no-console
  console.log('Shopify redirect', url, force);

  return null;
};
