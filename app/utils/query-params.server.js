/**
 * Query Parameter Utilities for Server-Side API Calls
 * Properly builds query strings with URLSearchParams
 */

/**
 * Build a query string from an object of parameters
 * Filters out empty/null/undefined values
 * @param {Object} params - Query parameters object
 * @returns {string} - Query string (without leading ?)
 */
export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, and empty strings
    if (value !== null && value !== undefined && value !== "") {
      // Handle arrays and objects
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * Extract query parameters from a URL Request
 * @param {Request} request - Request object
 * @returns {Object} - Query parameters object
 */
export function extractQueryParams(request) {
  const url = new URL(request.url);
  const params = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Get pagination parameters with defaults
 * @param {Request} request - Request object
 * @returns {{page: number, pageSize: number}} - Pagination params
 */
export function getPaginationParams(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = Math.min(
    parseInt(url.searchParams.get("pageSize") || "20", 10),
    100 // Max page size
  );
  
  return { page, pageSize };
}

