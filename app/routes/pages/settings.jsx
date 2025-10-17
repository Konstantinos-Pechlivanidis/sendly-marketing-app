import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Input";

export default function SettingsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [settings, setSettings] = useState(data?.settings || {});

  const saveSettings = () => {
    fetcher.submit({ _action: "saveSettings", ...settings }, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Settings</h1>
          <p className="text-caption mt-1">Configure your SMS marketing preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <div className="max-w-2xl">
          {/* Account Settings */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 mb-6">
            <h2 className="text-h3 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName || ""}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* SMS Settings */}
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6 mb-6">
            <h2 className="text-h3 mb-6">SMS Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={settings.senderName || ""}
                  onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                  placeholder="Enter sender name"
                  className="mt-1"
                />
                <p className="text-caption mt-1">This will appear as the sender of your SMS messages</p>
              </div>
              <div>
                <Label htmlFor="defaultMessage">Default Message Template</Label>
                <Textarea
                  id="defaultMessage"
                  value={settings.defaultMessage || ""}
                  onChange={(e) => setSettings({ ...settings, defaultMessage: e.target.value })}
                  placeholder="Enter default message"
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={saveSettings}
              className="rounded-xl"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
