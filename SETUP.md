# Sendly Marketing App - Setup Guide

## ✅ Current Status

### Completed
- ✅ iOS 18 design system implemented
- ✅ All pages styled with Tailwind CSS
- ✅ API integration fixed (BASE_URL corrected)
- ✅ Backend connection configured
- ✅ Design tokens and CSS variables
- ✅ Glass effects, rounded corners, soft shadows
- ✅ All pages: Dashboard, Campaigns, Contacts, Settings, Templates, Automations, Reports

## 🚀 How to Run the App

### 1. Start the Development Server
```bash
cd sendly-marketing-app
npm run dev
```

This will:
- Start the React Router dev server on http://localhost:3000
- Create a Cloudflare tunnel (e.g., `https://xxx.trycloudflare.com`)
- The Cloudflare URL is what Shopify uses to load your app

### 2. Access the App

**⚠️ IMPORTANT:** Do NOT access the app directly via the Cloudflare URL or localhost. This will cause the X-Frame-Options error you're seeing.

**✅ CORRECT WAY:** Access the app through Shopify Admin:
1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to: **Apps** → **sendly-marketing-app**
3. The app will load inside Shopify Admin (embedded)

### 3. Understanding the URLs

- **localhost:3000** - Your local development server
- **xxx.trycloudflare.com** - Cloudflare tunnel (for Shopify to access your local app)
- **Shopify Admin** - Where you actually use the app (embedded)

## 🔧 API Configuration

### Backend URL
```
https://sendly-marketing-backend.onrender.com
```

### Endpoints Used
- `GET /dashboard/overview` - Dashboard overview data
- `GET /dashboard/quick-stats` - Quick statistics
- `GET /health` - System health check
- `GET /campaigns` - List campaigns
- `GET /contacts` - List contacts
- `GET /templates` - List templates
- `GET /automations` - List automations
- `GET /reports` - Get reports data

## 🎨 iOS 18 Design System

### Brand Colors
- **Primary**: #64D3C1 (Teal)
- **Secondary**: #1C7B7B (Deep Teal)
- **Deep**: #004E47 (Petrol)
- **Neutral**: #D9B88C (Sand)
- **Accent**: #E27D43 (Sunset)
- **Danger**: #8A3E2E (Terracotta)

### Features
- Glass effect headers with backdrop blur
- Large border radius (24px for cards)
- Soft shadows (subtle and elevated)
- Polished typography scale
- Smooth transitions (200ms)
- 4/8pt spacing rhythm

## 📝 Common Issues

### "Refused to display in a frame"
**Cause:** Trying to access the app directly via Cloudflare URL or localhost

**Solution:** Access the app through Shopify Admin (Apps → sendly-marketing-app)

### "API not available"
**Cause:** Backend might be offline or authentication issues

**Solution:** Check console logs for detailed error messages. Logs will show:
- Request URL
- Response status
- Error details

### Development server not starting
**Cause:** Wrong directory or missing dependencies

**Solution:**
```bash
cd sendly-marketing-app  # Make sure you're in the right directory
npm install              # Install dependencies if needed
npm run dev             # Start the server
```

## 🔍 Debugging

### Check Console Logs
Press F12 in your browser and check the Console tab. You'll see detailed logs:
- API request URLs
- Authentication headers
- Response status and data
- Error messages

### Check Network Tab
Press F12 → Network tab to see all API requests and responses

## 📚 Documentation

- **API Documentation**: `api_doc.md` - Frontend endpoint usage
- **Backend API**: `backend.md` - Complete backend API reference
- **Design Tokens**: See `app/styles/tailwind.css` for all tokens
- **Tailwind Config**: `tailwind.config.js` for theme configuration

## 🎯 Next Steps

1. ✅ **Access the app through Shopify Admin** (not direct URL)
2. ✅ **Check if API calls are working** (refresh dashboard)
3. ✅ **Test all pages** (Campaigns, Contacts, Settings, etc.)
4. ✅ **Verify iOS 18 styling** across all pages

## 🛠️ Development Workflow

1. Make changes to code
2. Save files (auto-reload will trigger)
3. Refresh the app in Shopify Admin
4. Check console for any errors
5. Test functionality

## 📞 Support

If you encounter issues:
1. Check console logs (F12 → Console)
2. Check network requests (F12 → Network)
3. Verify you're accessing through Shopify Admin
4. Check if backend is online: https://sendly-marketing-backend.onrender.com/health

