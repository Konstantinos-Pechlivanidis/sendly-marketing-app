import { useLoaderData, useSubmit } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";

export default function DashboardPage() {
  const data = useLoaderData();
  const submit = useSubmit();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState(null);

  // Backend returns { success: true, data: {...} } which we extract in loader
  const overview = data?.overview || {};
  const quickStats = data?.quickStats || {};
  const debug = data?.debug || {};

  // Extract metrics - adapt to backend response structure
  const smsMetrics = overview.sms || overview.smsMetrics || {};
  const contactMetrics = overview.contacts || overview.contactMetrics || {};
  const walletBalance = overview.wallet || overview.walletBalance || {};

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
  const handleRefresh = () => {
    setRefreshing(true);
    const formData = new FormData();
    formData.append("_action", "refreshDashboard");
    submit(formData, { method: "post" });
    setAlert({ type: "success", message: "Dashboard refreshed successfully!" });
    setTimeout(() => setRefreshing(false), 1000);
  };

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
              {refreshing ? <LoadingSpinner size="sm" /> : <Icon name="refresh" size="sm" className="mr-2" />} Refresh
            </ActionButton>
            <ActionButton variant="primary">
              {/* CHANGED: Added an icon to the primary action button */}
              <Icon name="plus" size="sm" className="mr-2" />
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
        {/* CHANGED: Removed the redundant hero section.
          The PageHeader already provides the title and subtitle.
          We now start directly with the main content.
        */}

        {/* Section 1: KPI Stats Grid */}
        {/* CHANGED: Wrapped content in PageSection for consistent padding */}
        <PageSection>
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total SMS Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{(smsMetrics.sent || smsMetrics.totalSent || 0).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">{smsMetrics.delivered || 0} delivered</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="sms" size="lg" className="text-primary" />
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
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
                  <Icon name="chart" size="lg" className="text-secondary" />
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
                  <p className="text-3xl font-bold text-gray-900">{(contactMetrics.total || 0).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">{contactMetrics.optedIn || contactMetrics.subscribed || 0} opted in</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Icon name="users" size="lg" className="text-accent" />
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
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
                  <Icon name="wallet" size="lg" className="text-neutral-700" />
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* Section 2: Recent Activity & System Health - Sand Background */}
        {/* CHANGED: Replaced <section> with <PageSection> for consistency */}
        <PageSection className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Activity & System Health</h2>
            <p className="text-base text-deep/90 leading-relaxed max-w-2xl mx-auto">
              Monitor recent activity and system performance to ensure optimal SMS delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              {/* CHANGED: Added flex layout to align title and button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div>
                <div className="space-y-4">
                  {(overview.recentMessages || overview.recentActivity || []).length > 0 ||
                    (overview.recentTransactions || []).length > 0 ? (
                    <>
                      {(overview.recentMessages || []).slice(0, 3).map((msg, idx) => (
                        <div key={`msg-${idx}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors border border-gray-100">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon name="sms" size="sm" className="text-primary" />
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
                            <Icon name="credit" size="sm" className="text-secondary" />
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
                        <Icon name="sms" size="2xl" className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                      <p className="text-sm text-gray-600 mb-4">Start sending SMS campaigns to see activity here</p>
                      <Button variant="primary" size="sm">
                        Create Campaign
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* System Health */}
            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">System Health</h3>
                  <Badge variant={health.ok ? "positive" : "warning"} size="sm">
                    {health.ok ? "All Systems Operational" : "Issues Detected"}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  {health.ok ? (
                    <>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon name="success" size="sm" className="text-green-600" />
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
                              <Icon name={value.status === 'healthy' ? 'success' : 'warning'} size="sm" className={value.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'} />
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
                              <Icon name="clock" size="sm" className="text-primary" />
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
                        <Icon name="warning" size="2xl" className="text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">System health check unavailable</h3>
                      <p className="text-sm text-gray-600 mb-4">Unable to verify system status</p>
                      <Button variant="outline" size="sm" onClick={handleRefresh}>
                        Retry Check
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* Section 3: Campaign & Debug */}
        {/* CHANGED: Wrapped remaining cards in a PageSection for consistent layout/spacing */}
        <PageSection className="space-y-8">
          {/* Campaign Performance */}
          {quickStats.campaigns && (
            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              {/* CHANGED: Added flex layout to align title and button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">Campaign Performance</h3>
                <Button variant="outline" size="sm">
                  View All Campaigns
                </Button>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        {/* CHANGED: Replaced placeholder div with Icon */}
                        <Icon name="campaign" size="lg" className="text-primary" />
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
                        {/* CHANGED: Replaced placeholder div with Icon */}
                        <Icon name="calendar" size="lg" className="text-secondary" />
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
                        {/* CHANGED: Replaced placeholder div with Icon */}
                        <Icon name="check" size="lg" className="text-green-600" />
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
              </div>
            </Card>
          )}

          {/* Debug Panel - Session Token Info */}
          {debug && Object.keys(debug).length > 0 && (
            <Card className="bg-gradient-to-br from-deep/5 to-deep/10 border border-deep/20 hover:shadow-lg transition-all duration-200">
              <details>
                <summary className="cursor-pointer p-6 hover:bg-deep/10 rounded-xl transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-deep/20 rounded-lg flex items-center justify-center">
                        {/* CHANGED: Replaced placeholder div with Icon */}
                        <Icon name="cog" size="md" className="text-deep" />
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
                          {/* CHANGED: Replaced emoji with Icon */}
                          <Icon name="key" size="sm" className="text-primary" />
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
                          {/* CHANGED: Replaced emoji with Icon */}
                          <Icon name="external" size="sm" className="text-secondary" />
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
                          {/* CHANGED: Replaced emoji with Icon */}
                          <Icon name="lock" size="sm" className="text-accent" />
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
                          {/* CHANGED: Replaced emoji with Icon */}
                          <Icon name="clock" size="sm" className="text-neutral-700" />
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
                          {/* CHANGED: Replaced emoji with Icon */}
                          <Icon name="warning" size="sm" className="text-red-600" />
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
                        {/* CHANGED: Replaced emoji with Icon */}
                        <Icon name="info" size="sm" className="text-gray-700" />
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
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}