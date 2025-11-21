export const isShopifyEmbedded = () => {
  try {
    return shopify.environment.embedded;
  } catch {
    return false;
  }
};
