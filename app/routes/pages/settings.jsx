import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";

export default function SettingsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  const balance = data?.balance || {};
  const transactions = data?.transactions?.items || [];
  const packages = data?.packages?.items || [];
  const contactStats = data?.contactStats || {};
  const systemHealth = data?.systemHealth || {};
  const settings = data?.settings || {};

  const [selectedPackage, setSelectedPackage] = useState("");
  const [providerApiKey, setProviderApiKey] = useState(settings.smsProvider?.apiKey || "");
  const [senderId, setSenderId] = useState(settings.smsProvider?.senderId || "");

  const handlePurchase = () => {
    if (selectedPackage) {
      fetcher.submit(
        { _action: "purchasePackage", packageId: selectedPackage },
        { method: "post" }
      );
    }
  };

  const handleSaveSettings = () => {
    fetcher.submit(
      { _action: "saveSettings", providerApiKey, senderId },
      { method: "post" }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Settings</h1>
          <p className="text-caption mt-1">Manage your account and billing preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <Tabs defaultValue="billing">
          <TabsList className="flex gap-2 bg-muted rounded-xl p-2 mb-6 overflow-x-auto">
            <TabsTrigger value="billing" className="rounded-lg px-6 py-2">
              💳 Billing
            </TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-lg px-6 py-2">
              👥 Contacts
            </TabsTrigger>
            <TabsTrigger value="sms" className="rounded-lg px-6 py-2">
              📱 SMS Provider
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-lg px-6 py-2">
              ⚙️ System
            </TabsTrigger>
          </TabsList>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Balance */}
              <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
                <h2 className="text-h3 mb-4">Current Balance</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-6 bg-primary/10 rounded-xl">
                    <p className="text-caption text-deep mb-1">Wallet Balance</p>
                    <p className="text-h1 text-primary">
                      ${balance.balance?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="p-6 bg-secondary/10 rounded-xl">
                    <p className="text-caption text-deep mb-1">SMS Credits</p>
                    <p className="text-h1 text-secondary">
                      {balance.credits?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase SMS Credits */}
              <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
                <h2 className="text-h3 mb-4">Purchase SMS Credits</h2>
                {packages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPackage === pkg.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:border-primary/50"
                        }`}
                      >
                        <h3 className="text-body font-semibold text-deep mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-h2 text-primary mb-1">
                          {pkg.credits?.toLocaleString()} credits
                        </p>
                        <p className="text-caption text-gray-600">
                          ${pkg.price?.toFixed(2)} ({pkg.pricePerCredit?.toFixed(4)} per SMS)
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-gray-600 mb-4">No packages available</p>
                )}
                <Button
                  variant="primary"
                  onClick={handlePurchase}
                  disabled={!selectedPackage || fetcher.state === "submitting"}
                  className="rounded-xl"
                >
                  {fetcher.state === "submitting" ? "Processing..." : "Purchase Package"}
                </Button>
              </div>

              {/* Transaction History */}
              <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
                <h2 className="text-h3 mb-4">Transaction History</h2>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {tx.type === "purchase" ? "💳" : "📤"}
                          </span>
                          <div>
                            <p className="text-body font-medium text-deep">
                              {tx.description || tx.type}
                            </p>
                            <p className="text-caption text-gray-600">
                              {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-body font-semibold ${
                            tx.amount > 0 ? "text-primary" : "text-danger"
                          }`}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount?.toLocaleString() || 0}
                          </p>
                          <p className="text-caption text-gray-600">credits</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl">📋</span>
                    <p className="text-caption mt-2">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">Contact Management</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                <div className="p-6 bg-muted rounded-xl">
                  <p className="text-caption text-gray-600 mb-1">Total Contacts</p>
                  <p className="text-h2 text-deep">
                    {contactStats.total?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-6 bg-primary/10 rounded-xl">
                  <p className="text-caption text-deep mb-1">Subscribed</p>
                  <p className="text-h2 text-primary">
                    {contactStats.subscribed?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-6 bg-danger/10 rounded-xl">
                  <p className="text-caption text-deep mb-1">Unsubscribed</p>
                  <p className="text-h2 text-danger">
                    {contactStats.unsubscribed?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="rounded-xl">
                  Import Contacts
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Export Data
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* SMS Provider Tab */}
          <TabsContent value="sms">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">SMS Provider Configuration</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <Label htmlFor="providerApiKey">Provider API Key</Label>
                  <Input
                    id="providerApiKey"
                    type="password"
                    value={providerApiKey}
                    onChange={(e) => setProviderApiKey(e.target.value)}
                    placeholder="Enter your SMS provider API key"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="senderId">Sender ID</Label>
                  <Input
                    id="senderId"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder="Your business name or number"
                    className="mt-1"
                  />
                  <p className="text-caption mt-1">
                    This will appear as the sender in recipient messages
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                  disabled={fetcher.state === "submitting"}
                  className="rounded-xl"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">System Health</h2>
              {systemHealth.ok ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <span className="text-body font-medium text-deep">System Status</span>
                    </div>
                    <span className="text-body font-semibold text-primary">Operational</span>
                  </div>
                  {systemHealth.checks && Object.entries(systemHealth.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {value.status === "healthy" ? "✅" : "⚠️"}
                        </span>
                        <span className="text-body capitalize">{key}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        value.status === "healthy" ? "text-secondary" : "text-accent"
                      }`}>
                        {value.status || "unknown"}
                      </span>
                    </div>
                  ))}
                  {systemHealth.uptime && (
                    <div className="p-4 bg-secondary/10 rounded-lg mt-4">
                      <p className="text-body text-deep">
                        Uptime: {Math.floor(systemHealth.uptime / 3600)}h{" "}
                        {Math.floor((systemHealth.uptime % 3600) / 60)}m
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-6xl">⚠️</span>
                  <h3 className="text-h3 mt-4 mb-2">Health check unavailable</h3>
                  <p className="text-caption">System health information could not be retrieved</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
