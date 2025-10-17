import { authenticate } from "../shopify.server";
import { serverApi } from "../utils/api.server";
import DashboardPage from "./pages/dashboard";

export const loader = async ({ request }) => {
  console.log("🚀 APP INDEX LOADER CALLED!");
  console.log("📅 Timestamp:", new Date().toISOString());
  
  try {
    console.log("🔐 Starting authentication...");
    await authenticate.admin(request);
    console.log("✅ Authentication successful!");
    
    console.log("📊 Loading dashboard data...");
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
    
    console.log("✅ Dashboard data loaded successfully!");
    console.log("📋 Data summary:", { 
      overview: overview?.data ? "✅" : "❌",
      quickStats: quickStats?.data ? "✅" : "❌", 
      health: health?.ok ? "✅" : "❌"
    });
    
    return { overview, quickStats, health };
  } catch (error) {
    console.error("💥 APP INDEX LOADER ERROR:", error);
    return {
      overview: { data: { message: "Failed to load overview", error: error.message } },
      quickStats: { data: { message: "Failed to load quick stats", error: error.message } },
      health: { message: "Failed to load health", error: error.message }
    };
  }
};

export default function AppIndex() {
  console.log("App index component rendering");
  return <DashboardPage />;
}