export const isShopifyEmbedded = () => {
  try {
    return shopify.environment.embedded;
  } catch {
    return false;
  }
};

export const getSessionID = async () => {
  try {
    return await shopify.idToken();
  } catch {
    return '';
  }
};

export const getShopifyDomain = () => {
  try {
    return shopify.config.shop;
  } catch {
    return '';
  }
};
