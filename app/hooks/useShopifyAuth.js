/**
 * useShopifyAuth - Hook for Shopify authentication and context
 */

import { useState, useEffect } from 'react';

export function useShopifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if running in Shopify context
    if (typeof window !== 'undefined') {
      // Check for Shopify App Bridge
      if (window.shopify?.config?.shop) {
        setShop(window.shopify.config.shop);
        setIsAuthenticated(true);
      } else if (window.ENV?.SHOP_DOMAIN) {
        setShop({ myshopifyDomain: window.ENV.SHOP_DOMAIN });
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    shop,
    shopDomain: shop?.myshopifyDomain || null,
    loading,
  };
}

export default useShopifyAuth;

