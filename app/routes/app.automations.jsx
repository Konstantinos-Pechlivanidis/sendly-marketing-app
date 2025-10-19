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

    const [automations, stats, triggers] = await Promise.all([
      serverApi.get(request, `/api/automations?status=${status}&type=${type}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ data: [] })),
      serverApi.get(request, "/api/automations/stats").catch(() => ({ data: {} })),
      serverApi.get(request, "/api/automations/triggers").catch(() => ({ data: [] })),
    ]);
    
    return { 
      automations, 
      stats, 
      triggers,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Automations loader error:", error);
    return { 
      automations: { data: [] }, 
      stats: { data: {} },
      triggers: { data: [] },
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
      case "createAutomation":
        return await serverApi.post(request, "/api/automations", {
          name: formData.get("name"),
          type: formData.get("type"),
          message: formData.get("message"),
          trigger: formData.get("trigger"),
          schedule: JSON.parse(formData.get("schedule") || "{}"),
          conditions: JSON.parse(formData.get("conditions") || "[]"),
          shop: session?.shop
        });
      
      case "updateAutomation":
        return await serverApi.put(request, `/api/automations/${formData.get("id")}`, {
          name: formData.get("name"),
          message: formData.get("message"),
          schedule: JSON.parse(formData.get("schedule") || "{}"),
          conditions: JSON.parse(formData.get("conditions") || "[]"),
          shop: session?.shop
        });
      
      case "deleteAutomation":
        return await serverApi.delete(request, `/api/automations/${formData.get("id")}`, {
          shop: session?.shop
        });
      
      case "toggleAutomation":
        return await serverApi.post(request, `/api/automations/${formData.get("id")}/toggle`, {
          enabled: formData.get("enabled") === "true",
          shop: session?.shop
        });
      
      case "resetAutomation":
        return await serverApi.post(request, `/api/automations/${formData.get("id")}/reset`, {
          shop: session?.shop
        });
      
      case "testAutomation":
        return await serverApi.post(request, `/api/automations/${formData.get("id")}/test`, {
          shop: session?.shop
        });
      
      case "duplicateAutomation":
        return await serverApi.post(request, `/api/automations/${formData.get("id")}/duplicate`, {
          shop: session?.shop
        });
      
      case "exportAutomations":
        return await serverApi.get(request, "/api/automations/export", {
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Automations action error:", error);
    return { error: error.message };
  }
};

export default AutomationsPage;
