import { authenticate } from "../shopify.server";

const BASE_URL = "https://sendly-marketing-backend.onrender.com";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

async function makeRequest(shopify, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  console.log(`Making API request to: ${url}`);
  
  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {}),
  };

  // Backend uses X-Shopify-Shop-Domain for store resolution (per documentation)
  // The shop domain is used to identify and scope all operations to the correct store
  if (shopify?.session?.shop) {
    headers["X-Shopify-Shop-Domain"] = shopify.session.shop;
    console.log(`✅ Added shop domain header: ${shopify.session.shop}`);
  } else {
    console.error("❌ No shop domain found in session!");
  }
  
  console.log("🔍 Session details:", {
    hasSession: !!shopify?.session,
    shop: shopify?.session?.shop,
    sessionId: shopify?.session?.id?.substring(0, 30) + "...",
  });

  const merged = {
    headers,
    ...options,
  };

  try {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url, merged);
    console.log(`Response status: ${res.status}`);
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`API Error ${res.status} for ${url}:`, text);
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      console.log(`API response for ${path}:`, data);
      return data;
    }
    const text = await res.text();
    console.log(`API text response for ${path}:`, text);
    return text;
  } catch (error) {
    console.error(`API request failed for ${url}:`, {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    throw new Error(`Failed to fetch ${path}: ${error.message}`);
  }
}

export const serverApi = {
  get: async (req, path) => {
    const { session } = await authenticate.admin(req);
    console.log("Session info:", { shop: session?.shop, hasToken: !!session?.accessToken });
    return makeRequest({ session }, path, { method: "GET" });
  },
  post: async (req, path, body) => {
    const { session } = await authenticate.admin(req);
    return makeRequest({ session }, path, { method: "POST", body: JSON.stringify(body) });
  },
  put: async (req, path, body) => {
    const { session } = await authenticate.admin(req);
    return makeRequest({ session }, path, { method: "PUT", body: JSON.stringify(body) });
  },
  del: async (req, path) => {
    const { session } = await authenticate.admin(req);
    return makeRequest({ session }, path, { method: "DELETE" });
  },
};
