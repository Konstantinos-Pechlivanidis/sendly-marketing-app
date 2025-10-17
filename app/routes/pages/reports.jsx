import { useLoaderData } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";

export default function ReportsPage() {
  const data = useLoaderData();
  
  const overview = data?.overview?.data || {};
  const campaigns = data?.campaigns?.data || {};
  const automations = data?.automations?.data || {};
  const messaging = data?.messaging?.data || {};
  const revenue = data?.revenue?.data || {};

  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h1">Reports & Analytics</h1>
            <p className="text-caption mt-1">Track performance and measure ROI</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" className="rounded-xl">
              📥 Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Total SMS Sent</p>
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-h2 text-deep">{overview.totalSent?.toLocaleString() || 0}</p>
            <p className="text-caption text-primary mt-1">
              {overview.sentGrowth || "+0%"} vs previous period
            </p>
          </div>

          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Delivery Rate</p>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-h2 text-primary">{overview.deliveryRate || "0%"}</p>
            <p className="text-caption text-secondary mt-1">
              {overview.totalDelivered?.toLocaleString() || 0} delivered
            </p>
          </div>

          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">Total Revenue</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-h2 text-deep">${revenue.total?.toFixed(2) || "0.00"}</p>
            <p className="text-caption text-primary mt-1">
              {revenue.growth || "+0%"} vs previous period
            </p>
          </div>

          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-gray-600">ROI</p>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-h2 text-secondary">{revenue.roi || "0x"}</p>
            <p className="text-caption text-deep mt-1">
              ${revenue.spent?.toFixed(2) || "0.00"} spent
            </p>
          </div>
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
              <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
                <h2 className="text-h3 mb-4">Campaign Performance</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-caption text-gray-600 mb-1">Total Campaigns</p>
                    <p className="text-h2 text-deep">{campaigns.total || 0}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-caption text-deep mb-1">Avg. Delivery Rate</p>
                    <p className="text-h2 text-primary">{campaigns.avgDeliveryRate || "0%"}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-caption text-deep mb-1">Avg. Conversion</p>
                    <p className="text-h2 text-secondary">{campaigns.avgConversionRate || "0%"}</p>
                  </div>
                </div>

                {/* Top Campaigns */}
                {campaigns.topCampaigns && campaigns.topCampaigns.length > 0 && (
                  <div>
                    <h3 className="text-body font-semibold text-deep mb-3">Top Performing Campaigns</h3>
                    <div className="space-y-3">
                      {campaigns.topCampaigns.map((campaign, idx) => (
                        <div
                          key={campaign.id || idx}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-primary/10 transition-colors duration-200"
                        >
                          <div className="flex-1">
                            <p className="text-body font-medium text-deep">{campaign.name}</p>
                            <p className="text-caption text-gray-600">
                              {campaign.sent?.toLocaleString() || 0} sent • {campaign.deliveryRate || "0%"} delivered
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-body font-semibold text-primary">
                              {campaign.conversionRate || "0%"}
                            </p>
                            <p className="text-caption text-gray-600">conversion</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
    </div>
  );
}
