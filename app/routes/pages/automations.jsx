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
import { Icon } from "../../components/ui/Icon";

export default function AutomationsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  // Adapt to backend response structure
  const automations = Array.isArray(data?.automations) ? data.automations : data?.automations?.items || [];
  const stats = data?.stats?.data || data?.stats || {};
  const defaults = Array.isArray(data?.defaults) ? data.defaults : [];

  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // const [loading, setLoading] = useState(false); // Use fetcher.state
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

   // Handle fetcher responses
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const responseData = fetcher.data?.data || fetcher.data;
      const { success, message, error } = responseData;
      
      if (success !== false) {
        setAlert({ type: 'success', message: message || 'Action completed successfully!' });
        // Optionally reload data here if needed
      } else {
        setAlert({ type: 'error', message: error || message || 'An error occurred.' });
      }
    }
  }, [fetcher.state, fetcher.data]);


  const getAutomationIcon = (type) => {
    const icons = {
      welcome: "users",
      "abandoned-cart": "cart",
      birthday: "calendar",
      "order-confirmation": "check", // Changed from success for clarity
      "shipping-notification": "delivery",
      default: "automation"
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const handleToggle = (automation) => {
    fetcher.submit(
      {
        _action: "updateAutomation",
        id: automation.id || automation.automationId,
        userMessage: automation.userMessage || automation.message || automation.defaultMessage || "",
        isActive: String(!automation.isActive)
      },
      { method: "post" }
    );
  };

  // Note: Backend doesn't support creating new automations
  // Users can only configure existing system automations
  const handleCreateAutomation = async () => {
    setAlert({ 
      type: 'info', 
      message: 'Automations are pre-configured. You can customize existing automations by editing them.' 
    });
    setIsCreateModalOpen(false);
  };

   const handleUpdateAutomation = async () => {
     if (!selectedAutomation) return;
     
     // Backend only supports updating userMessage and isActive
     fetcher.submit(
       {
         _action: "updateAutomation",
         id: selectedAutomation.id || selectedAutomation.automationId,
         userMessage: formData.message || formData.userMessage || selectedAutomation.userMessage || "",
         isActive: String(formData.isActive !== undefined ? formData.isActive : selectedAutomation.isActive)
       },
       { method: "post" }
     );
     // Optimistic close
     setEditMode(false);
     setSelectedAutomation(null);
   };

  // Note: Backend doesn't support deleting automations
  // Users can only disable automations
  const handleDeleteAutomation = (automation) => {
    if (confirm('Are you sure you want to disable this automation?')) {
      fetcher.submit(
        {
          _action: "updateAutomation",
          id: automation.id || automation.automationId,
          userMessage: automation.userMessage || automation.message || "",
          isActive: "false"
        },
        { method: "post" }
      );
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
    // setLoading(true); // Handled by fetcher.state
    fetcher.submit(
      { _action: "testAutomation", id: automationId },
      { method: "post" }
    );
    // Optimistic alert removed - rely on fetcher effect
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
    
    if (csvData.length === 0) {
      setAlert({ type: 'info', message: 'No automations to export.' });
      return;
    }
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'automations.csv');
    setAlert({ type: 'success', message: 'Automations exported successfully!' });
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')) // Handle quotes in data
    ].join('\n');
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // Added charset
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Append for Firefox
    a.click();
    document.body.removeChild(a); // Clean up
    window.URL.revokeObjectURL(url);
  };

  const filteredAutomations = automations.filter(automation => {
    if (filters.status !== 'all' && filters.status !== (automation.enabled ? 'enabled' : 'disabled')) return false;
    if (filters.type !== 'all' && automation.type !== filters.type) return false;
    if (filters.search && !automation.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const sortedAutomations = [...filteredAutomations].sort((a, b) => {
    // Handle nested stats sorting
    const getSortValue = (obj, key) => {
        if (key.startsWith('stats.')) {
            const statKey = key.split('.')[1];
            return obj.stats ? (obj.stats[statKey] || 0) : 0; // Default to 0 if stats or key missing
        }
        return obj[key] || '';
    };

    const aValue = getSortValue(a, sortBy);
    const bValue = getSortValue(b, sortBy);

    if (typeof aValue === 'number' && typeof bValue === 'number') {
         return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Fallback to string comparison
    return sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
  });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const isSubmitting = fetcher.state === 'submitting';

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
              {/* CHANGED: Replaced icon */}
              <Icon name="download" size="sm" className="mr-2" /> Export
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={() => {
                // Reset form data for clean create modal
                setFormData({ 
                   name: '', type: '', message: '', trigger: '', 
                   schedule: { delay: 1, timeUnit: 'hours' }, conditions: [] 
                });
                setIsCreateModalOpen(true);
              }}
            >
              <Icon name="plus" size="sm" className="mr-2" /> Create Automation
            </ActionButton>
          </ActionGroup>
        }
      >
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Automations</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      {/* CHANGED: Added space-y-8 */}
      <PageContent className="space-y-8"> 
        {/* Alert */}
        {alert && (
          <div className="fixed top-20 right-4 z-50 max-w-md"> {/* Adjusted top */}
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* CHANGED: Removed Hero Section, stats/filters moved into separate sections */}
        
        {/* Stats Overview */}
        <PageSection>
          {stats.totalAutomations !== undefined && (
            // CHANGED: Increased gap-8
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4"> 
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Automations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAutomations || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="automation" size="lg" className="text-primary" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-primary">{stats.active || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="check" size="lg" className="text-green-600" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Triggered</p>
                    <p className="text-3xl font-bold text-secondary">{stats.totalTriggered?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Icon name="chart" size="lg" className="text-secondary" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-deep">{stats.successRate || "0%"}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Icon name="analytics" size="lg" className="text-accent" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </PageSection>

        {/* Advanced Filters & Sorting */}
        <PageSection>
          <Card className="bg-white rounded-xl p-6 shadow-sm">
             {/* CHANGED: Increased mb-6 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-deep">Filter & Sort Automations</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
                className="rounded-lg"
              >
                 <Icon name="close" size="sm" className="mr-2" /> Clear Filters
              </Button>
            </div>
            {/* CHANGED: Increased gap-6 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"> 
              <div className="md:col-span-2 lg:col-span-2"> {/* Search wider */}
                <Label htmlFor="searchFilter">Search by Name</Label>
                <Input
                  id="searchFilter"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search automations..."
                />
              </div>
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
                    { value: 'order-confirmation', label: 'Order Confirm' },
                    { value: 'shipping-notification', label: 'Shipping Notify' }
                  ]}
                />
              </div>
              {/* Sorting options */}
              <div className="grid grid-cols-2 gap-4 md:col-span-3 lg:col-span-1"> {/* Group sort */}
                 <div>
                   <Label htmlFor="sortBy">Sort By</Label>
                   <Select
                     id="sortBy"
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     options={[
                       { value: 'name', label: 'Name' },
                       { value: 'type', label: 'Type' },
                       { value: 'createdAt', label: 'Created' }, // Assuming createdAt exists
                       { value: 'stats.sent', label: 'Sent' }
                     ]}
                   />
                 </div>
                 <div>
                   <Label htmlFor="sortOrder">Order</Label>
                   <Select
                     id="sortOrder"
                     value={sortOrder}
                     onChange={(e) => setSortOrder(e.target.value)}
                     options={[
                       { value: 'asc', label: 'Asc' },
                       { value: 'desc', label: 'Desc' }
                     ]}
                   />
                 </div>
              </div>
            </div>
          </Card>
        </PageSection>

        {/* Automations List */}
        <PageSection>
          {sortedAutomations.length > 0 ? (
            // CHANGED: Increased gap-8
            <div className="grid grid-cols-1 gap-8"> 
              {sortedAutomations.map((automation) => (
                <Card key={automation.id || automation.type} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1"> {/* Increased gap */}
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name={getAutomationIcon(automation.type)} size="lg" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                        <div className="flex flex-wrap items-center gap-2 mb-1"> {/* Flex wrap */}
                          <h2 className="text-xl font-semibold text-deep truncate">{automation.name || automation.type}</h2>
                          <Badge variant={automation.enabled ? 'positive' : 'default'} size="sm">
                            {automation.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="info" size="sm" className="hidden sm:inline-flex"> {/* Hide on smaller screens */}
                            {automation.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">{automation.description || 'No description provided.'}</p>
                      </div>
                    </div>
                    {/* Toggle Switch - Needs Tailwind Forms plugin or custom styling */}
                    <button
                      onClick={() => handleToggle(automation)}
                      disabled={isSubmitting && fetcher.submission?.formData.get('id') === (automation.id || automation.type) } // Disable only the specific one being toggled
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                        automation.enabled ? "bg-primary" : "bg-gray-200"
                      }`}
                      role="switch"
                      aria-checked={automation.enabled}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          automation.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Automation Details - Conditionally Rendered or Expandable */}
                  {automation.enabled && ( // Example: Show details only if enabled
                    // CHANGED: Increased space-y-6
                    <div className="space-y-6 pt-4 border-t border-gray-100"> 
                      {/* Trigger */}
                      {automation.trigger && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Trigger</p>
                          <p className="text-sm text-gray-800">{automation.trigger.description || automation.trigger.type || 'Not specified'}</p>
                        </div>
                      )}

                      {/* Schedule */}
                      {automation.schedule && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Schedule</p>
                          <p className="text-sm text-gray-800">
                            {automation.schedule.delay} {automation.schedule.timeUnit} after trigger
                          </p>
                        </div>
                      )}

                      {/* Message Preview */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">Message</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{automation.message || 'No message content.'}</p>
                      </div>

                      {/* Stats */}
                      {automation.stats && (
                        // CHANGED: Increased gap-6
                        <div className="grid grid-cols-3 gap-6"> 
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Sent</p>
                            <p className="text-lg font-semibold text-deep mt-1">
                              {automation.stats.sent?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Delivered</p>
                            <p className="text-lg font-semibold text-primary mt-1">
                              {automation.stats.deliveryRate || "0%"}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Converted</p>
                            <p className="text-lg font-semibold text-secondary mt-1">
                              {automation.stats.conversionRate || "0%"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {/* CHANGED: Increased gap-3 */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100"> 
                        <Button
                          variant="outline" size="sm" className="rounded-lg"
                          onClick={() => handlePreviewAutomation(automation)}
                        >
                           <Icon name="search" size="sm" className="mr-2" /> Preview
                        </Button>
                        <Button
                          variant="outline" size="sm" className="rounded-lg"
                          onClick={() => {
                            // Populate formData for editing
                            setFormData({
                               name: automation.name || '',
                               type: automation.type || '',
                               message: automation.message || '',
                               trigger: automation.trigger?.type || '',
                               schedule: automation.schedule || { delay: 1, timeUnit: 'hours' },
                               conditions: automation.conditions || []
                            });
                            setSelectedAutomation(automation);
                            setEditMode(true);
                          }}
                        >
                           <Icon name="edit" size="sm" className="mr-2" /> Edit
                        </Button>
                        <Button 
                          variant="outline" size="sm" className="rounded-lg"
                          onClick={() => handleTestAutomation(automation.id || automation.type)}
                          disabled={isSubmitting}
                        >
                           <Icon name="send" size="sm" className="mr-2" /> Test
                        </Button>
                        <Button 
                          variant="outline" size="sm" className="rounded-lg"
                          onClick={() => handleDuplicateAutomation(automation)}
                        >
                           <Icon name="copy" size="sm" className="mr-2" /> Duplicate
                        </Button>
                        <Button
                          variant="outline" size="sm" className="rounded-lg"
                          onClick={() => {
                            fetcher.submit(
                              { _action: "resetAutomation", id: automation.id || automation.type }, // Pass ID
                              { method: "post" }
                            );
                          }}
                          disabled={isSubmitting}
                        >
                           <Icon name="refresh" size="sm" className="mr-2" /> Reset Stats
                        </Button>
                        <Button
                          variant="outline" size="sm"
                          className="rounded-lg text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDeleteAutomation(automation.id || automation.type)}
                          disabled={isSubmitting}
                        >
                           <Icon name="trash" size="sm" className="mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"> {/* Increased mb */}
                   <Icon name="automation" size="2xl" className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-deep mt-4 mb-3">No automations found</h3> {/* Increased mb */}
                <p className="text-base text-deep/90 leading-relaxed mb-8"> {/* Increased mb */}
                  {filters.status !== 'all' || filters.type !== 'all' || filters.search
                    ? "Try adjusting your filters or search term."
                    : "Set up automated SMS sequences to engage customers at the right time."}
                </p>
                {filters.status === 'all' && filters.type === 'all' && !filters.search && (
                   <Button
                     variant="primary"
                     onClick={() => setIsCreateModalOpen(true)}
                     className="rounded-xl"
                   >
                     <Icon name="plus" size="sm" className="mr-2" /> Create Your First Automation
                   </Button>
                )}
              </div>
            </Card>
          )}
        </PageSection>
      </PageContent>

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
              disabled={!formData.name || !formData.type || !formData.message || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="plus" size="sm" className="mr-2" />}
               Create Automation
            </Button>
          </>
        }
      >
        {/* CHANGED: Increased space-y-6 */}
        <div className="space-y-6"> 
          <Input
            label="Automation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome New Customers"
            required
          />
          
          <Select
            label="Automation Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: '', label: 'Select Type...' }, // Added placeholder
              { value: 'welcome', label: 'Welcome New Customers' },
              { value: 'abandoned-cart', label: 'Abandoned Cart Recovery' },
              { value: 'birthday', label: 'Birthday Wishes' },
              { value: 'order-confirmation', label: 'Order Confirmation' },
              { value: 'shipping-notification', label: 'Shipping Notification' }
            ]}
            required
          />
          
          <Textarea
            label="Message Content"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your automation message... Use {firstName}, {orderNumber} etc. for placeholders."
            rows={4}
            maxLength={160} // Standard SMS length
            required
          />
          
           {/* Schedule section - simplified */}
          <div>
             <Label>Schedule (after trigger)</Label>
             <div className="grid grid-cols-2 gap-4 mt-1">
               <Input
                 label="Delay"
                 type="number"
                 value={formData.schedule.delay}
                 onChange={(e) => setFormData({ 
                   ...formData, 
                   schedule: { ...formData.schedule, delay: Math.max(0, parseInt(e.target.value)) || 0 } // Ensure non-negative
                 })}
                 min="0" // Allow 0 for immediate
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
             <p className="text-xs text-gray-500 mt-1">Set delay to 0 minutes for immediate sending.</p>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editMode && selectedAutomation !== null} // Ensure selectedAutomation is not null
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
            <Button 
              variant="primary" 
              onClick={handleUpdateAutomation} // Use the new handler
              disabled={isSubmitting || !formData.message} // Basic validation
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="check" size="sm" className="mr-2" />}
               Save Changes
            </Button>
          </>
        }
      >
        {selectedAutomation && (
           // CHANGED: Increased space-y-6
          <div className="space-y-6">
            <div>
              <Label>Automation Type</Label>
              <div className="mt-1 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700">{selectedAutomation.type}</p>
              </div>
            </div>
             <Input
               label="Automation Name"
               value={formData.name} // Use formData
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               placeholder="e.g. Welcome New Customers"
               required
             />
            <div>
              <Label htmlFor="editAutomationMessage">Message Content</Label>
              <Textarea
                id="editAutomationMessage"
                value={formData.message} // Use formData
                onChange={(e) => setFormData({...formData, message: e.target.value })}
                placeholder="Enter automation message"
                rows={4}
                maxLength={160}
                required
              />
            </div>
             {/* Schedule section */}
            <div>
               <Label>Schedule (after trigger)</Label>
               <div className="grid grid-cols-2 gap-4 mt-1">
                 <Input
                   label="Delay"
                   type="number"
                   value={formData.schedule.delay}
                   onChange={(e) => setFormData({ 
                     ...formData, 
                     schedule: { ...formData.schedule, delay: Math.max(0, parseInt(e.target.value)) || 0 }
                   })}
                   min="0"
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
               <p className="text-xs text-gray-500 mt-1">Set delay to 0 minutes for immediate sending.</p>
            </div>
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
              // Populate formData for editing when Edit is clicked from Preview
              if (selectedAutomation) {
                  setFormData({
                     name: selectedAutomation.name || '',
                     type: selectedAutomation.type || '',
                     message: selectedAutomation.message || '',
                     trigger: selectedAutomation.trigger?.type || '',
                     schedule: selectedAutomation.schedule || { delay: 1, timeUnit: 'hours' },
                     conditions: selectedAutomation.conditions || []
                  });
              }
              setEditMode(true); 
            }}>
               <Icon name="edit" size="sm" className="mr-2" /> Edit Automation
            </Button>
          </>
        }
      >
        {selectedAutomation && (
          // CHANGED: Increased space-y-6
          <div className="space-y-6"> 
            <div className="flex items-center gap-4"> {/* Increased gap */}
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={getAutomationIcon(selectedAutomation.type)} size="lg" className="text-primary"/>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAutomation.name}
                </h3>
                <Badge variant={selectedAutomation.enabled ? 'positive' : 'default'} size="sm">
                  {selectedAutomation.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Message Content</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {selectedAutomation.message}
              </p>
            </div>

            {selectedAutomation.trigger && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wider">Trigger</p>
                <p className="text-sm text-blue-800">{selectedAutomation.trigger.description || selectedAutomation.trigger.type}</p>
              </div>
            )}

            {selectedAutomation.schedule && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs font-medium text-green-600 mb-1 uppercase tracking-wider">Schedule</p>
                <p className="text-sm text-green-800">
                  {selectedAutomation.schedule.delay} {selectedAutomation.schedule.timeUnit} after trigger
                </p>
              </div>
            )}

            {selectedAutomation.stats && (
               // CHANGED: Increased gap-6
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sent</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedAutomation.stats.sent?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Delivered</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedAutomation.stats.deliveryRate || '0%'}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Converted</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedAutomation.stats.conversionRate || '0%'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}