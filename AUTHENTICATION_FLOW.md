# 🔐 Authentication & Store Scoping Flow

## 📋 Overview

Αυτό το έγγραφο εξηγεί πώς λειτουργεί το authentication και store scoping στο Sendly Marketing App.

---

## 🔄 Complete Authentication Flow

### 1. Εγκατάσταση Extension (First Time)

```
User → Shopify App Store → Clicks "Install" 
  → Shopify OAuth Flow (/auth/login)
  → User approves permissions
  → Shopify redirects to /auth/callback
  → App creates Session in Prisma database
  → Session contains: shop, accessToken, id, scope, etc.
```

**Session Storage:**
- **Database**: Prisma `Session` table
- **Fields**: `id`, `shop`, `accessToken`, `scope`, `expires`, etc.
- **Isolation**: Κάθε store έχει δικό του session record

### 2. Κάθε Request Flow

```
Browser Request → React Router Route
  → authenticate.admin(request) 
  → Shopify validates session cookie/headers
  → Returns session from Prisma (based on shop domain)
  → Route loader uses session.shop & session.accessToken
  → Makes API call to backend with headers:
     - Authorization: Bearer <accessToken>
     - X-Shopify-Shop-Domain: <shop_domain>
```

### 3. Backend Store Resolution

```
Backend receives request:
  → Validates Authorization header (accessToken)
  → Extracts shop domain from X-Shopify-Shop-Domain header
  → Finds/creates Shop record in database
  → All subsequent operations scoped to: WHERE shopId = <shopId>
```

---

## 🔍 Store Identification

### Πώς Βρίσκει το Store

**Server-Side (api.server.js):**
```javascript
const { session } = await authenticate.admin(request);
// session.shop = "my-store.myshopify.com"
headers["X-Shopify-Shop-Domain"] = session.shop;
```

**Client-Side (api.client.js):**
```javascript
// Method 1: Session Storage
const config = JSON.parse(sessionStorage.getItem('app-bridge-config'));
const shopDomain = config.shop;

// Method 2: App Bridge
const shopDomain = window.shopify?.config?.shop?.myshopifyDomain;
```

### Session Structure

```javascript
{
  id: "session_123",
  shop: "my-store.myshopify.com",  // ← CRITICAL for store scoping
  accessToken: "shpat_...",        // Shopify Admin API token
  scope: "read_products,write_products",
  isOnline: false,
  expires: "2025-12-31T23:59:59Z"
}
```

---

## 🛡️ Data Isolation (Store Scoping)

### Backend Scoping

**Every database query includes shopId:**
```javascript
// Backend automatically filters by shopId
const contacts = await prisma.contact.findMany({
  where: { 
    shopId: resolvedShopId,  // ← Automatically added
    // ... other filters
  }
});
```

### Frontend Scoping

**Every API call includes shop domain:**
```javascript
headers["X-Shopify-Shop-Domain"] = session.shop;
// Backend uses this to find correct shopId
```

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Missing Shop Domain

**Problem**: Session exists but `session.shop` is undefined

**Solution**: ✅ **FIXED** - Added validation that throws error if shop domain missing

```javascript
if (!session.shop) {
  throw new ServerApiError(
    "No shop domain found in session. Cannot identify store.",
    401
  );
}
```

### Issue 2: Wrong Token Type

**Problem**: Backend expects `session_token` but we send `accessToken`

**Current Implementation**: 
- Server-side: Uses `session.accessToken` (Shopify Admin API token)
- Backend: Should validate this token and extract shop domain

**If Backend Requires Session Token Instead:**
- Need to get session token from request headers (App Bridge provides it)
- Or update backend to accept accessToken

### Issue 3: Session Expired

**Problem**: Session expires but request still goes through

**Solution**: ✅ **HANDLED** - `authenticate.admin()` automatically validates expiration and refreshes if needed

### Issue 4: Multiple Stores Same User

**Problem**: User has multiple stores, how do we know which one?

**Solution**: ✅ **HANDLED** - Shopify automatically includes shop domain in session based on which store the user is accessing

---

## 🔒 Security Considerations

### 1. Session Validation
- ✅ Every request validates session via `authenticate.admin()`
- ✅ Invalid/expired sessions automatically rejected
- ✅ Session stored securely in Prisma

### 2. Store Isolation
- ✅ Shop domain always sent in header
- ✅ Backend validates shop domain matches session
- ✅ All database queries scoped to shopId

### 3. Token Security
- ✅ Access tokens never exposed to client-side
- ✅ Tokens stored securely in server-side database
- ✅ Tokens expire and auto-refresh

---

## 📝 Code Flow Example

### Complete Request Flow

```javascript
// 1. User visits /app/dashboard
// 2. Route loader executes
export const loader = async ({ request }) => {
  // 3. Authenticate and get session
  const { session } = await authenticate.admin(request);
  // session = { shop: "my-store.myshopify.com", accessToken: "...", id: "..." }
  
  // 4. Make API call with shop domain
  const data = await serverApi.get(request, "/dashboard/overview");
  // This automatically includes:
  // - Authorization: Bearer <accessToken>
  // - X-Shopify-Shop-Domain: my-store.myshopify.com
  
  return { data };
};

// 5. Backend receives request
// - Validates Authorization token
// - Extracts shop domain from header
// - Finds shopId for that domain
// - Returns data scoped to that shopId
```

---

## ✅ Current Implementation Status

### ✅ Working Correctly

1. **Session Storage**: Prisma Session table
2. **Authentication**: `authenticate.admin()` validates every request
3. **Shop Domain Extraction**: Always from `session.shop`
4. **Header Injection**: `X-Shopify-Shop-Domain` always included
5. **Validation**: Errors thrown if session/shop missing

### ⚠️ Potential Issues

1. **Token Type**: Backend docs say "session_token" but we send "accessToken"
   - **Action**: Verify with backend if accessToken is acceptable
   - **Alternative**: Get session token from request headers if needed

2. **Session Token for External Backend**: 
   - Currently using `accessToken` (Shopify Admin API token)
   - If backend requires different token, need to implement session token retrieval

---

## 🔧 Recommended Improvements

1. **Add Session Token Support** (if backend requires it):
   ```javascript
   // Get session token from request headers (App Bridge provides it)
   const sessionToken = request.headers.get("X-Shopify-Session-Token");
   if (sessionToken) {
     headers["Authorization"] = `Bearer ${sessionToken}`;
   }
   ```

2. **Add Request Logging** (for debugging):
   ```javascript
   if (IS_DEVELOPMENT) {
     console.log("API Request:", {
       shop: session.shop,
       path,
       hasToken: !!session.accessToken
     });
   }
   ```

3. **Add Rate Limiting** (per store):
   - Backend handles this, but frontend should respect it

---

## 📚 Related Files

- `app/shopify.server.js` - Shopify app configuration
- `app/utils/api.server.js` - API request wrapper with authentication
- `app/db.server.js` - Prisma client
- `prisma/schema.prisma` - Session table schema
- `app/routes/app.jsx` - Main app layout with authentication

