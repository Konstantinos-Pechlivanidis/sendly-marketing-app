import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Select } from "../../components/ui/Select";
import { Input, Label } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";

export default function ReportsPage() {
  const data = useLoaderData();
  
  const overview = data?.overview?.data || {};
  const campaigns = data?.campaigns?.data || {};
  const automations = data?.automations?.data || {};
  const messaging = data?.messaging?.data || {};
  const revenue = data?.revenue?.data || {};

  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportData, setExportData] = useState({
    campaigns: true,
    automations: true,
    messaging: true,
    revenue: true
  });
  const [filters, setFilters] = useState({
    dateRange: '30d',
    campaignType: 'all',
    automationType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        { _action: "refreshReports", dateRange: filters.dateRange },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Reports refreshed successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to refresh reports: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReports = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          _action: "exportReports",
          format: exportFormat,
          dateRange: filters.dateRange,
          ...exportData
        },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Reports exported successfully!' });
      setIsExportModalOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to export reports: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReport = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          _action: "scheduleReport",
          dateRange: filters.dateRange,
          frequency: 'weekly'
        },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Report scheduled successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to schedule report: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (growth) => {
    if (!growth) return 'text-gray-500';
    const value = parseFloat(growth.replace(/[+%-]/g, ''));
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getGrowthIcon = (growth) => {
    if (!growth) return '➖';
    const value = parseFloat(growth.replace(/[+%-]/g, ''));
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➖';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="min-h-screen bg-background">
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

      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h1">Reports & Analytics</h1>
            <p className="text-caption mt-1">Track performance and measure ROI</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: '1y', label: 'Last year' }
              ]}
            />
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loading}
              className="rounded-xl"
            >
              {loading ? <LoadingSpinner size="sm" /> : '🔄'} Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              className="rounded-xl"
            >
              📥 Export
            </Button>
            <Button
              variant="primary"
              onClick={handleScheduleReport}
              disabled={loading}
              className="rounded-xl"
            >
              📅 Schedule
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Total SMS Sent</p>
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-h2 text-deep">{overview.totalSent?.toLocaleString() || 0}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-caption ${getGrowthColor(overview.sentGrowth)}`}>
                {getGrowthIcon(overview.sentGrowth)} {overview.sentGrowth || "+0%"}
              </span>
              <span className="text-caption text-gray-500">vs previous period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Delivery Rate</p>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-h2 text-primary">{formatPercentage(overview.deliveryRate)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-caption text-secondary">
                {overview.totalDelivered?.toLocaleString() || 0} delivered
              </span>
              <Badge variant="success" size="sm">
                {formatPercentage(overview.deliveryRate)}
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Total Revenue</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-h2 text-deep">{formatCurrency(revenue.total)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-caption ${getGrowthColor(revenue.growth)}`}>
                {getGrowthIcon(revenue.growth)} {revenue.growth || "+0%"}
              </span>
              <span className="text-caption text-gray-500">vs previous period</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">ROI</p>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-h2 text-secondary">{revenue.roi || "0x"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-caption text-deep">
                {formatCurrency(revenue.spent)} spent
              </span>
              <Badge variant="info" size="sm">
                {revenue.roi || "0x"} ROI
              </Badge>
            </div>
          </Card>
        </div>

        {/* Detailed Reports Tabs */}
        <Tabs defaultValue="campaigns">
          <TabsList className="flex gap-2 bg-muted rounded-xl p-2 mb-6 overflow-x-auto">
            <TabsTrigger value="campaigns" className="rounded-lg px-6 py-2">
              📊 Campaigns
            </TabsTrigger>
            <TabsTrigger value="automations" className="rounded-lg px-6 py-2">
              🤖 Automations
            </TabsTrigger>
            <TabsTrigger value="messaging" className="rounded-lg px-6 py-2">
              💬 Messaging
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-lg px-6 py-2">
              💰 Revenue
            </TabsTrigger>
          </TabsList>

          {/* Campaign Reports */}
          <TabsContent value="campaigns">
            <div className="space-y-6">
              {/* Campaign Performance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h3">Campaign Performance</h2>
                  <Badge variant="info" size="lg">
                    {campaigns.total || 0} campaigns
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                  <Card className="p-4 bg-muted">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption text-gray-600 mb-1">Total Campaigns</p>
                        <p className="text-h2 text-deep">{campaigns.total || 0}</p>
                      </div>
                      <Badge variant="default" size="lg">📊</Badge>
                    </div>
                  </Card>
                  <Card className="p-4 bg-primary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption text-deep mb-1">Avg. Delivery Rate</p>
                        <p className="text-h2 text-primary">{formatPercentage(campaigns.avgDeliveryRate)}</p>
                      </div>
                      <Badge variant="success" size="lg">✅</Badge>
                    </div>
                  </Card>
                  <Card className="p-4 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption text-deep mb-1">Avg. Conversion</p>
                        <p className="text-h2 text-secondary">{formatPercentage(campaigns.avgConversionRate)}</p>
                      </div>
                      <Badge variant="warning" size="lg">📈</Badge>
                    </div>
                  </Card>
                </div>

                {/* Top Campaigns */}
                {campaigns.topCampaigns && campaigns.topCampaigns.length > 0 && (
                  <div>
                    <h3 className="text-body font-semibold text-deep mb-3">Top Performing Campaigns</h3>
                    <div className="space-y-3">
                      {campaigns.topCampaigns.map((campaign, idx) => (
                        <Card key={campaign.id || idx} className="p-4 hover:bg-primary/10 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-body font-medium text-deep">{campaign.name}</p>
                                <Badge variant="info" size="sm">
                                  #{idx + 1}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-caption text-gray-600">
                                <span>{campaign.sent?.toLocaleString() || 0} sent</span>
                                <span>•</span>
                                <span>{formatPercentage(campaign.deliveryRate)} delivered</span>
                                <span>•</span>
                                <span>{formatPercentage(campaign.conversionRate)} conversion</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Badge variant="success" size="sm">
                                  {formatPercentage(campaign.conversionRate)}
                                </Badge>
                                <Badge variant="info" size="sm">
                                  {formatPercentage(campaign.deliveryRate)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Automation Reports */}
          <TabsContent value="automations">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">Automation Performance</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-caption text-gray-600 mb-1">Total Triggered</p>
                  <p className="text-h2 text-deep">{automations.totalTriggered?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-caption text-deep mb-1">Sent</p>
                  <p className="text-h2 text-primary">{automations.totalSent?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-caption text-deep mb-1">Success Rate</p>
                  <p className="text-h2 text-secondary">{automations.successRate || "0%"}</p>
                </div>
                <div className="p-4 bg-deep/10 rounded-lg">
                  <p className="text-caption text-deep mb-1">Avg. Revenue</p>
                  <p className="text-h2 text-deep">${automations.avgRevenue?.toFixed(2) || "0.00"}</p>
                </div>
              </div>

              {/* Automation Breakdown */}
              {automations.breakdown && automations.breakdown.length > 0 && (
                <div>
                  <h3 className="text-body font-semibold text-deep mb-3">By Type</h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {automations.breakdown.map((auto) => (
                      <div
                        key={auto.type}
                        className="p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-body font-medium text-deep capitalize">{auto.type}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            auto.enabled ? "bg-primary/20 text-primary" : "bg-gray-200 text-gray-600"
                          }`}>
                            {auto.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-caption text-gray-600">Triggered</p>
                            <p className="text-body font-semibold text-deep">{auto.triggered || 0}</p>
                          </div>
                          <div>
                            <p className="text-caption text-gray-600">Sent</p>
                            <p className="text-body font-semibold text-primary">{auto.sent || 0}</p>
                          </div>
                          <div>
                            <p className="text-caption text-gray-600">Rate</p>
                            <p className="text-body font-semibold text-secondary">{auto.rate || "0%"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messaging Reports */}
          <TabsContent value="messaging">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">Messaging Activity</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-caption text-gray-600 mb-1">Total Messages</p>
                  <p className="text-h2 text-deep">{messaging.total?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-caption text-deep mb-1">Delivered</p>
                  <p className="text-h2 text-primary">{messaging.delivered?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-danger/10 rounded-lg">
                  <p className="text-caption text-deep mb-1">Failed</p>
                  <p className="text-h2 text-danger">{messaging.failed?.toLocaleString() || 0}</p>
                </div>
              </div>

              {/* Delivery Timeline */}
              {messaging.timeline && messaging.timeline.length > 0 && (
                <div>
                  <h3 className="text-body font-semibold text-deep mb-3">Delivery Over Time</h3>
                  <div className="space-y-2">
                    {messaging.timeline.map((period, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                      >
                        <p className="text-caption text-gray-600 w-24">{period.date}</p>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${period.deliveryRate || 0}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-caption font-medium text-deep w-20 text-right">
                          {period.sent?.toLocaleString() || 0} sent
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Revenue Reports */}
          <TabsContent value="revenue">
            <div className="space-y-6">
              <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
                <h2 className="text-h3 mb-4">Revenue Attribution</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-caption text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-h2 text-deep">${revenue.total?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-caption text-deep mb-1">From Campaigns</p>
                    <p className="text-h2 text-primary">${revenue.fromCampaigns?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-caption text-deep mb-1">From Automations</p>
                    <p className="text-h2 text-secondary">${revenue.fromAutomations?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="text-caption text-deep mb-1">ROI</p>
                    <p className="text-h2 text-accent">{revenue.roi || "0x"}</p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-caption text-gray-600 mb-2">Total Spent</p>
                    <p className="text-h2 text-deep mb-1">${revenue.spent?.toFixed(2) || "0.00"}</p>
                    <p className="text-caption text-gray-600">
                      Avg. cost per SMS: ${revenue.avgCostPerSMS?.toFixed(4) || "0.00"}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-caption text-deep mb-2">Net Profit</p>
                    <p className="text-h2 text-primary mb-1">
                      ${((revenue.total || 0) - (revenue.spent || 0)).toFixed(2)}
                    </p>
                    <p className="text-caption text-deep">
                      Profit margin: {revenue.profitMargin || "0%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Reports"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExportReports}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Export Reports'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="exportFormat">Export Format</Label>
            <Select
              id="exportFormat"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              options={[
                { value: 'csv', label: 'CSV' },
                { value: 'xlsx', label: 'Excel (XLSX)' },
                { value: 'pdf', label: 'PDF' }
              ]}
            />
          </div>

          <div>
            <Label>Include Data</Label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.campaigns}
                  onChange={(e) => setExportData({ ...exportData, campaigns: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Campaign Performance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.automations}
                  onChange={(e) => setExportData({ ...exportData, automations: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Automation Analytics</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.messaging}
                  onChange={(e) => setExportData({ ...exportData, messaging: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Messaging Activity</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.revenue}
                  onChange={(e) => setExportData({ ...exportData, revenue: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Revenue Attribution</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Export will include data for the selected date range: {filters.dateRange}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
