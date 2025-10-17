import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import DashboardPage from "./pages/dashboard";

export const loader = async ({ request }) => {
  console.log("🔥 Dashboard loader called");
  
  try {
    // Get session info for debugging
    const { session } = await authenticate.admin(request);
    console.log("📋 Session Details:", {
      shop: session?.shop,
      id: session?.id,
      hasAccessToken: !!session?.accessToken,
      tokenPreview: session?.accessToken?.substring(0, 30) + "...",
      isOnline: session?.isOnline,
      scope: session?.scope,
    });

    const [overview, quickStats, health] = await Promise.all([
      serverApi.get(request, "/dashboard/overview").catch((err) => {
        console.error("❌ Overview API error:", err.message);
        return { data: { message: "API not available", error: err.message } };
      }),
      serverApi.get(request, "/dashboard/quick-stats").catch((err) => {
        console.error("❌ Quick stats API error:", err.message);
        return { data: { message: "API not available", error: err.message } };
      }),
      serverApi.get(request, "/health").catch((err) => {
        console.error("❌ Health API error:", err.message);
        return { message: "API not available", error: err.message };
      }),
    ]);
    
    console.log("✅ Dashboard loader data received");
    
    // Return session info for debugging in the UI
    return { 
      overview, 
      quickStats, 
      health,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        tokenPreview: session?.accessToken?.substring(0, 30) + "...",
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("💥 Dashboard loader error:", error);
    return {
      overview: { data: { message: "Failed to load overview", error: error.message } },
      quickStats: { data: { message: "Failed to load quick stats", error: error.message } },
      health: { message: "Failed to load health", error: error.message },
      debug: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export default DashboardPage;


