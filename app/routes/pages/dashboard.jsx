import { useLoaderData } from "react-router";

export default function DashboardPage() {
  const data = useLoaderData();
  
  const overview = data?.overview?.data || {};
  const quickStats = data?.quickStats?.data || {};
  const health = data?.health || {};

  // Extract metrics
  const smsMetrics = overview.smsMetrics || {};
  const contactMetrics = overview.contactMetrics || {};
  const walletBalance = overview.walletBalance || {};

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
      </main>
    </div>
  );
}
