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

    const [contacts, stats, categories] = await Promise.all([
      serverApi.get(request, `/api/contacts?page=${page}&pageSize=${pageSize}&search=${search}&gender=${gender}&smsConsent=${smsConsent}&hasBirthDate=${hasBirthDate}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => ({ data: [] })),
      serverApi.get(request, "/api/contacts/stats").catch(() => ({ data: {} })),
      serverApi.get(request, "/api/contacts/categories").catch(() => ({ data: [] })),
    ]);
    
    return { 
      contacts, 
      stats, 
      categories,
      debug: {
        sessionId: session?.id,
        shop: session?.shop,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Contacts loader error:", error);
    return { 
      contacts: { data: [] }, 
      stats: { data: {} },
      categories: { data: [] },
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
      case "createContact":
        return await serverApi.post(request, "/api/contacts", {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          phoneE164: formData.get("phoneE164"),
          email: formData.get("email"),
          gender: formData.get("gender"),
          birthDate: formData.get("birthDate"),
          smsConsent: formData.get("smsConsent"),
          shop: session?.shop
        });
      
      case "updateContact":
        return await serverApi.put(request, `/api/contacts/${formData.get("id")}`, {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          phoneE164: formData.get("phoneE164"),
          email: formData.get("email"),
          gender: formData.get("gender"),
          birthDate: formData.get("birthDate"),
          smsConsent: formData.get("smsConsent"),
          shop: session?.shop
        });
      
      case "deleteContact":
        return await serverApi.delete(request, `/api/contacts/${formData.get("id")}`, {
          shop: session?.shop
        });
      
      case "bulkDeleteContacts":
        const contactIds = JSON.parse(formData.get("contactIds") || "[]");
        return await serverApi.post(request, "/api/contacts/bulk-delete", {
          contactIds,
          shop: session?.shop
        });
      
      case "importContacts":
        const contacts = JSON.parse(formData.get("contacts") || "[]");
        return await serverApi.post(request, "/api/contacts/import", {
          contacts,
          shop: session?.shop
        });
      
      case "exportContacts":
        return await serverApi.get(request, "/api/contacts/export", {
          shop: session?.shop
        });
      
      default:
        return { error: "Unknown action" };
    }
  } catch (error) {
    console.error("Contacts action error:", error);
    return { error: error.message };
  }
};

export default ContactsPage;


