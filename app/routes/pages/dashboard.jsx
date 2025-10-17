import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function DashboardPage() {
  const data = useLoaderData();
  
  console.log("Dashboard data:", data);
  
  return (
    <div className="min-h-screen bg-red-100">
      {/* Header */}
      <header className="bg-blue-500 border-b-4 border-yellow-500 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-yellow-200 mt-1">Overview of your SMS marketing performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <div className="bg-green-500 rounded-lg shadow-lg border-2 border-purple-500 p-6 hover:bg-green-600 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
            <div className="bg-yellow-200 rounded-lg p-3">
              <pre className="text-xs text-black overflow-auto">
                {JSON.stringify(data?.overview?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-green-500 rounded-lg shadow-lg border-2 border-purple-500 p-6 hover:bg-green-600 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
            <div className="bg-yellow-200 rounded-lg p-3">
              <pre className="text-xs text-black overflow-auto">
                {JSON.stringify(data?.quickStats?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* System Health Card */}
          <div className="bg-green-500 rounded-lg shadow-lg border-2 border-purple-500 p-6 hover:bg-green-600 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-4">System Health</h2>
            <div className="bg-yellow-200 rounded-lg p-3">
              <pre className="text-xs text-black overflow-auto">
                {JSON.stringify(data?.health || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}