import { useLoaderData } from "react-router";

export default function DashboardPage() {
  const data = useLoaderData();
  
  const overview = data?.overview?.data || {};
  const quickStats = data?.quickStats?.data || {};
  const health = data?.health || {};
  const debug = data?.debug || {};

  // Extract metrics
  const smsMetrics = overview.smsMetrics || {};
  const contactMetrics = overview.contactMetrics || {};
  const walletBalance = overview.walletBalance || {};

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1">Dashboard</h1>
              <p className="text-caption mt-1">Overview of your SMS marketing performance</p>
            </div>
            {/* Debug Info Badge */}
            {debug.sessionId && (
              <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-xs text-deep font-mono">
                  🔑 Session: {debug.sessionId.substring(0, 8)}...
                </p>
                <p className="text-xs text-primary font-mono">{debug.shop}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total SMS Sent */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-caption text-gray-600">Total SMS Sent</h3>
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-h2">{smsMetrics.totalSent?.toLocaleString() || "0"}</p>
            <p className="text-caption text-primary mt-1">
              +{smsMetrics.growth || "0%"} from last month
            </p>
          </div>

          {/* Delivery Rate */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-caption text-gray-600">Delivery Rate</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-h2">{smsMetrics.deliveryRate || "0%"}</p>
            <p className="text-caption text-secondary mt-1">
              {smsMetrics.delivered?.toLocaleString() || "0"} delivered
            </p>
          </div>

          {/* Total Contacts */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-caption text-gray-600">Total Contacts</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-h2">{contactMetrics.total?.toLocaleString() || "0"}</p>
            <p className="text-caption text-primary mt-1">
              {contactMetrics.subscribed?.toLocaleString() || "0"} subscribed
            </p>
          </div>

          {/* Wallet Balance */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-caption text-gray-600">Wallet Balance</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-h2">${walletBalance.balance?.toFixed(2) || "0.00"}</p>
            <p className="text-caption text-neutral mt-1">
              {walletBalance.credits || "0"} SMS credits
            </p>
          </div>
        </div>

        {/* Recent Activity & System Health */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h2 className="text-h3 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {overview.recentActivity && overview.recentActivity.length > 0 ? (
                overview.recentActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-xl">{activity.type === 'sms' ? '📨' : '💳'}</span>
                    <div className="flex-1">
                      <p className="text-body font-medium">{activity.description}</p>
                      <p className="text-caption">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-caption">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h2 className="text-h3 mb-4">System Health</h2>
            <div className="space-y-4">
              {health.ok ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      <span className="text-body">System Status</span>
                    </div>
                    <span className="text-sm font-medium text-primary">Operational</span>
                  </div>
                  
                  {health.checks && Object.entries(health.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{value.status === 'healthy' ? '✅' : '⚠️'}</span>
                        <span className="text-body capitalize">{key}</span>
                      </div>
                      <span className={`text-sm font-medium ${value.status === 'healthy' ? 'text-secondary' : 'text-accent'}`}>
                        {value.status || 'unknown'}
                      </span>
                    </div>
                  ))}
                  
                  {health.uptime && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-caption text-deep">
                        Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-body mt-2">System health check unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        {quickStats.campaigns && (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h2 className="text-h3 mb-4">Campaign Performance</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-caption text-gray-600 mb-1">Active Campaigns</p>
                <p className="text-h2 text-deep">{quickStats.campaigns.active || 0}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-caption text-gray-600 mb-1">Scheduled</p>
                <p className="text-h2 text-deep">{quickStats.campaigns.scheduled || 0}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-caption text-gray-600 mb-1">Completed</p>
                <p className="text-h2 text-deep">{quickStats.campaigns.completed || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Panel - Session Token Info */}
        {debug && (
          <details className="bg-deep/5 rounded-xl shadow-subtle border border-deep/20">
            <summary className="cursor-pointer p-4 hover:bg-deep/10 rounded-xl transition-colors duration-200">
              <span className="text-body font-semibold text-deep">
                🔧 Debug Information (Click to expand)
              </span>
            </summary>
            <div className="p-6 space-y-4 border-t border-deep/20">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-caption text-gray-600 mb-2">Session ID</p>
                  <p className="text-sm font-mono text-deep break-all select-all">
                    {debug.sessionId || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-caption text-gray-600 mb-2">Shop Domain</p>
                  <p className="text-sm font-mono text-primary break-all select-all">
                    {debug.shop || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-caption text-gray-600 mb-2">Access Token (Preview)</p>
                  <p className="text-sm font-mono text-secondary break-all select-all">
                    {debug.tokenPreview || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-caption text-gray-600 mb-2">Timestamp</p>
                  <p className="text-sm font-mono text-deep">
                    {debug.timestamp ? new Date(debug.timestamp).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
              {debug.error && (
                <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
                  <p className="text-caption text-danger mb-2">⚠️ Error</p>
                  <p className="text-sm font-mono text-danger break-all">
                    {debug.error}
                  </p>
                </div>
              )}
              <div className="p-4 bg-neutral/10 rounded-lg border border-neutral/20">
                <p className="text-caption text-deep mb-2">💡 Tip</p>
                <p className="text-sm text-gray-700">
                  Copy the Session ID or Access Token to use in API testing. Check the server console for detailed API logs.
                </p>
              </div>
            </div>
          </details>
        )}
      </main>
      </div>
  );
}
