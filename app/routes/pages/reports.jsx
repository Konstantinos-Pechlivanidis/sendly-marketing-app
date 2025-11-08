import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Select } from "../../components/ui/Select";
import { Input, Label } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";

export default function ReportsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  // Adapt to backend response structure
  const overview = data?.overview || {};
  const campaigns = data?.campaigns || {};
  const automations = data?.automations || {};
  const messaging = data?.messaging || {};
  const credits = data?.credits || {};
  const contacts = data?.contacts || {};
  const kpis = data?.kpis || {};

  const [dateRange, setDateRange] = useState("30d");
  // const [loading, setLoading] = useState(false); // Use fetcher.state instead
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

  // Handle fetcher responses
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const responseData = fetcher.data?.data || fetcher.data;
      const { success, message, error } = responseData;
      
      if (success !== false) {
        setAlert({ type: 'success', message: message || 'Action completed successfully!' });
      } else {
        setAlert({ type: 'error', message: error || message || 'An error occurred.' });
      }
    }
  }, [fetcher.state, fetcher.data]);

  // Refresh data by submitting to reload via fetcher
  const handleRefreshData = () => {
    // Use fetcher to reload data
    fetcher.load(window.location.pathname + window.location.search);
  };

  const handleExportReports = () => {
    // Calculate date range
    const toDate = new Date();
    const fromDate = new Date();
    const range = filters.dateRange || "30d";
    if (range === "7d") {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (range === "30d") {
      fromDate.setDate(fromDate.getDate() - 30);
    } else if (range === "90d") {
      fromDate.setDate(fromDate.getDate() - 90);
    }
    const from = fromDate.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];
    
    // Determine export type
    const exportTypes = [];
    if (exportData.campaigns) exportTypes.push('campaigns');
    if (exportData.automations) exportTypes.push('automations');
    if (exportData.messaging) exportTypes.push('messaging');
    if (exportData.revenue) exportTypes.push('credits');
    const type = exportTypes.length === 1 ? exportTypes[0] : 'all';
    
    fetcher.submit(
      {
        _action: "exportReports",
        type,
        format: exportFormat,
        from,
        to
      },
      { method: "post" }
    );
    setIsExportModalOpen(false);
  };

  // Note: Backend doesn't support scheduled reports
  // This would be a future feature
  const handleScheduleReport = () => {
    setAlert({ 
      type: 'info', 
      message: 'Scheduled reports feature is coming soon!' 
    });
  };

  const getGrowthColor = (growth) => {
    if (!growth) return 'text-gray-500';
    const value = parseFloat(growth.replace(/[+%-]/g, ''));
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getGrowthIconName = (growth) => {
    if (!growth) return 'minus';
    const value = parseFloat(growth.replace(/[+%-]/g, ''));
    if (value > 0) return 'arrowUp';
    if (value < 0) return 'arrowDown';
    return 'minus';
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

  const isSubmitting = fetcher.state === 'submitting';

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

      <PageHeader
        title="Reports & Analytics"
        subtitle="Track performance and measure ROI"
        actions={
          <ActionGroup>
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: '1y', label: 'Last year' }
              ]}
              className="min-w-[150px]" 
            />
            <ActionButton
              variant="outline"
              onClick={handleRefreshData}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="refresh" size="sm" className="mr-2" />} Refresh
            </ActionButton>
            <ActionButton
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Icon name="download" size="sm" className="mr-2" /> Export
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleScheduleReport}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="calendar" size="sm" className="mr-2" />} Schedule
            </ActionButton>
          </ActionGroup>
        }
      >
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Reports</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Main Content */}
      {/* CHANGED: Added space-y-8 for more vertical spacing between sections */}
      <PageContent className="space-y-8"> 
        {/* Key Metrics */}
        <PageSection>
           {/* CHANGED: Increased gap to gap-8 */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total SMS Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.totalSent?.toLocaleString() || 0}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-medium ${getGrowthColor(overview.sentGrowth)} flex items-center`}>
                      <Icon name={getGrowthIconName(overview.sentGrowth)} size="xs" className="mr-1" /> {overview.sentGrowth || "+0%"}
                    </span>
                    <span className="text-xs text-gray-500">vs previous period</span>
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
                  <p className="text-3xl font-bold text-primary">{formatPercentage(overview.deliveryRate)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      {overview.totalDelivered?.toLocaleString() || 0} delivered
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="check" size="lg" className="text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(revenue.total)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-medium ${getGrowthColor(revenue.growth)} flex items-center`}>
                      <Icon name={getGrowthIconName(revenue.growth)} size="xs" className="mr-1" /> {revenue.growth || "+0%"}
                    </span>
                    <span className="text-xs text-gray-500">vs previous period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Icon name="money" size="lg" className="text-secondary" />
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ROI</p>
                  <p className="text-3xl font-bold text-secondary">{revenue.roi || "0x"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      {formatCurrency(revenue.spent)} spent
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Icon name="chart" size="lg" className="text-accent" />
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* Detailed Reports Tabs */}
        <PageSection>
          <Tabs defaultValue="campaigns">
            <TabsList className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 bg-gray-100 rounded-xl mb-8 shadow-inner">
              <TabsTrigger 
                value="campaigns" 
                className="flex-1 px-4 py-1 text-secondary text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="campaign" size="sm" /> Campaigns 
              </TabsTrigger>
              <TabsTrigger 
                value="automations" 
                className="flex-1 px-4 py-1 text-secondary text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="automation" size="sm" /> Automations
              </TabsTrigger>
              <TabsTrigger 
                value="messaging" 
                className="flex-1 px-4 py-1 text-secondary text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="sms" size="sm" /> Messaging
              </TabsTrigger>
              <TabsTrigger 
                value="revenue" 
                className="flex-1 px-4 py-1 text-secondary text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="money" size="sm" /> Revenue
              </TabsTrigger>
            </TabsList>

            {/* Campaign Reports */}
            <TabsContent value="campaigns">
               {/* CHANGED: Increased space-y-8 */}
              <div className="space-y-8">
                <Card className="p-6">
                  {/* CHANGED: Increased mb-6 */}
                  <div className="flex items-center justify-between mb-6"> 
                    <h2 className="text-h3">Campaign Performance</h2>
                    <Badge variant="info" size="lg">
                      {campaigns.total || 0} campaigns
                    </Badge>
                  </div>
                   {/* CHANGED: Increased gap-6 and mb-8 */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                    <Card className="p-4 bg-muted">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-caption text-gray-600 mb-1">Total Campaigns</p>
                          <p className="text-h2 text-deep">{campaigns.total || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                           <Icon name="campaign" size="md" className="text-gray-600" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-primary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-caption text-deep mb-1">Avg. Delivery Rate</p>
                          <p className="text-h2 text-primary">{formatPercentage(campaigns.avgDeliveryRate)}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                           <Icon name="check" size="md" className="text-green-600" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-secondary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-caption text-deep mb-1">Avg. Conversion</p>
                          <p className="text-h2 text-secondary">{formatPercentage(campaigns.avgConversionRate)}</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                           <Icon name="chart" size="md" className="text-yellow-600" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Top Campaigns */}
                  {campaigns.topCampaigns && campaigns.topCampaigns.length > 0 && (
                    <div>
                      {/* CHANGED: Increased mb-4 */}
                      <h3 className="text-body font-semibold text-deep mb-4">Top Performing Campaigns</h3>
                      {/* CHANGED: Increased space-y-4 */}
                      <div className="space-y-4">
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
              <Card className="p-6">
                 {/* CHANGED: Increased mb-6 */}
                 <h2 className="text-h3 mb-6">Automation Performance</h2>
                  {/* CHANGED: Increased gap-6 and mb-8 */}
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
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
                     <p className="text-h2 text-deep">{formatCurrency(automations.avgRevenue)}</p>
                   </div>
                 </div>

                 {/* Automation Breakdown */}
                 {automations.breakdown && automations.breakdown.length > 0 && (
                   <div>
                    {/* CHANGED: Increased mb-4 */}
                     <h3 className="text-body font-semibold text-deep mb-4">By Type</h3>
                      {/* CHANGED: Increased gap-4 */}
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                       {automations.breakdown.map((auto) => (
                         <Card
                           key={auto.type}
                           className="p-4 bg-muted rounded-lg hover:shadow-md transition-shadow"
                         >
                           <div className="flex items-center justify-between mb-2">
                             <p className="text-body font-medium text-deep capitalize">{auto.type}</p>
                             <Badge variant={auto.enabled ? "positive" : "default"} size="sm">
                               {auto.enabled ? "Active" : "Inactive"}
                             </Badge>
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
                         </Card>
                       ))}
                     </div>
                   </div>
                 )}
               </Card>
            </TabsContent>

            {/* Messaging Reports */}
            <TabsContent value="messaging">
               <Card className="p-6">
                 {/* CHANGED: Increased mb-6 */}
                 <h2 className="text-h3 mb-6">Messaging Activity</h2>
                 {/* CHANGED: Increased gap-6 and mb-8 */}
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                   <div className="p-4 bg-muted rounded-lg">
                     <p className="text-caption text-gray-600 mb-1">Total Messages</p>
                     <p className="text-h2 text-deep">{messaging.total?.toLocaleString() || 0}</p>
                   </div>
                   <div className="p-4 bg-primary/10 rounded-lg">
                     <p className="text-caption text-deep mb-1">Delivered</p>
                     <p className="text-h2 text-primary">{messaging.delivered?.toLocaleString() || 0}</p>
                   </div>
                   <div className="p-4 bg-red-50 rounded-lg">
                     <p className="text-caption text-deep mb-1">Failed</p>
                     <p className="text-h2 text-red-600">{messaging.failed?.toLocaleString() || 0}</p>
                   </div>
                 </div>

                 {/* Delivery Timeline */}
                 {messaging.timeline && messaging.timeline.length > 0 && (
                   <div>
                     {/* CHANGED: Increased mb-4 */}
                     <h3 className="text-body font-semibold text-deep mb-4">Delivery Over Time</h3>
                     {/* CHANGED: Increased space-y-3 */}
                     <div className="space-y-3">
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
               </Card>
            </TabsContent>

            {/* Revenue Reports */}
            <TabsContent value="revenue">
               {/* CHANGED: Increased space-y-8 */}
               <div className="space-y-8">
                 <Card className="p-6">
                  {/* CHANGED: Increased mb-6 */}
                   <h2 className="text-h3 mb-6">Revenue Attribution</h2>
                   {/* CHANGED: Increased gap-6 and mb-8 */}
                   <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
                     <div className="p-4 bg-muted rounded-lg">
                       <p className="text-caption text-gray-600 mb-1">Total Revenue</p>
                       <p className="text-h2 text-deep">{formatCurrency(revenue.total)}</p>
                     </div>
                     <div className="p-4 bg-primary/10 rounded-lg">
                       <p className="text-caption text-deep mb-1">From Campaigns</p>
                       <p className="text-h2 text-primary">{formatCurrency(revenue.fromCampaigns)}</p>
                     </div>
                     <div className="p-4 bg-secondary/10 rounded-lg">
                       <p className="text-caption text-deep mb-1">From Automations</p>
                       <p className="text-h2 text-secondary">{formatCurrency(revenue.fromAutomations)}</p>
                     </div>
                     <div className="p-4 bg-accent/10 rounded-lg">
                       <p className="text-caption text-deep mb-1">ROI</p>
                       <p className="text-h2 text-accent">{revenue.roi || "0x"}</p>
                     </div>
                   </div>

                   {/* Cost Breakdown */}
                   {/* CHANGED: Increased gap-6 and mt-8 */}
                   <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
                     <div className="p-4 bg-muted rounded-lg">
                       <p className="text-caption text-gray-600 mb-2">Total Spent</p>
                       <p className="text-h2 text-deep mb-1">{formatCurrency(revenue.spent)}</p>
                       <p className="text-caption text-gray-600">
                         Avg. cost per SMS: {formatCurrency(revenue.avgCostPerSMS)}
                       </p>
                     </div>
                     <div className="p-4 bg-primary/10 rounded-lg">
                       <p className="text-caption text-deep mb-2">Net Profit</p>
                       <p className="text-h2 text-primary mb-1">
                         {formatCurrency((revenue.total || 0) - (revenue.spent || 0))}
                       </p>
                       <p className="text-caption text-deep">
                         Profit margin: {revenue.profitMargin || "0%"}
                       </p>
                     </div>
                   </div>
                 </Card>
               </div>
            </TabsContent>
          </Tabs>
        </PageSection>
      </PageContent>

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
              disabled={isSubmitting} // Use fetcher state
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="download" size="sm" className="mr-2" />}
               Export Reports
            </Button>
          </>
        }
      >
        {/* CHANGED: Increased space-y-6 */}
        <div className="space-y-6"> 
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
            {/* CHANGED: Increased space-y-3 */}
            <div className="space-y-3 mt-2"> 
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.campaigns}
                  onChange={(e) => setExportData({ ...exportData, campaigns: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Campaign Performance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.automations}
                  onChange={(e) => setExportData({ ...exportData, automations: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Automation Analytics</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.messaging}
                  onChange={(e) => setExportData({ ...exportData, messaging: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Messaging Activity</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportData.revenue}
                  onChange={(e) => setExportData({ ...exportData, revenue: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
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
    </PageLayout>
  );
}