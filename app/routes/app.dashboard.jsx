import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import DashboardPage from "./pages/dashboard";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    const [overview, quickStats] = await Promise.all([
      serverApi.get(request, "/dashboard/overview").catch((err) => {
        return { success: false, data: { message: "API not available", error: err.message } };
      }),
      serverApi.get(request, "/dashboard/quick-stats").catch((err) => {
        return { success: false, data: { message: "API not available", error: err.message } };
      }),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // Extract data from response structure
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      overview: overview?.data || overview || {}, 
      quickStats: quickStats?.data || quickStats || {},
      debug: isDevelopment ? {
        sessionId: session?.id,
        shop: session?.shop,
        tokenPreview: session?.accessToken?.substring(0, 30) + "...",
        timestamp: new Date().toISOString()
      } : undefined
    };
  } catch (error) {
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return {
      overview: {},
      quickStats: {},
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
      case "refreshDashboard":
        // Trigger a reload by redirecting
        return { success: true, message: "Dashboard refreshed" };
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process dashboard action"
    };
  }
};

export default DashboardPage;


