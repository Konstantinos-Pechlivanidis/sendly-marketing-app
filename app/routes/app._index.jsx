import { authenticate } from "../shopify.server";
import { serverApi } from "../utils/api.server";
import DashboardPage from "./pages/dashboard";

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
    
    const [overview, quickStats] = await Promise.all([
      serverApi.get(request, "/dashboard/overview").catch((err) => {
        return { success: false, data: { message: "API not available", error: err.message } };
      }),
      serverApi.get(request, "/dashboard/quick-stats").catch((err) => {
        return { success: false, data: { message: "API not available", error: err.message } };
      }),
    ]);
    
    return { 
      overview: overview?.data || overview || {}, 
      quickStats: quickStats?.data || quickStats || {} 
    };
  } catch (error) {
    return {
      overview: { success: false, data: { message: "Failed to load overview", error: error.message } },
      quickStats: { success: false, data: { message: "Failed to load quick stats", error: error.message } }
    };
  }
};

export default function AppIndex() {
  return <DashboardPage />;
}