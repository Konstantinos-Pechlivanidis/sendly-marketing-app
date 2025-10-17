import { serverApi } from "../utils/api.server";
import SettingsPage from "./pages/settings";

export const loader = async ({ request }) => {
  try {
    const [balance, transactions, packages, contactStats, systemHealth, settings] = await Promise.all([
      serverApi.get(request, "/billing/balance").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/billing/transactions").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/billing/packages").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/contacts/stats/summary").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/health/full").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/settings").catch(() => ({ smsProvider: {} })),
    ]);
    return { balance, transactions, packages, contactStats, systemHealth, settings };
  } catch (error) {
    console.error("Settings loader error:", error);
    return {
      balance: { message: "Failed to load" },
      transactions: { message: "Failed to load" },
      packages: { message: "Failed to load" },
      contactStats: { message: "Failed to load" },
      systemHealth: { message: "Failed to load" },
      settings: { smsProvider: {} }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "saveSettings") {
    try {
      await serverApi.put(request, "/settings", { 
        smsProvider: { 
          apiKey: values.providerApiKey, 
          senderId: values.senderId 
        } 
      });
      return { success: true };
    } catch (error) {
      console.error("Save settings error:", error);
      return { success: false, error: error.message };
    }
  }
  return null;
};

export default SettingsPage;


