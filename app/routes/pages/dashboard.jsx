import { useLoaderData } from "react-router";
import { serverApi } from "../../utils/api.server";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export const loader = async ({ request }) => {
  try {
    const [overview, quickStats, health] = await Promise.all([
      serverApi.get(request, "/dashboard/overview").catch(() => ({ data: { message: "API not available" } })),
      serverApi.get(request, "/dashboard/quick-stats").catch(() => ({ data: { message: "API not available" } })),
      serverApi.get(request, "/health").catch(() => ({ message: "API not available" })),
    ]);
    return { overview, quickStats, health };
  } catch (error) {
    console.error("Dashboard loader error:", error);
    return {
      overview: { data: { message: "Failed to load overview" } },
      quickStats: { data: { message: "Failed to load quick stats" } },
      health: { message: "Failed to load health" }
    };
  }
};

export default function DashboardPage() {
  const data = useLoaderData();
  
  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1 text-deep">Dashboard</h1>
          <p className="text-caption text-muted mt-1">Overview of your SMS marketing performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.overview?.data || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.quickStats?.data || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.health || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}