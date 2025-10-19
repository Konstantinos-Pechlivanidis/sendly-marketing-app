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
        subtitle="Welcome back! Here's what's happening with your SMS marketing."
        actions={
          <ActionGroup>
            <ActionButton
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <LoadingSpinner size="sm" /> : "🔄"} Refresh
            </ActionButton>
            <ActionButton variant="primary">
              Create Campaign
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total SMS Sent</p>
                <p className="text-3xl font-bold text-gray-900">{(smsMetrics.sent || smsMetrics.totalSent || 0).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">{smsMetrics.delivered || 0} delivered</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {smsMetrics.deliveryRate 
                    ? (typeof smsMetrics.deliveryRate === 'number' 
                      ? `${smsMetrics.deliveryRate}%` 
                      : smsMetrics.deliveryRate)
                    : "0%"}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${smsMetrics.deliveryRate > 90 ? 'text-green-600' : 'text-red-600'}`}>
                    {smsMetrics.failed || 0} failed
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{(contactMetrics.total || 0).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">{contactMetrics.optedIn || contactMetrics.subscribed || 0} opted in</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900">${(walletBalance.balance || 0).toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${walletBalance.balance > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {walletBalance.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-neutral/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(overview.recentMessages || overview.recentActivity || []).length > 0 || 
               (overview.recentTransactions || []).length > 0 ? (
                <>
                  {(overview.recentMessages || []).slice(0, 3).map((msg, idx) => (
                    <div key={`msg-${idx}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors border border-gray-100">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📨</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">SMS Sent</p>
                        <p className="text-xs text-gray-600">{msg.to || 'Contact'} • {formatDate(msg.timestamp)}</p>
                        {msg.status && (
                          <Badge variant={msg.status === 'delivered' ? 'positive' : 'warning'} size="sm" className="mt-2">
                            {msg.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {(overview.recentTransactions || []).slice(0, 2).map((tx, idx) => (
                    <div key={`tx-${idx}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors border border-gray-100">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💳</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{tx.type || 'Transaction'}</p>
                        <p className="text-xs text-gray-600">{tx.amount || 0} credits • {formatDate(tx.timestamp)}</p>
                        {tx.status && (
                          <Badge variant={tx.status === 'completed' ? 'positive' : 'warning'} size="sm" className="mt-2">
                            {tx.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📭</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-sm text-gray-600 mb-4">Start sending SMS campaigns to see activity here</p>
                  <Button variant="primary" size="sm">
                    Create Campaign
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="hover:shadow-lg transition-all duration-200">
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
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">✅</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">System Status</p>
                        <p className="text-xs text-gray-600">All services running normally</p>
                      </div>
                    </div>
                    <Badge variant="positive" size="sm">Operational</Badge>
                  </div>
                  
                  {health.checks && Object.entries(health.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${value.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <span className="text-lg">{value.status === 'healthy' ? '✅' : '⚠️'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{key}</p>
                          <p className="text-xs text-gray-600">Service status</p>
                        </div>
                      </div>
                      <Badge variant={value.status === 'healthy' ? 'positive' : 'warning'} size="sm">
                        {value.status || 'unknown'}
                      </Badge>
                    </div>
                  ))}
                  
                  {health.uptime && (
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg">⏱️</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">System Uptime</p>
                          <p className="text-xs text-gray-600">
                            {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">System health check unavailable</h3>
                  <p className="text-sm text-gray-600 mb-4">Unable to verify system status</p>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    Retry Check
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      {/* Campaign Performance */}
      {quickStats.campaigns && (
        <Card className="hover:shadow-lg transition-all duration-200 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Performance</CardTitle>
              <Button variant="outline" size="sm">
                View All Campaigns
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <Badge variant="primary" size="sm">Live</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{quickStats.campaigns.active || 0}</h3>
                <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                <p className="text-xs text-primary font-medium">
                  {quickStats.campaigns.active > 0 ? "Running now" : "No active campaigns"}
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <Badge variant="info" size="sm">Pending</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{quickStats.campaigns.scheduled || 0}</h3>
                <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                <p className="text-xs text-secondary font-medium">
                  {quickStats.campaigns.scheduled > 0 ? "Waiting to send" : "No scheduled campaigns"}
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <Badge variant="positive" size="sm">Done</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{quickStats.campaigns.completed || 0}</h3>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-xs text-green-600 font-medium">
                  {quickStats.campaigns.completed > 0 ? "Successfully sent" : "No completed campaigns"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Panel - Session Token Info */}
      {debug && (
        <Card className="bg-gradient-to-br from-deep/5 to-deep/10 border border-deep/20 hover:shadow-lg transition-all duration-200">
          <details>
            <summary className="cursor-pointer p-6 hover:bg-deep/10 rounded-xl transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-deep/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Debug Information</h3>
                    <p className="text-xs text-gray-600">Click to expand development details</p>
                  </div>
                </div>
                <Badge variant="info" size="sm">Development</Badge>
              </div>
            </summary>
            <div className="p-6 space-y-6 border-t border-deep/20">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🔑</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600">Session ID</p>
                  </div>
                  <p className="text-sm font-mono text-gray-900 break-all select-all bg-gray-50 p-2 rounded-lg">
                    {debug.sessionId || "N/A"}
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🏪</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600">Shop Domain</p>
                  </div>
                  <p className="text-sm font-mono text-primary break-all select-all bg-gray-50 p-2 rounded-lg">
                    {debug.shop || "N/A"}
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🔐</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600">Access Token (Preview)</p>
                  </div>
                  <p className="text-sm font-mono text-secondary break-all select-all bg-gray-50 p-2 rounded-lg">
                    {debug.tokenPreview || "N/A"}
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-neutral/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⏰</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600">Timestamp</p>
                  </div>
                  <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded-lg">
                    {debug.timestamp ? formatDate(debug.timestamp) : "N/A"}
                  </p>
                </div>
              </div>
              
              {debug.error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⚠️</span>
                    </div>
                    <p className="text-xs font-medium text-red-600">Error Details</p>
                  </div>
                  <p className="text-sm font-mono text-red-700 break-all bg-red-100 p-2 rounded-lg">
                    {debug.error}
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-gradient-to-r from-neutral/10 to-neutral/20 rounded-xl border border-neutral/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-neutral/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">💡</span>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Developer Tip</p>
                </div>
                <p className="text-sm text-gray-600">
                  Copy the Session ID or Access Token to use in API testing. Check the server console for detailed API logs.
                </p>
              </div>
            </div>
          </details>
        </Card>
      )}
      </PageContent>
    </PageLayout>
  );
}
