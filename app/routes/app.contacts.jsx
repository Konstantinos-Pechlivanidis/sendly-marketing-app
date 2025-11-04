import { serverApi } from "../utils/api.server";
import { authenticate } from "../shopify.server";
import ContactsPage from "./pages/contacts";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "20";
    const search = url.searchParams.get("search") || "";
    const gender = url.searchParams.get("gender") || "";
    const smsConsent = url.searchParams.get("smsConsent") || "";
    const hasBirthDate = url.searchParams.get("hasBirthDate") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const [contacts, stats] = await Promise.all([
      serverApi.get(request, `/contacts?page=${page}&pageSize=${pageSize}&search=${search}&gender=${gender}&smsConsent=${smsConsent}&hasBirthDate=${hasBirthDate}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ success: false, data: { contacts: [], pagination: {} } })),
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
      
      case "importContacts":
        const contacts = JSON.parse(formData.get("contacts") || "[]");
        return await serverApi.post(request, "/contacts/import", {
          contacts
        });
      
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


