import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";

export default function ReportsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [dateRange, setDateRange] = useState("7days");

  const reports = data?.reports || {};

  const exportReport = (type) => {
    fetcher.submit(
      { _action: "exportReport", type, dateRange },
      { method: "post" }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h1">Reports</h1>
            <p className="text-caption mt-1">Analytics and performance insights</p>
          </div>
          <Button variant="primary" onClick={() => exportReport("overview")} className="rounded-xl">
            Export Report
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Date Range Selector */}
        <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
          <h2 className="text-h3 mb-4">Date Range</h2>
          <div className="flex gap-2">
            {["7days", "30days", "90days", "all"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === range
                    ? "bg-primary text-white"
                    : "bg-muted text-body hover:bg-primary/10"
                }`}
              >
                {range === "7days" && "Last 7 Days"}
                {range === "30days" && "Last 30 Days"}
                {range === "90days" && "Last 90 Days"}
                {range === "all" && "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h3 className="text-caption mb-2">Total Messages</h3>
            <p className="text-h2">{reports.totalMessages || 0}</p>
          </div>
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h3 className="text-caption mb-2">Delivery Rate</h3>
            <p className="text-h2">{reports.deliveryRate || "0%"}</p>
          </div>
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h3 className="text-caption mb-2">Open Rate</h3>
            <p className="text-h2">{reports.openRate || "0%"}</p>
          </div>
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h3 className="text-caption mb-2">Revenue</h3>
            <p className="text-h2">${reports.revenue || "0.00"}</p>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
          <h2 className="text-h3 mb-4">Campaign Performance</h2>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-xs text-body overflow-auto">
              {JSON.stringify(reports, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
