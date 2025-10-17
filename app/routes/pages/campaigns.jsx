import { useLoaderData, useFetcher } from "react-router";
import { useState, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Input";

export default function CampaignsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const campaigns = data?.campaigns?.items || [];
  const stats = data?.stats || {};

  const create = () => {
    fetcher.submit({ _action: "createCampaign", name, content }, { method: "post" });
    setOpen(false);
    setName("");
    setContent("");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-primary bg-primary/10';
      case 'scheduled': return 'text-secondary bg-secondary/10';
      case 'completed': return 'text-deep bg-deep/10';
      case 'draft': return 'text-neutral bg-neutral/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h1">Campaigns</h1>
            <p className="text-caption mt-1">Manage your SMS marketing campaigns</p>
          </div>
          <Button variant="primary" onClick={toggle} className="rounded-xl">
            + New Campaign
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        {stats.totalCampaigns !== undefined && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Total Campaigns</p>
              <p className="text-h2 text-deep">{stats.totalCampaigns || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Active</p>
              <p className="text-h2 text-primary">{stats.active || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Scheduled</p>
              <p className="text-h2 text-secondary">{stats.scheduled || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Completed</p>
              <p className="text-h2 text-deep">{stats.completed || 0}</p>
            </div>
          </div>
        )}

        {/* Campaigns List */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-h3">{campaign.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status || 'Draft'}
                      </span>
                    </div>
                    <p className="text-caption">
                      Created {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}
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

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    📊 View Stats
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    ✏️ Edit
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button variant="primary" size="sm" className="rounded-lg">
                      📤 Send Now
                    </Button>
                  )}
                  {campaign.status === 'scheduled' && (
                    <Button variant="secondary" size="sm" className="rounded-lg">
                      ⏱️ Reschedule
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">📱</span>
              <h3 className="text-h3 mt-4 mb-2">No campaigns yet</h3>
              <p className="text-caption mb-6">Create your first SMS campaign to get started</p>
              <Button variant="primary" onClick={toggle} className="rounded-xl">
                Create Campaign
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* iOS 18 Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-surface rounded-2xl shadow-elevated border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-h3">Create New Campaign</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your SMS message"
                  className="mt-1"
                  rows={4}
                />
                <p className="text-caption mt-1">
                  {content.length} / 160 characters
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={toggle} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={create} 
                disabled={!name || !content}
                className="rounded-xl"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
