import { Outlet, useLoaderData, useRouteError, Link as RouterLink } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <div className="min-h-screen bg-gradient-to-br from-[#F7F9F8] to-[#EAF5F3]">
        {/* Shopify App Bridge Navigation - Required for proper integration */}
        <s-app-nav>
          <s-link href="/app/dashboard">Dashboard</s-link>
          <s-link href="/app/campaigns">Campaigns</s-link>
          <s-link href="/app/contacts">Contacts</s-link>
          <s-link href="/app/settings">Settings</s-link>
          <s-link href="/app/templates">Templates</s-link>
          <s-link href="/app/automations">Automations</s-link>
          <s-link href="/app/reports">Reports</s-link>
        </s-app-nav>
        
        {/* Main App Content with iOS 18 Styling */}
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

// keep RouterLink import for compatibility with Shopify boundary