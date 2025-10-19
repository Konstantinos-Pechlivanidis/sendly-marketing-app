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

    const [templates, categories, stats] = await Promise.all([
      serverApi.get(request, `/api/templates?category=${category}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`).catch(() => ({ data: [] })),
      serverApi.get(request, "/api/templates/categories").catch(() => ({ data: [] })),
      serverApi.get(request, "/api/templates/stats").catch(() => ({ data: {} })),
    ]);
    
    return { 
      templates, 
      categories, 
      stats,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Templates loader error:", error);
    return { 
      templates: { data: [] }, 
      categories: { data: [] },
      stats: { data: {} },
      debug: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  
  try {
    const { session } = await authenticate.admin(request);
    
    switch (action) {
      case "createTemplate":
        return await serverApi.post(request, "/api/templates", {
          name: formData.get("name"),
          description: formData.get("description"),
          content: formData.get("content"),
          category: formData.get("category"),
          tags: JSON.parse(formData.get("tags") || "[]"),
          variables: JSON.parse(formData.get("variables") || "[]"),
          shop: session?.shop
        });
      
      case "updateTemplate":
        return await serverApi.put(request, `/api/templates/${formData.get("id")}`, {
          name: formData.get("name"),
          description: formData.get("description"),
          content: formData.get("content"),
          category: formData.get("category"),
          tags: JSON.parse(formData.get("tags") || "[]"),
          variables: JSON.parse(formData.get("variables") || "[]"),
          shop: session?.shop
        });
      
      case "deleteTemplate":
        return await serverApi.delete(request, `/api/templates/${formData.get("id")}`, {
          shop: session?.shop
        });
      
      case "duplicateTemplate":
        return await serverApi.post(request, `/api/templates/${formData.get("id")}/duplicate`, {
          shop: session?.shop
        });
      
      case "trackTemplate":
        return await serverApi.post(request, `/api/templates/${formData.get("id")}/track`, {
          shop: session?.shop
        });
      
      case "exportTemplates":
        return await serverApi.get(request, "/api/templates/export", {
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Templates action error:", error);
    return { error: error.message };
  }
};

export default TemplatesPage;
