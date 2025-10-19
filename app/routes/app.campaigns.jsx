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
      serverApi.get(request, `/api/campaigns?page=${page}&pageSize=${pageSize}&status=${status}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ data: [] })),
      serverApi.get(request, "/api/campaigns/stats").catch(() => ({ data: {} })),
      serverApi.get(request, "/api/campaigns/audiences").catch(() => ({ data: [] })),
    ]);
    
    return { 
      campaigns, 
      stats, 
      audiences,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Campaigns loader error:", error);
    return { 
      campaigns: { data: [] }, 
      stats: { data: {} },
      audiences: { data: [] },
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
      case "createCampaign":
        return await serverApi.post(request, "/api/campaigns", {
          name: formData.get("name"),
          message: formData.get("message"),
          audienceId: formData.get("audienceId"),
          discountId: formData.get("discountId"),
          shop: session?.shop
        });
      
      case "updateCampaign":
        return await serverApi.put(request, `/api/campaigns/${formData.get("id")}`, {
          name: formData.get("name"),
          message: formData.get("message"),
          audienceId: formData.get("audienceId"),
          discountId: formData.get("discountId"),
          shop: session?.shop
        });
      
      case "deleteCampaign":
        return await serverApi.delete(request, `/api/campaigns/${formData.get("id")}`, {
          shop: session?.shop
        });
      
      case "sendCampaign":
        return await serverApi.post(request, `/api/campaigns/${formData.get("id")}/send`, {
          shop: session?.shop
        });
      
      case "scheduleCampaign":
        return await serverApi.post(request, `/api/campaigns/${formData.get("id")}/schedule`, {
          scheduleAt: formData.get("scheduleAt"),
          shop: session?.shop
        });
      
      case "cancelCampaign":
        return await serverApi.post(request, `/api/campaigns/${formData.get("id")}/cancel`, {
          shop: session?.shop
        });
      
      case "duplicateCampaign":
        return await serverApi.post(request, `/api/campaigns/${formData.get("id")}/duplicate`, {
          shop: session?.shop
        });
      
      case "getAudience":
        return await serverApi.get(request, `/api/campaigns/${formData.get("id")}/audience`, {
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Campaigns action error:", error);
    return { error: error.message };
  }
};

export default CampaignsPage;


