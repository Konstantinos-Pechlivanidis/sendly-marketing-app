import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import { buildQueryString, getPaginationParams } from "../utils/query-params.server";
import TemplatesPage from "./pages/templates";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    
    // Get pagination with defaults
    const { page, pageSize } = getPaginationParams(request);
    
    // Build query parameters according to backend API spec
    const queryParams = buildQueryString({
      category: url.searchParams.get("category") || undefined,
      isPublic: url.searchParams.get("isPublic") === "true" ? true : undefined,
    });

    const [templates, categories] = await Promise.all([
      serverApi.get(request, `/templates?${queryParams}`).catch(() => ({ success: false, data: [] })),
      serverApi.get(request, "/templates/categories").catch(() => ({ success: false, data: [] })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // Templates endpoint returns array directly
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      templates: Array.isArray(templates?.data) ? templates.data : [], 
      categories: Array.isArray(categories?.data) ? categories.data : [],
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
