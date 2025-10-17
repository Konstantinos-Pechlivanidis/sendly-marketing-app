import { serverApi } from "../utils/api.server";
import ContactsPage from "./pages/contacts";

export const loader = async ({ request }) => {
  try {
    const [contacts, stats] = await Promise.all([
      serverApi.get(request, "/contacts").catch(() => ({ items: [] })),
      serverApi.get(request, "/contacts/stats/summary").catch(() => ({ message: "API not available" })),
    ]);
    return { contacts, stats };
  } catch (error) {
    console.error("Contacts loader error:", error);
    return { contacts: { items: [] }, stats: { message: "Failed to load" } };
  }
};

export default ContactsPage;


