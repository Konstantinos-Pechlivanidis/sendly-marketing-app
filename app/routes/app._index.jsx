import { authenticate } from "../shopify.server";
import { serverApi } from "../utils/api.server";
import DashboardPage from "./pages/dashboard";

export const loader = async ({ request }) => {
  console.log("App index loader called");
  await authenticate.admin(request);
  console.log("Authentication successful, loading dashboard data");
  try {
    const [overview, quickStats, health] = await Promise.all([
      serverApi.get(request, "/dashboard/overview").catch(() => ({ data: { message: "API not available" } })),
      serverApi.get(request, "/dashboard/quick-stats").catch(() => ({ data: { message: "API not available" } })),
      serverApi.get(request, "/health").catch(() => ({ message: "API not available" })),
    ]);
    console.log("App index loader data:", { overview, quickStats, health });
    return { overview, quickStats, health };
  } catch (error) {
    console.error("App index loader error:", error);
    return {
      overview: { data: { message: "Failed to load overview" } },
      quickStats: { data: { message: "Failed to load quick stats" } },
      health: { message: "Failed to load health" }
    };
  }
};

export default function AppIndex() {
  console.log("App index component rendering");
  return <DashboardPage />;
}