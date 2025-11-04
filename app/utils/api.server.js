import { authenticate } from "../shopify.server";

// Environment-based configuration
const BASE_URL = 
  process.env.API_BASE_URL || 
  process.env.BACKEND_URL || 
  "https://sendly-marketing-backend.onrender.com";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };
const REQUEST_TIMEOUT = 30000; // 30 seconds
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Custom error class for API errors
export class ServerApiError extends Error {
  constructor(message, status, data, path) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}

async function makeRequest(shopify, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  // Validate session exists
  if (!shopify?.session) {
    throw new ServerApiError(
      "No session found. Authentication required.",
      401,
      { path },
      path
    );
  }

  const session = shopify.session;
  
  // Validate shop domain exists (CRITICAL for store scoping)
  if (!session.shop) {
    throw new ServerApiError(
      "No shop domain found in session. Cannot identify store.",
      401,
      { path, sessionId: session.id },
      path
    );
  }

  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {}),
  };

  // Backend uses X-Shopify-Shop-Domain for store resolution (CRITICAL)
  // This header is REQUIRED - backend uses it to scope all operations to the correct store
  headers["X-Shopify-Shop-Domain"] = session.shop;

  // For server-side calls to external backend, we use accessToken
  // The backend should validate this token and extract shop domain
  // 
  // Note: If backend requires App Bridge session token instead:
  // - Session token is provided by App Bridge in request headers
  // - We can get it via: request.headers.get("X-Shopify-Session-Token")
  // - Or from App Bridge React context (client-side only)
  //
  // Current implementation uses accessToken which is valid for:
  // - Shopify Admin API calls
  // - External backend authentication (if backend accepts it)
  if (session.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  } else {
    throw new ServerApiError(
      "No access token found in session. Authentication failed.",
      401,
      { path, shop: session.shop },
      path
    );
  }
  
  // Optional: If backend requires session token, uncomment below:
  // const sessionToken = shopify.request?.headers?.get("X-Shopify-Session-Token");
  // if (sessionToken) {
  //   headers["Authorization"] = `Bearer ${sessionToken}`;
  // }

  const merged = {
    headers,
    ...options,
    signal: options.signal || AbortSignal.timeout(REQUEST_TIMEOUT),
  };

  try {
    const res = await fetch(url, merged);
    
    if (!res.ok) {
      let errorData;
      const contentType = res.headers.get("content-type") || "";
      
      if (contentType.includes("application/json")) {
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: res.statusText };
        }
      } else {
        const text = await res.text();
        errorData = { message: text || res.statusText };
      }
      
      if (IS_DEVELOPMENT) {
        console.error(`API Error ${res.status} for ${path}:`, errorData);
      }
      
      throw new ServerApiError(
        errorData.message || `API request failed with status ${res.status}`,
        res.status,
        errorData,
        path
      );
    }
    
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const responseData = await res.json();
      
      // Backend always returns { success: true, data: {...} } or { success: false, error, message, ... }
      // Handle backend error responses (success: false)
      if (responseData.success === false) {
        throw new ServerApiError(
          responseData.message || responseData.error || "API request failed",
          res.status || 400,
          responseData,
          path
        );
      }
      
      // Return the data directly (backend wraps it in { success: true, data: {...} })
      return responseData;
    }
    
    return await res.text();
  } catch (error) {
    // Handle abort/timeout errors
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      const timeoutError = new ServerApiError(
        `Request timeout for ${path}`,
        408,
        { timeout: REQUEST_TIMEOUT },
        path
      );
      if (IS_DEVELOPMENT) {
        console.error("Request timeout:", path);
      }
      throw timeoutError;
    }
    
    // Re-throw ServerApiError as-is
    if (error instanceof ServerApiError) {
      throw error;
    }
    
    // Handle network errors
    if (IS_DEVELOPMENT) {
      console.error(`API request failed for ${path}:`, error.message);
    }
    
    throw new ServerApiError(
      `Network error: ${error.message}`,
      0,
      { originalError: error.message },
      path
    );
  }
}

/**
 * Server API wrapper with authentication
 * 
 * Authentication Flow:
 * 1. User installs app → Shopify OAuth flow → Session stored in Prisma
 * 2. Each request → authenticate.admin(request) → Validates session & returns session
 * 3. Session contains: shop (store domain), accessToken, id, etc.
 * 4. We send shop domain in X-Shopify-Shop-Domain header (CRITICAL for store scoping)
 * 5. Backend uses shop domain to scope all database operations to that store
 * 
 * Store Scoping:
 * - Every API call includes X-Shopify-Shop-Domain header
 * - Backend uses this to filter all queries: WHERE shopId = resolvedShopId
 * - This ensures data isolation between stores
 */
export const serverApi = {
  get: async (req, path) => {
    const { session } = await authenticate.admin(req);
    if (!session?.shop) {
      throw new ServerApiError(
        "Authentication failed: No shop domain in session",
        401,
        { path },
        path
      );
    }
    return makeRequest({ session, request: req }, path, { method: "GET" });
  },
  post: async (req, path, body) => {
    const { session } = await authenticate.admin(req);
    if (!session?.shop) {
      throw new ServerApiError(
        "Authentication failed: No shop domain in session",
        401,
        { path, sessionId: session?.id },
        path
      );
    }
    return makeRequest(
      { session, request: req }, 
      path, 
      { 
        method: "POST", 
        body: body ? JSON.stringify(body) : undefined 
      }
    );
  },
  put: async (req, path, body) => {
    const { session } = await authenticate.admin(req);
    if (!session?.shop) {
      throw new ServerApiError(
        "Authentication failed: No shop domain in session",
        401,
        { path, sessionId: session?.id },
        path
      );
    }
    return makeRequest(
      { session, request: req }, 
      path, 
      { 
        method: "PUT", 
        body: body ? JSON.stringify(body) : undefined 
      }
    );
  },
  delete: async (req, path) => {
    const { session } = await authenticate.admin(req);
    if (!session?.shop) {
      throw new ServerApiError(
        "Authentication failed: No shop domain in session",
        401,
        { path, sessionId: session?.id },
        path
      );
    }
    return makeRequest({ session, request: req }, path, { method: "DELETE" });
  },
  // Alias for delete (backward compatibility)
  del: async (req, path) => {
    return serverApi.delete(req, path);
  },
};
