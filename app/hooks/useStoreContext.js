/**
 * useStoreContext - Hook for accessing store-specific context and data
 */

import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children, initialData }) {
  const [storeData, setStoreData] = useState(initialData || null);
  const [shopDomain, setShopDomain] = useState(null);

  useEffect(() => {
    // Get shop domain from Shopify context
    if (typeof window !== 'undefined') {
      const domain = window.shopify?.config?.shop?.myshopifyDomain || 
                     window.ENV?.SHOP_DOMAIN;
      setShopDomain(domain);
    }
  }, []);

  const updateStoreData = (data) => {
    setStoreData(data);
  };

  const value = {
    storeData,
    shopDomain,
    updateStoreData,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      storeData: null,
      shopDomain: typeof window !== 'undefined' ? 
        (window.shopify?.config?.shop?.myshopifyDomain || window.ENV?.SHOP_DOMAIN) : 
        null,
      updateStoreData: () => {},
    };
  }
  
  return context;
}

export default useStoreContext;

