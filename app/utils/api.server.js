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

  // Add Shopify session headers for authentication
  console.log("🔍 Session object details:", {
    hasSession: !!shopify?.session,
    sessionId: shopify?.session?.id?.substring(0, 30) + "...",
    hasAccessToken: !!shopify?.session?.accessToken,
    accessTokenPreview: shopify?.session?.accessToken?.substring(0, 30) + "...",
    shop: shopify?.session?.shop,
  });
  
  // Use session ID (what backend expects)
  const sessionToken = shopify?.session?.id;
  
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
    console.log(`✅ Added Authorization header with SESSION ID`);
    console.log(`🔑 Session ID: ${sessionToken}`);
  } else {
    console.error("❌ No session ID found! Falling back to access token...");
    const accessToken = shopify?.session?.accessToken;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log(`⚠️ Using ACCESS TOKEN instead: ${accessToken.substring(0, 30)}...`);
    } else {
      console.error("❌ No tokens found!");
    }
  }
  
  if (shopify?.session?.shop) {
    headers["X-Shopify-Shop-Domain"] = shopify.session.shop;
    console.log(`✅ Added shop domain: ${shopify.session.shop}`);
  } else {
    console.error("❌ No shop domain found in session!");
  }

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
