import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import TemplatesPage from "./pages/templates";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "all";
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "20";

    const [templates, categories] = await Promise.all([
      serverApi.get(request, `/templates?category=${category}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`).catch(() => ({ success: false, data: { templates: [] } })),
      serverApi.get(request, "/templates/categories").catch(() => ({ success: false, data: [] })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      templates: templates?.data || { templates: [] }, 
      categories: categories?.data || [],
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
      templates: { templates: [] }, 
      categories: [],
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
      case "trackTemplateUsage":
        // Backend tracks template usage via POST /templates/:id/track
        return await serverApi.post(request, `/templates/${formData.get("id")}/track`);
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process template action"
    };
  }
};

export default TemplatesPage;
