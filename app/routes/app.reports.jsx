import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import ReportsPage from "./pages/reports";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "30d";
    const campaignType = url.searchParams.get("campaignType") || "all";
    const automationType = url.searchParams.get("automationType") || "all";
    const sortBy = url.searchParams.get("sortBy") || "date";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const [overview, kpis, campaigns, automations, credits, contacts, messaging, revenue] = await Promise.all([
      serverApi.get(request, `/api/reports/overview?dateRange=${dateRange}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/kpis?dateRange=${dateRange}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/campaigns?dateRange=${dateRange}&type=${campaignType}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/automations?dateRange=${dateRange}&type=${automationType}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/credits?dateRange=${dateRange}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/contacts?dateRange=${dateRange}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/messaging?dateRange=${dateRange}`).catch(() => ({ data: {} })),
      serverApi.get(request, `/api/reports/revenue?dateRange=${dateRange}`).catch(() => ({ data: {} })),
    ]);
    
    return { 
      overview, 
      kpis, 
      campaigns, 
      automations, 
      credits, 
      contacts, 
      messaging, 
      revenue,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Reports loader error:", error);
    return {
      overview: { data: {} },
      kpis: { data: {} },
      campaigns: { data: {} },
      automations: { data: {} },
      credits: { data: {} },
      contacts: { data: {} },
      messaging: { data: {} },
      revenue: { data: {} },
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
      case "refreshReports":
        return await serverApi.post(request, "/api/reports/refresh", {
          dateRange: formData.get("dateRange"),
          shop: session?.shop
        });
      
      case "exportReports":
        return await serverApi.get(request, "/api/reports/export", {
          format: formData.get("format"),
          dateRange: formData.get("dateRange"),
          campaigns: formData.get("campaigns") === "true",
          automations: formData.get("automations") === "true",
          messaging: formData.get("messaging") === "true",
          revenue: formData.get("revenue") === "true",
          shop: session?.shop
        });
      
      case "scheduleReport":
        return await serverApi.post(request, "/api/reports/schedule", {
          dateRange: formData.get("dateRange"),
          frequency: formData.get("frequency"),
          shop: session?.shop
        });
      
      case "updateSystemHealth":
        return await serverApi.post(request, "/api/reports/system-health/update", {
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Reports action error:", error);
    return { error: error.message };
  }
};

export default ReportsPage;
