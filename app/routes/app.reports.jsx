import { serverApi } from "../utils/api.server";
import ReportsPage from "./pages/reports";

export const loader = async ({ request }) => {
  try {
    const [overview, campaigns, automations, messaging, revenue] = await Promise.all([
      serverApi.get(request, "/reports/overview").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/reports/campaigns").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/reports/automations").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/reports/messaging").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/reports/revenue").catch(() => ({ message: "API not available" })),
    ]);
    return { overview, campaigns, automations, messaging, revenue };
  } catch (error) {
    console.error("Reports loader error:", error);
    return {
      overview: { message: "Failed to load" },
      campaigns: { message: "Failed to load" },
      automations: { message: "Failed to load" },
      messaging: { message: "Failed to load" },
      revenue: { message: "Failed to load" }
    };
  }
};

export default ReportsPage;
