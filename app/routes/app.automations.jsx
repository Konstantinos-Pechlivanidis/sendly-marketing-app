import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import { buildQueryString } from "../utils/query-params.server";
import AutomationsPage from "./pages/automations";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    
    // Build query parameters - backend doesn't have search param for automations
    // Automations endpoint returns all automations for the shop
    const [automations, stats, defaults] = await Promise.all([
      serverApi.get(request, "/automations").catch(() => ({ success: false, data: [] })),
      serverApi.get(request, "/automations/stats").catch(() => ({ success: false, data: {} })),
      serverApi.get(request, "/automations/defaults").catch(() => ({ success: false, data: [] })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // Automations endpoint returns array directly, not wrapped
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      automations: Array.isArray(automations?.data) ? automations.data : [], 
      stats: stats?.data || {},
      defaults: Array.isArray(defaults?.data) ? defaults.data : [],
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
      automations: [], 
      stats: {},
      defaults: [],
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
      case "updateAutomation": {
        // Backend only supports updating userMessage and isActive
        const result = await serverApi.put(request, `/automations/${formData.get("id")}`, {
          userMessage: formData.get("userMessage") || formData.get("message"),
          isActive: formData.get("isActive") === "true" || formData.get("isActive") === true
        });
        return result;
      }
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process automation action"
    };
  }
};

export default AutomationsPage;
