import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Input";

export default function AutomationsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  const automations = data?.automations?.items || [];
  const stats = data?.stats || {};

  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Automations</h1>
          <p className="text-caption mt-1">Set up automated SMS sequences based on customer behavior</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        {stats.totalAutomations !== undefined && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Total Automations</p>
              <p className="text-h2 text-deep">{stats.totalAutomations || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Active</p>
              <p className="text-h2 text-primary">{stats.active || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Total Triggered</p>
              <p className="text-h2 text-secondary">{stats.totalTriggered?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <p className="text-caption text-gray-600 mb-1">Success Rate</p>
              <p className="text-h2 text-deep">{stats.successRate || "0%"}</p>
            </div>
          </div>
        )}

        {/* Automations List */}
        {automations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {automations.map((automation) => (
              <div
                key={automation.id || automation.type}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-4xl">{getAutomationIcon(automation.type)}</span>
                    <div className="flex-1">
                      <h2 className="text-h3">{automation.name || automation.type}</h2>
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
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          setSelectedAutomation(automation);
                          setEditMode(true);
                        }}
                      >
                        ✏️ Edit
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        📊 View Stats
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
                      >
                        🔄 Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">🤖</span>
              <h3 className="text-h3 mt-4 mb-2">No automations configured</h3>
              <p className="text-caption mb-6">
                Set up automated SMS sequences to engage customers at the right time
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editMode && selectedAutomation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-surface rounded-2xl shadow-elevated border border-border max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border sticky top-0 bg-surface">
              <h2 className="text-h3">Edit Automation: {selectedAutomation.name}</h2>
            </div>
            <div className="p-6 space-y-4">
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
                  className="mt-1"
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
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeUnit">Time Unit</Label>
                    <select
                      id="timeUnit"
                      defaultValue={selectedAutomation.schedule.timeUnit}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-surface">
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setSelectedAutomation(null);
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button variant="primary" className="rounded-xl">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
