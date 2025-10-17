import { useLoaderData, useFetcher } from "react-router";
import { useState, useCallback } from "react";
import { serverApi } from "../../utils/api.server";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input, Label } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const loader = async ({ request }) => {
  try {
    const [balance, transactions, packages, contactStats, systemHealth, settings] = await Promise.all([
      serverApi.get(request, "/billing/balance").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/billing/transactions").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/billing/packages").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/contacts/stats/summary").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/health/full").catch(() => ({ message: "API not available" })),
      serverApi.get(request, "/settings").catch(() => ({ smsProvider: {} })),
    ]);
    return { balance, transactions, packages, contactStats, systemHealth, settings };
  } catch (error) {
    console.error("Settings loader error:", error);
    return {
      balance: { message: "Failed to load" },
      transactions: { message: "Failed to load" },
      packages: { message: "Failed to load" },
      contactStats: { message: "Failed to load" },
      systemHealth: { message: "Failed to load" },
      settings: { smsProvider: {} }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "saveSettings") {
    try {
      await serverApi.put(request, "/settings", { 
        smsProvider: { 
          apiKey: values.providerApiKey, 
          senderId: values.senderId 
        } 
      });
      return { success: true };
    } catch (error) {
      console.error("Save settings error:", error);
      return { success: false, error: error.message };
    }
  }
  return null;
};

export default function SettingsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [providerApiKey, setProviderApiKey] = useState(data?.settings?.smsProvider?.apiKey || "");
  const [senderId, setSenderId] = useState(data?.settings?.smsProvider?.senderId || "");

  const save = useCallback(() => {
    fetcher.submit({ _action: "saveSettings", providerApiKey, senderId }, { method: "post" });
  }, [fetcher, providerApiKey, senderId]);

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-deep">Settings</h1>
            <p className="text-caption text-muted mt-1">Configure your SMS marketing settings</p>
          </div>
          <Button variant="primary" onClick={save} className="rounded-xl">
            Save Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SMS Provider Settings */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">SMS Provider Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="providerApiKey">Provider API Key</Label>
                  <Input
                    id="providerApiKey"
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
                    placeholder="Enter your sender ID"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Balance */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Billing Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-muted overflow-auto">
                  {JSON.stringify(data?.balance || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-muted overflow-auto">
                  {JSON.stringify(data?.transactions || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* SMS Packages */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Available Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-muted overflow-auto">
                  {JSON.stringify(data?.packages || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Contact Stats */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">Contact Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-muted overflow-auto">
                  {JSON.stringify(data?.contactStats || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-deep">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-muted overflow-auto">
                  {JSON.stringify(data?.systemHealth || {}, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}