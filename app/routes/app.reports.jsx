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

    // Parse date range to from/to dates
    const toDate = new Date();
    const fromDate = new Date();
    if (dateRange === "7d") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (dateRange === "30d") {
      fromDate.setDate(fromDate.getDate() - 30);
    } else if (dateRange === "90d") {
      fromDate.setDate(fromDate.getDate() - 90);
    }
    const from = fromDate.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];

    const [overview, campaigns, automations, credits, contacts, messaging] = await Promise.all([
      serverApi.get(request, `/reports/overview?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
      serverApi.get(request, `/reports/campaigns?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
      serverApi.get(request, `/reports/automations?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
      serverApi.get(request, `/reports/credits?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
      serverApi.get(request, `/reports/contacts?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
      serverApi.get(request, `/reports/messaging?from=${from}&to=${to}`).catch(() => ({ success: false, data: {} })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      overview: overview?.data || {}, 
      campaigns: campaigns?.data || {}, 
      automations: automations?.data || {}, 
      credits: credits?.data || {}, 
      contacts: contacts?.data || {}, 
      messaging: messaging?.data || {},
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
      overview: {},
      campaigns: {},
      automations: {},
      credits: {},
      contacts: {},
      messaging: {},
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
      case "exportReports": {
        const fromDate = formData.get("from");
        const toDate = formData.get("to");
        return await serverApi.get(request, `/reports/export?type=${formData.get("type") || "campaigns"}&format=${formData.get("format") || "csv"}&from=${fromDate}&to=${toDate}`);
      }
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process reports action"
    };
  }
};

export default ReportsPage;
