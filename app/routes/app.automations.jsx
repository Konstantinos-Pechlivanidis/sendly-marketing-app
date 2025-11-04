import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import AutomationsPage from "./pages/automations";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";

    const [automations, stats] = await Promise.all([
      serverApi.get(request, `/automations?status=${status}&type=${type}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ success: false, data: { automations: [] } })),
      serverApi.get(request, "/automations/stats").catch(() => ({ success: false, data: {} })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      automations: automations?.data || { automations: [] }, 
      stats: stats?.data || {},
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
      automations: { automations: [] }, 
      stats: {},
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
      case "updateAutomation":
        // Backend only supports updating userMessage and isActive
        return await serverApi.put(request, `/automations/${formData.get("id")}`, {
          userMessage: formData.get("userMessage") || formData.get("message"),
          isActive: formData.get("isActive") === "true"
        });
      
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
