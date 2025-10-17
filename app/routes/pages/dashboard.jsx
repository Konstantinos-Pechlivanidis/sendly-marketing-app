import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function DashboardPage() {
  const data = useLoaderData();
  
  console.log("Dashboard data:", data);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Overview of your SMS marketing performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(data?.overview?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(data?.quickStats?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* System Health Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="bg-gray-50 rounded-lg p-3">
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(data?.health || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}