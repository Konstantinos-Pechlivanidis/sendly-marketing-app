import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import SettingsPage from "./pages/settings";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    const [balance, transactions, billingHistory, packages, settings, account] = await Promise.all([
      serverApi.get(request, "/billing/balance").catch(() => ({ success: false, data: {} })),
      serverApi.get(request, "/billing/history").catch(() => ({ success: false, data: { transactions: [], pagination: {} } })),
      serverApi.get(request, "/billing/billing-history").catch(() => ({ success: false, data: { transactions: [], pagination: {} } })),
      serverApi.get(request, "/billing/packages").catch(() => ({ success: false, data: [] })),
      serverApi.get(request, "/settings").catch(() => ({ success: false, data: {} })),
      serverApi.get(request, "/settings/account").catch(() => ({ success: false, data: {} })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      balance: balance?.data || {}, 
      transactions: transactions?.data || { transactions: [], pagination: {} }, 
      billingHistory: billingHistory?.data || { transactions: [], pagination: {} },
      packages: Array.isArray(packages?.data) ? packages.data : packages?.data?.packages || [], 
      settings: settings?.data || {},
      account: account?.data || {},
      debug: isDevelopment ? {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      } : undefined
    };
  } catch (error) {
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return {
      balance: {},
      transactions: { transactions: [], pagination: {} },
      billingHistory: { transactions: [], pagination: {} },
      packages: [],
      settings: {},
      account: {},
      debug: isDevelopment ? {
        error: error.message,
        timestamp: new Date().toISOString()
      } : undefined
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  
  try {
    await authenticate.admin(request);
    
    switch (action) {
      case "purchasePackage":
        return await serverApi.post(request, "/billing/purchase", {
          packageId: formData.get("packageId"),
          successUrl: formData.get("successUrl") || `${new URL(request.url).origin}/app/settings`,
          cancelUrl: formData.get("cancelUrl") || `${new URL(request.url).origin}/app/settings`
        });
      
      case "saveSettings":
        return await serverApi.put(request, "/settings/sender", {
          senderNumber: formData.get("senderNumber") || formData.get("providerApiKey"),
          senderName: formData.get("senderName") || formData.get("senderId")
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process settings action"
    };
  }
};

export default SettingsPage;


