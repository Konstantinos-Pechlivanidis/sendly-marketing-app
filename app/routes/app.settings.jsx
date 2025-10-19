import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import SettingsPage from "./pages/settings";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    const [balance, transactions, packages, settings, contactStats, systemHealth] = await Promise.all([
      serverApi.get(request, "/api/billing/balance").catch(() => ({ data: {} })),
      serverApi.get(request, "/api/billing/transactions").catch(() => ({ data: [] })),
      serverApi.get(request, "/api/billing/packages").catch(() => ({ data: [] })),
      serverApi.get(request, "/api/settings").catch(() => ({ data: {} })),
      serverApi.get(request, "/api/contacts/stats").catch(() => ({ data: {} })),
      serverApi.get(request, "/health").catch(() => ({ data: {} })), // Re-using /health for system health
    ]);
    
    return { 
      balance, 
      transactions, 
      packages, 
      settings, 
      contactStats, 
      systemHealth,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Settings loader error:", error);
    return {
      balance: { data: {} },
      transactions: { data: [] },
      packages: { data: [] },
      settings: { data: {} },
      contactStats: { data: {} },
      systemHealth: { data: {} },
      debug: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  
  try {
    const { session } = await authenticate.admin(request);
    
    switch (action) {
      case "purchasePackage":
        return await serverApi.post(request, "/api/billing/purchase", {
          packageId: formData.get("packageId"),
          shop: session?.shop
        });
      
      case "saveSettings":
        return await serverApi.post(request, "/api/settings", {
          smsProvider: {
            apiKey: formData.get("providerApiKey"),
            senderId: formData.get("senderId")
          },
          shop: session?.shop
        });
      
      case "saveBillingSettings":
        return await serverApi.post(request, "/api/settings/billing", {
          autoRecharge: formData.get("autoRecharge") === "true",
          autoRechargeAmount: parseInt(formData.get("autoRechargeAmount") || "0"),
          lowBalanceAlert: formData.get("lowBalanceAlert") === "true",
          lowBalanceThreshold: parseInt(formData.get("lowBalanceThreshold") || "0"),
          shop: session?.shop
        });
      
      case "processPayment":
        return await serverApi.post(request, "/api/billing/process-payment", {
          packageId: formData.get("packageId"),
          paymentMethod: formData.get("paymentMethod"),
          amount: parseFloat(formData.get("amount") || "0"),
          shop: session?.shop
        });
      
      case "submitSupport":
        return await serverApi.post(request, "/api/support/ticket", {
          subject: formData.get("subject"),
          message: formData.get("message"),
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Settings action error:", error);
    return { error: error.message };
  }
};

export default SettingsPage;


