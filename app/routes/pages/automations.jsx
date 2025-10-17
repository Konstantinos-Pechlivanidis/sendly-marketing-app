import { useLoaderData, useFetcher } from "react-router";
import { useState, useCallback } from "react";
import { serverApi } from "../../utils/api.server";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Input";

export const loader = async ({ request }) => {
  try {
    const [automations, stats] = await Promise.all([
      serverApi.get(request, "/automations").catch(() => ({ items: [] })),
      serverApi.get(request, "/automations/stats/summary").catch(() => ({ message: "API not available" })),
    ]);
    return { automations, stats };
  } catch (error) {
    console.error("Automations loader error:", error);
    return { 
      automations: { items: [] }, 
      stats: { message: "Failed to load" }
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "updateAutomation") {
    try {
      await serverApi.put(request, `/automations/${values.type}`, {
        enabled: values.enabled === "true",
        message: values.message,
        schedule: JSON.parse(values.schedule || "{}")
      });
      return { success: true };
    } catch (error) {
      console.error("Update automation error:", error);
      return { success: false, error: error.message };
    }
  }

  if (_action === "resetAutomation") {
    try {
      await serverApi.post(request, `/automations/${values.type}/reset`);
      return { success: true };
    } catch (error) {
      console.error("Reset automation error:", error);
      return { success: false, error: error.message };
    }
  }

  return null;
};

export default function AutomationsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  const startEdit = useCallback((automation) => {
    setEditing(automation);
    setMessage(automation.message || "");
    setEnabled(automation.enabled || false);
  }, []);

  const saveEdit = useCallback(() => {
    if (editing) {
      fetcher.submit({
        _action: "updateAutomation",
        type: editing.type,
        enabled: enabled.toString(),
        message,
        schedule: JSON.stringify(editing.schedule || {})
      }, { method: "post" });
      setEditing(null);
    }
  }, [fetcher, editing, enabled, message]);

  const resetAutomation = useCallback((type) => {
    fetcher.submit({ _action: "resetAutomation", type }, { method: "post" });
  }, [fetcher]);

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1 text-deep">Automations</h1>
          <p className="text-caption text-muted mt-1">Configure automated messaging sequences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {(data?.automations?.items || []).map((automation) => (
            <Card key={automation.type} className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-deep capitalize">{automation.type} Automation</CardTitle>
                    <p className="text-caption text-muted">
                      {automation.enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => startEdit(automation)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => resetAutomation(automation.type)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-body text-deep">{automation.message}</p>
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs text-muted overflow-auto">
                      {JSON.stringify(automation.schedule || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-deep">Automation Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-3">
              <pre className="text-xs text-muted overflow-auto">
                {JSON.stringify(data?.stats || {}, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {(!data?.automations?.items || data.automations.items.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-neutral text-4xl mb-4">🤖</div>
              <h3 className="text-h3 text-deep mb-2">No automations configured</h3>
              <p className="text-body text-muted">Set up automated messaging sequences</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md glass-surface">
            <CardHeader>
              <CardTitle className="text-deep">Edit {editing.type} Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="enabled">Enable automation</Label>
                </div>
                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter automation message"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveEdit}>
                    Save Changes
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
