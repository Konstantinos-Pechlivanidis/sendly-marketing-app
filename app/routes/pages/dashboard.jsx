import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function DashboardPage() {
  const data = useLoaderData();
  
  console.log("Dashboard data:", data);
  
  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-caption mt-1">Overview of your SMS marketing performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <h2 className="text-h3 mb-4">Overview</h2>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <pre className="text-xs text-body overflow-auto">
                {JSON.stringify(data?.overview?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <h2 className="text-h3 mb-4">Quick Stats</h2>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <pre className="text-xs text-body overflow-auto">
                {JSON.stringify(data?.quickStats?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* System Health Card */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <h2 className="text-h3 mb-4">System Health</h2>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <pre className="text-xs text-body overflow-auto">
                {JSON.stringify(data?.health || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}