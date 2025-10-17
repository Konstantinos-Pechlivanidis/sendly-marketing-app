import { serverApi } from "../utils/api.server";
import TemplatesPage from "./pages/templates";

export const loader = async ({ request }) => {
  try {
    const [templates, categories, triggers, popular, stats] = await Promise.all([
      serverApi.get(request, "/templates").catch(() => ({ items: [] })),
      serverApi.get(request, "/templates/categories").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/templates/triggers").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/templates/popular").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/templates/stats").catch(() => ({ message: "API not available" })),
    ]);
    return { templates, categories, triggers, popular, stats };
  } catch (error) {
    console.error("Templates loader error:", error);
    return { 
      templates: { items: [] }, 
      categories: { message: "Failed to load" },
      triggers: { message: "Failed to load" },
      popular: { message: "Failed to load" },
      stats: { message: "Failed to load" }
    };
  }
};

export default TemplatesPage;
