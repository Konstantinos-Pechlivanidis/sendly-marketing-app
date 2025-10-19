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
    scheduleAt: ''
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
    try {
      await api.campaigns.create(formData);
      setAlert({ type: 'success', message: 'Campaign created successfully!' });
      setIsModalOpen(false);
      setFormData({
        name: '',
        message: '',
        audienceId: 'aud_all_consented',
        discountId: '',
        scheduleType: 'immediate',
        scheduleAt: ''
      });
      // Refresh the page
      window.location.reload();
    } catch (error) {
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
              onClick={() => setFilters({...filters, search: '', status: 'all'})}
            >
              🔍 Clear Filters
            </ActionButton>
            <ActionButton variant="primary" onClick={() => setIsModalOpen(true)}>
              + New Campaign
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
        <PageSection>
        {/* Stats Overview */}
        {stats.totalCampaigns !== undefined && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-deep/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-primary">{stats.active || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-secondary">{stats.scheduled || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3">Filters & Search</h2>
            <Badge variant="info" size="sm">
              {campaigns.length} campaigns
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search Campaigns"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name or content..."
            />
            
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
        </Card>

        {/* Campaigns List */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-elevated transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-h3">{campaign.name}</h2>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status || 'Draft'}
                      </Badge>
                      {campaign.scheduleAt && campaign.status === 'scheduled' && (
                        <Badge variant="info" size="sm">
                          📅 {formatDate(campaign.scheduleAt)}
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
                    👁️ Preview
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg"
                    onClick={() => handleGetAudience(campaign.id)}
                    disabled={loading}
                  >
                    👥 Audience
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
                        📤 Send Now
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-lg"
                        onClick={() => openScheduleModal(campaign)}
                      >
                        ⏱️ Schedule
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
                        ⏱️ Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg text-orange-600 border-orange-300 hover:bg-orange-50"
                        onClick={() => handleCancelCampaign(campaign.id)}
                        disabled={loading}
                      >
                        ⏹️ Cancel
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
                    📋 Duplicate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Card>
        ))}
      </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">📱</span>
              <h3 className="text-h3 mt-4 mb-2">No campaigns yet</h3>
              <p className="text-caption mb-6">Create your first SMS campaign to get started</p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)} className="rounded-xl">
                Create Campaign
              </Button>
            </div>
          </div>
        )}

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
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
