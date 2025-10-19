import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Stat } from "../../components/ui/Stat";
import { Section, SectionHeader, SectionContent } from "../../components/ui/Section";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { api } from "../../utils/api.client";

export default function DashboardPage() {
  console.log("🎨 DASHBOARD COMPONENT RENDERING!");
  const data = useLoaderData();
  const fetcher = useFetcher();
  console.log("📊 Dashboard data received:", data);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const overview = data?.overview?.data || {};
  const quickStats = data?.quickStats?.data || {};
  const health = data?.health || {};
  const debug = data?.debug || {};

  // Extract metrics - adapt to backend response structure
  const smsMetrics = overview.sms || overview.smsMetrics || {};
  const contactMetrics = overview.contacts || overview.contactMetrics || {};
  const walletBalance = overview.wallet || overview.walletBalance || {};
  
  console.log("📊 Extracted metrics:", {
    smsMetrics,
    contactMetrics, 
    walletBalance
  });

  // Prevent hydration errors by ensuring client-side only rendering for dates
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to format dates safely
  const formatDate = (dateString) => {
    if (!mounted) return "Loading...";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  // Refresh dashboard data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [overviewData, quickStatsData, healthData] = await Promise.all([
        api.dashboard.overview(),
        api.dashboard.quickStats(),
        api.health()
      ]);
      
      // Update the data (this would typically be handled by a state management solution)
      setAlert({ type: 'success', message: 'Dashboard refreshed successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to refresh: ${error.message}` });
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (mounted) {
        handleRefresh();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <PageLayout>
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your SMS marketing performance"
        actions={
          <ActionGroup>
            {/* Debug Info Badge */}
            {debug.sessionId && (
              <div className="px-4 py-2 bg-brand/10 rounded-xl border border-brand/20">
                <p className="text-xs text-gray-900 font-mono">
                  🔑 Session: {debug.sessionId.substring(0, 8)}...
                </p>
                <p className="text-xs text-brand font-mono">{debug.shop}</p>
              </div>
            )}
            <ActionButton
              variant="secondary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <LoadingSpinner size="sm" /> : "🔄"} Refresh
            </ActionButton>
          </ActionGroup>
        }
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Dashboard</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent>
        <PageSection>

      {/* KPI Stats Grid */}
      <Section>
        <SectionContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon="📱"
              label="Total SMS Sent"
              value={(smsMetrics.sent || smsMetrics.totalSent || 0).toLocaleString()}
              delta={`${smsMetrics.delivered || 0} delivered`}
              deltaType="positive"
            />
            
            <Stat
              icon="✅"
              label="Delivery Rate"
              value={
                smsMetrics.deliveryRate 
                  ? (typeof smsMetrics.deliveryRate === 'number' 
                    ? `${smsMetrics.deliveryRate}%` 
                    : smsMetrics.deliveryRate)
                  : "0%"
              }
              delta={`${smsMetrics.failed || 0} failed`}
              deltaType={smsMetrics.deliveryRate > 90 ? "positive" : "negative"}
            />
            
            <Stat
              icon="👥"
              label="Total Contacts"
              value={(contactMetrics.total || 0).toLocaleString()}
              delta={`${contactMetrics.optedIn || contactMetrics.subscribed || 0} opted in`}
              deltaType="positive"
            />
            
            <Stat
              icon="💰"
              label="Wallet Balance"
              value={`$${(walletBalance.balance || 0).toFixed(2)}`}
              delta={walletBalance.active ? "Active" : "Inactive"}
              deltaType={walletBalance.balance > 100 ? "positive" : "negative"}
            />
          </div>
        </SectionContent>
      </Section>

      {/* Recent Activity & System Health */}
      <Section>
        <SectionContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(overview.recentMessages || overview.recentActivity || []).length > 0 || 
                   (overview.recentTransactions || []).length > 0 ? (
                    <>
                      {(overview.recentMessages || []).slice(0, 3).map((msg, idx) => (
                        <div key={`msg-${idx}`} className="flex items-start gap-3 p-3 bg-muted rounded-xl hover:bg-brand/5 transition-colors">
                          <span className="text-xl">📨</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">SMS Sent</p>
                            <p className="text-xs text-gray-600">{msg.to || 'Contact'} • {formatDate(msg.timestamp)}</p>
                            {msg.status && (
                              <Badge variant={msg.status === 'delivered' ? 'positive' : 'warning'} size="sm" className="mt-1">
                                {msg.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {(overview.recentTransactions || []).slice(0, 2).map((tx, idx) => (
                        <div key={`tx-${idx}`} className="flex items-start gap-3 p-3 bg-muted rounded-xl hover:bg-brand/5 transition-colors">
                          <span className="text-xl">💳</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{tx.type || 'Transaction'}</p>
                            <p className="text-xs text-gray-600">{tx.amount || 0} credits • {formatDate(tx.timestamp)}</p>
                            {tx.status && (
                              <Badge variant={tx.status === 'completed' ? 'positive' : 'warning'} size="sm" className="mt-1">
                                {tx.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl mb-2">📭</span>
                      <p className="text-sm text-gray-600">No recent activity</p>
                      <p className="text-xs text-gray-500 mt-1">Start sending SMS campaigns to see activity here</p>
                      <Button variant="primary" size="sm" className="mt-4">
                        Create Campaign
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Health</CardTitle>
                  <Badge variant={health.ok ? "positive" : "warning"} size="sm">
                    {health.ok ? "All Systems Operational" : "Issues Detected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {health.ok ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✅</span>
                          <span className="text-sm text-gray-900">System Status</span>
                        </div>
                        <Badge variant="positive" size="sm">Operational</Badge>
                      </div>
                      
                      {health.checks && Object.entries(health.checks).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{value.status === 'healthy' ? '✅' : '⚠️'}</span>
                            <span className="text-sm text-gray-900 capitalize">{key}</span>
                          </div>
                          <Badge variant={value.status === 'healthy' ? 'positive' : 'warning'} size="sm">
                            {value.status || 'unknown'}
                          </Badge>
                        </div>
                      ))}
                      
                      {health.uptime && (
                        <div className="mt-4 p-3 bg-brand/10 rounded-xl">
                          <p className="text-xs text-gray-900">
                            Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl">⚠️</span>
                      <p className="text-sm text-gray-900 mt-2">System health check unavailable</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh}>
                        Retry Check
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionContent>
      </Section>

      {/* Campaign Performance */}
      {quickStats.campaigns && (
        <Section>
          <SectionContent>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Campaign Performance</CardTitle>
                  <Button variant="outline" size="sm">
                    View All Campaigns
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted rounded-xl hover:bg-brand/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Active Campaigns</p>
                      <Badge variant="primary" size="sm">Live</Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.campaigns.active || 0}</p>
                    <p className="text-xs text-brand mt-1">
                      {quickStats.campaigns.active > 0 ? "Running now" : "No active campaigns"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl hover:bg-brand/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Scheduled</p>
                      <Badge variant="info" size="sm">Pending</Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.campaigns.scheduled || 0}</p>
                    <p className="text-xs text-secondary mt-1">
                      {quickStats.campaigns.scheduled > 0 ? "Waiting to send" : "No scheduled campaigns"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl hover:bg-brand/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600">Completed</p>
                      <Badge variant="positive" size="sm">Done</Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.campaigns.completed || 0}</p>
                    <p className="text-xs text-positive mt-1">
                      {quickStats.campaigns.completed > 0 ? "Successfully sent" : "No completed campaigns"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionContent>
        </Section>
      )}

      {/* Debug Panel - Session Token Info */}
      {debug && (
        <Section>
          <SectionContent>
            <Card className="bg-deep/5 border-deep/20">
              <details>
                <summary className="cursor-pointer p-4 hover:bg-deep/10 rounded-xl transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      🔧 Debug Information (Click to expand)
                    </span>
                    <Badge variant="info" size="sm">Development</Badge>
                  </div>
                </summary>
                <div className="p-6 space-y-4 border-t border-deep/20">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-4 bg-white rounded-xl border border-gray-300">
                      <p className="text-xs text-gray-600 mb-2">Session ID</p>
                      <p className="text-sm font-mono text-gray-900 break-all select-all">
                        {debug.sessionId || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-300">
                      <p className="text-xs text-gray-600 mb-2">Shop Domain</p>
                      <p className="text-sm font-mono text-brand break-all select-all">
                        {debug.shop || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-300">
                      <p className="text-xs text-gray-600 mb-2">Access Token (Preview)</p>
                      <p className="text-sm font-mono text-secondary break-all select-all">
                        {debug.tokenPreview || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-300">
                      <p className="text-xs text-gray-600 mb-2">Timestamp</p>
                      <p className="text-sm font-mono text-gray-900">
                        {debug.timestamp ? formatDate(debug.timestamp) : "N/A"}
                      </p>
                    </div>
                  </div>
                  {debug.error && (
                    <div className="p-4 bg-negative/10 rounded-xl border border-negative/20">
                      <p className="text-xs text-red-500 mb-2">⚠️ Error</p>
                      <p className="text-sm font-mono text-red-500 break-all">
                        {debug.error}
                      </p>
                    </div>
                  )}
                  <div className="p-4 bg-neutral/10 rounded-xl border border-neutral/20">
                    <p className="text-xs text-gray-900 mb-2">💡 Tip</p>
                    <p className="text-sm text-gray-600">
                      Copy the Session ID or Access Token to use in API testing. Check the server console for detailed API logs.
                    </p>
                  </div>
                </div>
              </details>
            </Card>
          </SectionContent>
        </Section>
      )}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
