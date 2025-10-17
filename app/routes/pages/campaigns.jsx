import { useLoaderData, useFetcher } from "react-router";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Input";

export default function CampaignsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const create = () => {
    fetcher.submit({ _action: "createCampaign", name, content }, { method: "post" });
    setOpen(false);
    setName("");
    setContent("");
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
            New Campaign
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {(data?.campaigns?.items && data.campaigns.items.length > 0) ? (
          <div className="grid grid-cols-1 gap-6">
            {data.campaigns.items.map((campaign) => (
              <div key={campaign.id} className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-h3">{campaign.name}</h2>
                    <p className="text-caption mt-1">{campaign.status}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-body">{campaign.content}</p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-lg">Edit</Button>
                    <Button variant="danger" size="sm" className="rounded-lg">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-h3 mb-2">No campaigns yet</h3>
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
          <Card className="w-full max-w-md glass-surface">
            <CardHeader>
              <CardTitle className="text-deep">Create Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                    placeholder="Enter your message"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={toggle}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={create}>
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}