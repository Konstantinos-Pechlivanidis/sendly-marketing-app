import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import CampaignsPage from "./pages/campaigns";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "20";
    const status = url.searchParams.get("status") || "";
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const [campaigns, stats, audiences] = await Promise.all([
      serverApi.get(request, `/campaigns?page=${page}&pageSize=${pageSize}&status=${status}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ success: false, data: { campaigns: [], pagination: {} } })),
      serverApi.get(request, "/campaigns/stats/summary").catch(() => ({ success: false, data: {} })),
      serverApi.get(request, "/audiences").catch(() => ({ success: false, data: { audiences: [] } })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      campaigns: campaigns?.data || { campaigns: [], pagination: {} }, 
      stats: stats?.data || {}, 
      audiences: audiences?.data || { audiences: [] },
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
      campaigns: { campaigns: [], pagination: {} }, 
      stats: {},
      audiences: { audiences: [] },
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
      case "createCampaign":
        return await serverApi.post(request, "/campaigns", {
          name: formData.get("name"),
          message: formData.get("message"),
          audience: formData.get("audience") || formData.get("audienceId") || "all",
          discountId: formData.get("discountId") || null,
          scheduleType: formData.get("scheduleType") || "immediate",
          scheduleAt: formData.get("scheduleAt") || null,
          recurringDays: formData.get("recurringDays") ? parseInt(formData.get("recurringDays")) : null
        });
      
      case "updateCampaign":
        return await serverApi.put(request, `/campaigns/${formData.get("id")}`, {
          name: formData.get("name"),
          message: formData.get("message"),
          audience: formData.get("audience") || formData.get("audienceId") || null,
          discountId: formData.get("discountId") || null
        });
      
      case "deleteCampaign":
        return await serverApi.delete(request, `/campaigns/${formData.get("id")}`);
      
      case "prepareCampaign":
        return await serverApi.post(request, `/campaigns/${formData.get("id")}/prepare`);
      
      case "sendCampaign":
        return await serverApi.post(request, `/campaigns/${formData.get("id")}/send`);
      
      case "scheduleCampaign":
        return await serverApi.put(request, `/campaigns/${formData.get("id")}/schedule`, {
          scheduleType: formData.get("scheduleType") || "scheduled",
          scheduleAt: formData.get("scheduleAt")
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process campaign action"
    };
  }
};

export default CampaignsPage;


