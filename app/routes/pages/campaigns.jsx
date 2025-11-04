/* eslint-disable no-unused-vars */
import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";
import { api } from "../../utils/api.client";

export default function CampaignsPage() {
  const data = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    audienceId: 'aud_all_consented',
    discountId: '',
    scheduleType: 'immediate',
    scheduleAt: '',
    recurringDays: ''
  });

  // Adapt to backend response structure
  const campaigns = data?.campaigns?.data?.campaigns || data?.campaigns?.items || [];
  const stats = data?.stats?.data || data?.stats || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString) => {
    if (!mounted) return "Loading...";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const handleCreateCampaign = async () => {
    // Build payload as per backend API
    const payload = {
      name: formData.name,
      message: formData.message
    };
    // Audience
    if (formData.audienceId && formData.audienceId !== '') {
      // Convert to API model: expects audience, not audienceId
      if (formData.audienceId.startsWith('segment:') || ["all","male","female","men","women"].includes(formData.audienceId)) {
        payload.audience = formData.audienceId;
      }
    }
    if (formData.discountId) {
      payload.discountId = formData.discountId;
    }
    if (formData.scheduleType === 'scheduled' && formData.scheduleAt) {
      payload.scheduleType = 'scheduled';
      payload.scheduleAt = formData.scheduleAt;
    }
    if (formData.scheduleType === 'recurring' && formData.recurringDays) {
      payload.scheduleType = 'recurring';
      payload.recurringDays = Number(formData.recurringDays);
    }
    // "immediate" is default; don't need to send that unless explicit.
    if (formData.scheduleType === 'immediate') {
      payload.scheduleType = 'immediate';
    }
    try {
      console.log('[CAMPAIGN CREATE] Sending payload:', payload);
      const resp = await api.campaigns.create(payload);
      console.log('[CAMPAIGN CREATE] Response:', resp);
      setAlert({ type: 'success', message: 'Campaign created successfully!' });
      setIsModalOpen(false);
      setFormData({
        name: '',
        message: '',
        audienceId: 'aud_all_consented',
        discountId: '',
        scheduleType: 'immediate',
        scheduleAt: '',
        recurringDays: ''
      });
      window.location.reload();
    } catch (error) {
      console.error('[CAMPAIGN CREATE ERROR]', error);
      setAlert({ type: 'error', message: `Failed to create campaign: ${error.message}` });
    }
  };

  const handleSendCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to send this campaign now?')) return;

    try {
      await api.campaigns.send(campaignId);
      setAlert({ type: 'success', message: 'Campaign sent successfully!' });
      window.location.reload();
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to send campaign: ${error.message}` });
    }
  };

  const handleScheduleCampaign = async () => {
    try {
      await api.campaigns.schedule(selectedCampaign.id, {
        scheduleType: 'scheduled',
        scheduleAt: formData.scheduleAt
      });
      setAlert({ type: 'success', message: 'Campaign scheduled successfully!' });
      setIsScheduleModalOpen(false);
      window.location.reload();
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to schedule campaign: ${error.message}` });
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await api.campaigns.delete(campaignId);
      setAlert({ type: 'success', message: 'Campaign deleted successfully!' });
      window.location.reload();
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to delete campaign: ${error.message}` });
    }
  };

  const handleDuplicateCampaign = async (campaignId) => {
    setLoading(true);
    try {
      await api.campaigns.duplicate(campaignId);
      setAlert({ type: 'success', message: 'Campaign duplicated successfully!' });
      window.location.reload();
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to duplicate campaign: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to cancel this campaign?')) return;

    setLoading(true);
    try {
      await api.campaigns.cancel(campaignId);
      setAlert({ type: 'success', message: 'Campaign cancelled successfully!' });
      window.location.reload();
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to cancel campaign: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const campaign = await api.campaigns.get(campaignId);
      setSelectedCampaign(campaign);
      setIsPreviewModalOpen(true);
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to load campaign: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGetAudience = async (campaignId) => {
    setLoading(true);
    try {
      const audience = await api.campaigns.audience(campaignId);
      setAlert({ type: 'success', message: `Audience: ${audience.count} contacts` });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to get audience: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsScheduleModalOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'sending':
      case 'active':
        return 'primary';
      case 'scheduled':
        return 'info';
      case 'sent':
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'draft':
      default:
        return 'default';
    }
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
        title="Campaigns"
        subtitle="Manage your SMS marketing campaigns"
        actions={
          <ActionGroup>
            <ActionButton
              variant="outline"
              onClick={() => setFilters({ ...filters, search: '', status: 'all' })}
            >
              {/* CHANGED: Added Icon */}
              <Icon name="close" size="sm" className="mr-2" />
              Clear Filters
            </ActionButton>
            <ActionButton variant="primary" onClick={() => setIsModalOpen(true)}>
              {/* CHANGED: Replaced + with Icon */}
              <Icon name="plus" size="sm" className="mr-2" />
              New Campaign
            </ActionButton>
          </ActionGroup>
        }
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Campaigns</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent>
        {/* CHANGED: Removed the redundant hero <section> and <h1>.
          The PageHeader above already provides the title.
        */}

        {/* Stats Overview */}
        {/* CHANGED: Wrapped in PageSection for consistent padding */}
        <PageSection>
          {stats.totalCampaigns !== undefined && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-deep/10 rounded-xl flex items-center justify-center">
                    <Icon name="campaign" size="lg" className="text-deep" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-primary">{stats.active || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="chart" size="lg" className="text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-secondary">{stats.scheduled || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Icon name="clock" size="lg" className="text-secondary" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="success" size="lg" className="text-green-600" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </PageSection>

        {/* Filters Section - Sand Background */}
        {/* CHANGED: Replaced <section> with <PageSection> */}
        <PageSection className="py-16">
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Campaign Management</h2>
              <p className="text-base text-deep/90 leading-relaxed max-w-2xl mx-auto">
                Filter and manage your SMS campaigns with powerful search and status controls.
              </p>
            </div>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Filters & Search</h3>
                  <Badge variant="info" size="sm">
                    {campaigns.length} campaigns
                  </Badge>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <Label htmlFor="SearchCampaigns">Search Campaigns</Label>
                    <Input
                      id="SearchCampaigns"
                      label="Search Campaigns"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      placeholder="Search by name or content..."
                    />
                  </div>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    options={[
                      { value: 'all', label: 'All Campaigns' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'sending', label: 'Sending' },
                      { value: 'sent', label: 'Sent' },
                      { value: 'failed', label: 'Failed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                  />

                  <Select
                    label="Sort by"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    options={[
                      { value: 'createdAt', label: 'Date Created' },
                      { value: 'name', label: 'Name' },
                      { value: 'scheduleAt', label: 'Schedule Date' },
                      { value: 'status', label: 'Status' },
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* Campaigns List */}
        {/* CHANGED: Replaced <section> with <PageSection> */}
        <PageSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Your Campaigns</h2>
            <p className="text-base text-deep/90 leading-relaxed max-w-2xl mx-auto">
              Manage and track all your SMS marketing campaigns in one place.
            </p>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold text-gray-900">{campaign.name}</h3>
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status || 'Draft'}
                        </Badge>
                        {campaign.scheduleAt && campaign.status === 'scheduled' && (
                          <Badge variant="info" size="sm" className="flex items-center">
                            {/* CHANGED: Replaced emoji with Icon */}
                            <Icon name="calendar" size="sm" className="mr-1" /> {formatDate(campaign.scheduleAt)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-caption">
                        Created {formatDate(campaign.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {campaign.metrics && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-deep">
                            {campaign.metrics.sent?.toLocaleString() || 0} sent
                          </p>
                          <p className="text-caption text-gray-600">
                            {campaign.metrics.deliveryRate || '0%'} delivered
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="text-body">{campaign.content || campaign.message}</p>
                  </div>

                  {campaign.audience && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-caption text-gray-600">Target:</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                        {campaign.audience.type || 'All'} ({campaign.audience.count || 0} contacts)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handlePreviewCampaign(campaign.id)}
                      disabled={loading}
                    >
                      <Icon name="search" size="sm" className="mr-2" /> Preview
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handleGetAudience(campaign.id)}
                      disabled={loading}
                    >
                      <Icon name="users" size="sm" className="mr-2" /> Audience
                    </Button>

                    {campaign.status === 'draft' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={loading}
                        >
                          <Icon name="arrowRight" size="sm" className="mr-2" /> Send Now
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => openScheduleModal(campaign)}
                        >
                          <Icon name="clock" size="sm" className="mr-2" /> Schedule
                        </Button>
                      </>
                    )}

                    {campaign.status === 'scheduled' && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => openScheduleModal(campaign)}
                        >
                          <Icon name="clock" size="sm" className="mr-2" /> Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-orange-600 border-orange-300 hover:bg-orange-50"
                          onClick={() => handleCancelCampaign(campaign.id)}
                          disabled={loading}
                        >
                          <Icon name="close" size="sm" className="mr-2" /> Cancel
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handleDuplicateCampaign(campaign.id)}
                      disabled={loading}
                    >
                      <Icon name="copy" size="sm" className="mr-2" /> Duplicate
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Icon name="trash" size="sm" className="mr-2" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white rounded-xl p-12 shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="campaign" size="2xl" className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">No campaigns yet</h3>
                <p className="text-base text-gray-600 mb-6">Create your first SMS campaign to get started</p>
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="rounded-xl">
                  {/* CHANGED: Added Icon */}
                  <Icon name="plus" size="sm" className="mr-2" />
                  Create Campaign
                </Button>
              </div>
            </Card>
          )}
        </PageSection>
      </PageContent>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCampaign}
              disabled={!formData.name || !formData.message}
            >
              {/* CHANGED: Added Icon */}
              <Icon name="plus" size="sm" className="mr-2" />
              Create Campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Campaign Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Back to School Sale"
          />

          <Textarea
            label="SMS Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your SMS message..."
            rows={4}
            maxLength={160}
          />

          <Select
            label="Target Audience"
            value={formData.audienceId}
            onChange={(e) => setFormData({ ...formData, audienceId: e.target.value })}
            options={[
              { value: 'aud_all_consented', label: 'All Consented Contacts' },
              { value: 'aud_male', label: 'Male Contacts' },
              { value: 'aud_female', label: 'Female Contacts' },
              { value: 'aud_birthdays', label: 'Birthday Contacts' },
            ]}
          />

          <Input
            label="Discount ID (Optional)"
            value={formData.discountId}
            onChange={(e) => setFormData({ ...formData, discountId: e.target.value })}
            placeholder="e.g. disc_123"
          />
        </div>
      </Modal>

      {/* Schedule Campaign Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Campaign"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleScheduleCampaign}
              disabled={!formData.scheduleAt}
            >
              {/* CHANGED: Added Icon */}
              <Icon name="clock" size="sm" className="mr-2" />
              Schedule
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Schedule <strong>{selectedCampaign?.name}</strong> to be sent at a specific time.
          </p>

          <Input
            label="Schedule Date & Time"
            type="datetime-local"
            value={formData.scheduleAt}
            onChange={(e) => setFormData({ ...formData, scheduleAt: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Campaign Preview"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setIsPreviewModalOpen(false);
              if (selectedCampaign?.status === 'draft') {
                handleSendCampaign(selectedCampaign.id);
              }
            }}>
              {/* CHANGED: Added conditional icons */}
              {selectedCampaign?.status === 'draft' ? (
                <Icon name="arrowRight" size="sm" className="mr-2" />
              ) : (
                <Icon name="search" size="sm" className="mr-2" />
              )}
              {selectedCampaign?.status === 'draft' ? 'Send Campaign' : 'View Details'}
            </Button>
          </>
        }
      >
        {selectedCampaign && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCampaign.name}
              </h3>
              <Badge variant={getStatusBadgeVariant(selectedCampaign.status)}>
                {selectedCampaign.status}
              </Badge>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Message Content:</p>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {selectedCampaign.content || selectedCampaign.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-gray-600 mb-1">Character Count</p>
                <p className="font-semibold text-gray-900">
                  {(selectedCampaign.content || selectedCampaign.message || '').length} / 160
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-gray-600 mb-1">SMS Segments</p>
                <p className="font-semibold text-gray-900">
                  {Math.ceil((selectedCampaign.content || selectedCampaign.message || '').length / 160)}
                </p>
              </div>
            </div>

            {selectedCampaign.audience && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  Target Audience:
                </p>
                <p className="text-sm text-yellow-800">
                  {selectedCampaign.audience.type || 'All'} ({selectedCampaign.audience.count || 0} contacts)
                </p>
              </div>
            )}

            {selectedCampaign.scheduleAt && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-900 mb-2">
                  Scheduled for:
                </p>
                <p className="text-sm text-purple-800">
                  {formatDate(selectedCampaign.scheduleAt)}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}