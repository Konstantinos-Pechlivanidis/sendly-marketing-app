import { authenticate } from "../shopify.server";

const BASE_URL = "https://sendly-marketing-backend.onrender.com/api";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

async function request(shopify, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {}),
  };

  // Add Shopify session headers for authentication
  if (shopify?.session?.accessToken) {
    headers["Authorization"] = `Bearer ${shopify.session.accessToken}`;
  }
  if (shopify?.session?.shop) {
    headers["X-Shopify-Shop-Domain"] = shopify.session.shop;
  }

  const merged = {
    headers,
    ...options,
  };

  const res = await fetch(url, merged);
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const serverApi = {
  get: async (request, path) => {
    const { admin } = await authenticate.admin(request);
    return request(admin, path, { method: "GET" });
  },
  post: async (request, path, body) => {
    const { admin } = await authenticate.admin(request);
    return request(admin, path, { method: "POST", body: JSON.stringify(body) });
  },
  put: async (request, path, body) => {
    const { admin } = await authenticate.admin(request);
    return request(admin, path, { method: "PUT", body: JSON.stringify(body) });
  },
  del: async (request, path) => {
    const { admin } = await authenticate.admin(request);
    return request(admin, path, { method: "DELETE" });
  },
};
