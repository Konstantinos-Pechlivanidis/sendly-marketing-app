import { Outlet, useLoaderData, useRouteError, Link as RouterLink } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import { AppShell, AppHeader, AppSidebar, AppMain, AppContent } from "../components/ui/AppShell";
import { Button } from "../components/ui/Button";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <AppShell>
        <AppHeader>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-ink">Sendly</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Help
              </Button>
            </div>
          </div>
        </AppHeader>
        
        <AppSidebar>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink href="/app/dashboard" icon="📊">Dashboard</SidebarLink>
            <SidebarLink href="/app/campaigns" icon="📧">Campaigns</SidebarLink>
            <SidebarLink href="/app/contacts" icon="👥">Contacts</SidebarLink>
            <SidebarLink href="/app/templates" icon="📝">Templates</SidebarLink>
            <SidebarLink href="/app/automations" icon="⚡">Automations</SidebarLink>
            <SidebarLink href="/app/reports" icon="📈">Reports</SidebarLink>
            <SidebarLink href="/app/settings" icon="⚙️">Settings</SidebarLink>
          </nav>
        </AppSidebar>

        <AppMain>
          <AppContent>
            <Outlet />
          </AppContent>
        </AppMain>
      </AppShell>
    </AppProvider>
  );
}

function SidebarLink({ href, icon, children, ...props }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-ink-secondary hover:text-ink hover:bg-surface-secondary rounded-xl transition-all duration-200 group"
      {...props}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </a>
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