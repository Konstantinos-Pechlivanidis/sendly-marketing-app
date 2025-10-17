import { serverApi } from "../utils/api.server";
import AutomationsPage from "./pages/automations";

export const loader = async ({ request }) => {
  try {
    const [automations, stats] = await Promise.all([
      serverApi.get(request, "/automations").catch(() => ({ items: [] })),
      serverApi.get(request, "/automations/stats/summary").catch(() => ({ message: "API not available" })),
    ]);
    return { automations, stats };
  } catch (error) {
    console.error("Automations loader error:", error);
    return { 
      automations: { items: [] }, 
      stats: { message: "Failed to load" }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "updateAutomation") {
    try {
      await serverApi.put(request, `/automations/${values.type}`, {
        enabled: values.enabled === "true",
        message: values.message,
        schedule: JSON.parse(values.schedule || "{}")
      });
      return { success: true };
    } catch (error) {
      console.error("Update automation error:", error);
      return { success: false, error: error.message };
    }
  }

  if (_action === "resetAutomation") {
    try {
      await serverApi.post(request, `/automations/${values.type}/reset`);
      return { success: true };
    } catch (error) {
      console.error("Reset automation error:", error);
      return { success: false, error: error.message };
    }
  }

  return null;
};

export default AutomationsPage;
