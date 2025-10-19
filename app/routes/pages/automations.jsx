import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";

export default function AutomationsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  const automations = data?.automations?.items || [];
  const stats = data?.stats || {};

  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    message: '',
    trigger: '',
    schedule: { delay: 1, timeUnit: 'hours' },
    conditions: []
  });

  const getAutomationIcon = (type) => {
    const icons = {
      welcome: "👋",
      "abandoned-cart": "🛒",
      birthday: "🎂",
      "order-confirmation": "✅",
      "shipping-notification": "📦",
      default: "🤖"
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const handleToggle = (automation) => {
    fetcher.submit(
      {
        _action: "updateAutomation",
        type: automation.type,
        enabled: String(!automation.enabled),
        message: automation.message || "",
        schedule: JSON.stringify(automation.schedule || {})
      },
      { method: "post" }
    );
  };

  const handleCreateAutomation = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          _action: "createAutomation",
          ...formData,
          schedule: JSON.stringify(formData.schedule)
        },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Automation created successfully!' });
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        type: '',
        message: '',
        trigger: '',
        schedule: { delay: 1, timeUnit: 'hours' },
        conditions: []
      });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to create automation: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAutomation = (automationId) => {
    if (confirm('Are you sure you want to delete this automation?')) {
      fetcher.submit(
        { _action: "deleteAutomation", id: automationId },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Automation deleted successfully!' });
    }
  };

  const handleDuplicateAutomation = (automation) => {
    setFormData({
      name: `${automation.name} (Copy)`,
      type: automation.type,
      message: automation.message,
      trigger: automation.trigger?.type || '',
      schedule: automation.schedule || { delay: 1, timeUnit: 'hours' },
      conditions: automation.conditions || []
    });
    setIsCreateModalOpen(true);
  };

  const handlePreviewAutomation = (automation) => {
    setSelectedAutomation(automation);
    setIsPreviewModalOpen(true);
  };

  const handleTestAutomation = (automationId) => {
    setLoading(true);
    fetcher.submit(
      { _action: "testAutomation", id: automationId },
      { method: "post" }
    );
    setAlert({ type: 'success', message: 'Test automation triggered!' });
    setLoading(false);
  };

  const handleExportAutomations = () => {
    const csvData = automations.map(automation => ({
      name: automation.name,
      type: automation.type,
      status: automation.enabled ? 'enabled' : 'disabled',
      message: automation.message,
      schedule: automation.schedule ? `${automation.schedule.delay} ${automation.schedule.timeUnit}` : '',
      stats: automation.stats ? `${automation.stats.sent || 0} sent, ${automation.stats.deliveryRate || '0%'} delivered` : ''
    }));
    
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'automations.csv');
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAutomations = automations.filter(automation => {
    if (filters.status !== 'all' && filters.status !== (automation.enabled ? 'enabled' : 'disabled')) return false;
    if (filters.type !== 'all' && automation.type !== filters.type) return false;
    if (filters.search && !automation.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const sortedAutomations = [...filteredAutomations].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <PageLayout>
      {/* Page Header */}
      <PageHeader
        title="Automations"
        subtitle="Set up automated SMS sequences based on customer behavior"
        actions={
          <ActionGroup>
            <ActionButton
              variant="outline"
              onClick={handleExportAutomations}
            >
              📊 Export
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              ➕ Create Automation
            </ActionButton>
          </ActionGroup>
        }
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Automations</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent>
        <PageSection>
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

        {/* Stats Overview */}
        {stats.totalAutomations !== undefined && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 mb-1">Total Automations</p>
                  <p className="text-h2 text-deep">{stats.totalAutomations || 0}</p>
                </div>
                <Badge variant="info" size="lg">🤖</Badge>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 mb-1">Active</p>
                  <p className="text-h2 text-primary">{stats.active || 0}</p>
                </div>
                <Badge variant="success" size="lg">✅</Badge>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 mb-1">Total Triggered</p>
                  <p className="text-h2 text-secondary">{stats.totalTriggered?.toLocaleString() || 0}</p>
                </div>
                <Badge variant="warning" size="lg">📈</Badge>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-gray-600 mb-1">Success Rate</p>
                  <p className="text-h2 text-deep">{stats.successRate || "0%"}</p>
                </div>
                <Badge variant="info" size="lg">📊</Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Advanced Filters */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
              className="rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' }
                ]}
              />
            </div>
            <div>
              <Label htmlFor="typeFilter">Type</Label>
              <Select
                id="typeFilter"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'welcome', label: 'Welcome' },
                  { value: 'abandoned-cart', label: 'Abandoned Cart' },
                  { value: 'birthday', label: 'Birthday' },
                  { value: 'order-confirmation', label: 'Order Confirmation' },
                  { value: 'shipping-notification', label: 'Shipping Notification' }
                ]}
              />
            </div>
            <div>
              <Label htmlFor="searchFilter">Search</Label>
              <Input
                id="searchFilter"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search automations..."
              />
            </div>
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'type', label: 'Type' },
                  { value: 'createdAt', label: 'Created Date' },
                  { value: 'stats.sent', label: 'Messages Sent' }
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Automations List */}
        {sortedAutomations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {sortedAutomations.map((automation) => (
              <Card key={automation.id || automation.type} className="hover:shadow-elevated transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-4xl">{getAutomationIcon(automation.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-h3">{automation.name || automation.type}</h2>
                        <Badge variant={automation.enabled ? 'success' : 'secondary'}>
                          {automation.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="info" size="sm">
                          {automation.type}
                        </Badge>
                      </div>
                      <p className="text-caption text-gray-600 mt-1">{automation.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(automation)}
                    disabled={fetcher.state === "submitting"}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                      automation.enabled ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                        automation.enabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Automation Details */}
                {automation.enabled && (
                  <div className="space-y-4">
                    {/* Trigger */}
                    {automation.trigger && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-caption text-gray-600 mb-1">Trigger</p>
                        <p className="text-body text-deep">{automation.trigger.description}</p>
                      </div>
                    )}

                    {/* Schedule */}
                    {automation.schedule && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-caption text-gray-600 mb-1">Schedule</p>
                        <p className="text-body text-deep">
                          {automation.schedule.delay} {automation.schedule.timeUnit} after trigger
                        </p>
                      </div>
                    )}

                    {/* Message Preview */}
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-caption text-deep mb-2">Message</p>
                      <p className="text-body text-gray-700">{automation.message}</p>
                    </div>

                    {/* Stats */}
                    {automation.stats && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-muted rounded-lg text-center">
                          <p className="text-caption text-gray-600">Sent</p>
                          <p className="text-body font-semibold text-deep">
                            {automation.stats.sent?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-center">
                          <p className="text-caption text-gray-600">Delivered</p>
                          <p className="text-body font-semibold text-primary">
                            {automation.stats.deliveryRate || "0%"}
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-center">
                          <p className="text-caption text-gray-600">Converted</p>
                          <p className="text-body font-semibold text-secondary">
                            {automation.stats.conversionRate || "0%"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handlePreviewAutomation(automation)}
                        disabled={loading}
                      >
                        👁️ Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          setSelectedAutomation(automation);
                          setEditMode(true);
                        }}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg"
                        onClick={() => handleTestAutomation(automation.id || automation.type)}
                        disabled={loading}
                      >
                        🧪 Test
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg"
                        onClick={() => handleDuplicateAutomation(automation)}
                        disabled={loading}
                      >
                        📋 Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          fetcher.submit(
                            { _action: "resetAutomation", type: automation.type },
                            { method: "post" }
                          );
                        }}
                        disabled={loading}
                      >
                        🔄 Reset
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteAutomation(automation.id || automation.type)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">🤖</span>
              <h3 className="text-h3 mt-4 mb-2">No automations configured</h3>
              <p className="text-caption mb-6">
                Set up automated SMS sequences to engage customers at the right time
              </p>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-xl"
              >
                ➕ Create Your First Automation
              </Button>
            </div>
          </Card>
        )}

      {/* Create Automation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Automation"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateAutomation}
              disabled={!formData.name || !formData.message || loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Automation'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Automation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome New Customers"
          />
          
          <Select
            label="Automation Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'welcome', label: 'Welcome New Customers' },
              { value: 'abandoned-cart', label: 'Abandoned Cart Recovery' },
              { value: 'birthday', label: 'Birthday Wishes' },
              { value: 'order-confirmation', label: 'Order Confirmation' },
              { value: 'shipping-notification', label: 'Shipping Notification' }
            ]}
          />
          
          <Textarea
            label="Message Content"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your automation message..."
            rows={4}
            maxLength={160}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Delay"
              type="number"
              value={formData.schedule.delay}
              onChange={(e) => setFormData({ 
                ...formData, 
                schedule: { ...formData.schedule, delay: parseInt(e.target.value) || 1 }
              })}
              min="1"
            />
            <Select
              label="Time Unit"
              value={formData.schedule.timeUnit}
              onChange={(e) => setFormData({ 
                ...formData, 
                schedule: { ...formData.schedule, timeUnit: e.target.value }
              })}
              options={[
                { value: 'minutes', label: 'Minutes' },
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' }
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editMode}
        onClose={() => {
          setEditMode(false);
          setSelectedAutomation(null);
        }}
        title={`Edit Automation: ${selectedAutomation?.name}`}
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                setSelectedAutomation(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </Button>
          </>
        }
      >
        {selectedAutomation && (
          <div className="space-y-4">
            <div>
              <Label>Automation Type</Label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <p className="text-body text-deep">{selectedAutomation.type}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="automationMessage">Message Content</Label>
              <Textarea
                id="automationMessage"
                defaultValue={selectedAutomation.message}
                placeholder="Enter automation message"
                rows={4}
              />
            </div>
            {selectedAutomation.schedule && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delay">Delay</Label>
                  <Input
                    id="delay"
                    type="number"
                    defaultValue={selectedAutomation.schedule.delay}
                  />
                </div>
                <div>
                  <Label htmlFor="timeUnit">Time Unit</Label>
                  <Select
                    id="timeUnit"
                    defaultValue={selectedAutomation.schedule.timeUnit}
                    options={[
                      { value: 'minutes', label: 'Minutes' },
                      { value: 'hours', label: 'Hours' },
                      { value: 'days', label: 'Days' }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Automation Preview"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setIsPreviewModalOpen(false);
              setSelectedAutomation(selectedAutomation);
              setEditMode(true);
            }}>
              Edit Automation
            </Button>
          </>
        }
      >
        {selectedAutomation && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getAutomationIcon(selectedAutomation.type)}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAutomation.name}
                </h3>
                <Badge variant={selectedAutomation.enabled ? 'success' : 'secondary'}>
                  {selectedAutomation.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Message Content:</p>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {selectedAutomation.message}
              </p>
            </div>

            {selectedAutomation.trigger && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Trigger:</p>
                <p className="text-sm text-blue-800">{selectedAutomation.trigger.description}</p>
              </div>
            )}

            {selectedAutomation.schedule && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900 mb-2">Schedule:</p>
                <p className="text-sm text-green-800">
                  {selectedAutomation.schedule.delay} {selectedAutomation.schedule.timeUnit} after trigger
                </p>
              </div>
            )}

            {selectedAutomation.stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-1">Sent</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAutomation.stats.sent?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-1">Delivered</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAutomation.stats.deliveryRate || '0%'}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-1">Converted</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAutomation.stats.conversionRate || '0%'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
