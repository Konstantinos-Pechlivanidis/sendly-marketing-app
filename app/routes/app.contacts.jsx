import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import { buildQueryString, getPaginationParams } from "../utils/query-params.server";
import ContactsPage from "./pages/contacts";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    
    // Get pagination with defaults
    const { page, pageSize } = getPaginationParams(request);
    
    // Build query parameters according to backend API spec
    // Backend uses 'q' for search, not 'search'
    const queryParams = buildQueryString({
      page,
      pageSize,
      q: url.searchParams.get("search") || url.searchParams.get("q") || undefined,
      filter: url.searchParams.get("filter") || undefined, // all, consented, nonconsented
      gender: url.searchParams.get("gender") || undefined,
      smsConsent: url.searchParams.get("smsConsent") || undefined,
      hasBirthDate: url.searchParams.get("hasBirthDate") === "true" ? true : undefined,
      sortBy: url.searchParams.get("sortBy") || "createdAt",
      sortOrder: url.searchParams.get("sortOrder") || "desc",
    });

    const [contacts, stats] = await Promise.all([
      serverApi.get(request, `/contacts?${queryParams}`).catch(() => ({ success: false, data: { contacts: [], pagination: {} } })),
      serverApi.get(request, "/contacts/stats").catch(() => ({ success: false, data: {} })),
    ]);
    
    // Backend returns { success: true, data: {...} }
    // eslint-disable-next-line no-undef
    const isDevelopment = process.env.NODE_ENV === "development";
    return { 
      contacts: contacts?.data || { contacts: [], pagination: {} }, 
      stats: stats?.data || {},
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
      contacts: { contacts: [], pagination: {} }, 
      stats: {},
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
      case "createContact":
        return await serverApi.post(request, "/contacts", {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          phoneE164: formData.get("phoneE164"),
          email: formData.get("email") || null,
          gender: formData.get("gender") || null,
          birthDate: formData.get("birthDate") || null,
          smsConsent: formData.get("smsConsent") || "unknown",
          tags: formData.get("tags") ? JSON.parse(formData.get("tags")) : []
        });
      
      case "updateContact":
        return await serverApi.put(request, `/contacts/${formData.get("id")}`, {
          firstName: formData.get("firstName") || undefined,
          lastName: formData.get("lastName") || undefined,
          phoneE164: formData.get("phoneE164") || undefined,
          email: formData.get("email") || undefined,
          gender: formData.get("gender") || undefined,
          birthDate: formData.get("birthDate") || undefined,
          smsConsent: formData.get("smsConsent") || undefined,
          tags: formData.get("tags") ? JSON.parse(formData.get("tags")) : undefined
        });
      
      case "deleteContact":
        return await serverApi.delete(request, `/contacts/${formData.get("id")}`);
      
      case "importContacts": {
        const contacts = JSON.parse(formData.get("contacts") || "[]");
        const result = await serverApi.post(request, "/contacts/import", {
          contacts,
          skipDuplicates: true
        });
        return result;
      }
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || "Unknown error",
      message: error.message || "Failed to process contact action"
    };
  }
};

export default ContactsPage;


