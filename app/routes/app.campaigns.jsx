import { serverApi } from "../utils/api.server";
import CampaignsPage from "./pages/campaigns";

export const loader = async ({ request }) => {
  try {
    const [campaigns, stats] = await Promise.all([
      serverApi.get(request, "/campaigns").catch(() => ({ items: [] })),
      serverApi.get(request, "/campaigns/stats/summary").catch(() => ({ message: "API not available" })),
    ]);
    return { campaigns, stats };
  } catch (error) {
    console.error("Campaigns loader error:", error);
    return { campaigns: { items: [] }, stats: { message: "Failed to load" } };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "createCampaign") {
    try {
      await serverApi.post(request, "/campaigns", { 
        name: values.name, 
        content: values.content 
      });
      return { success: true };
    } catch (error) {
      console.error("Create campaign error:", error);
      return { success: false, error: error.message };
    }
  }
  return null;
};

export default CampaignsPage;


