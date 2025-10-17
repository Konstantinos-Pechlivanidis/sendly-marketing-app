import { useLoaderData, useFetcher } from "react-router";
import { Button } from "../../components/ui/Button";

export default function AutomationsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  const automations = data?.automations?.items || [];

  const toggleAutomation = (id, enabled) => {
    fetcher.submit(
      { _action: "toggleAutomation", id, enabled: !enabled },
      { method: "post" }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Automations</h1>
          <p className="text-caption mt-1">Automated SMS campaigns based on customer behavior</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {automations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-h3">{automation.name}</h2>
                    <p className="text-caption mt-1">{automation.description}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => toggleAutomation(automation.id, automation.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        automation.enabled ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          automation.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-body text-sm">
                      <strong>Trigger:</strong> {automation.trigger}
                    </p>
                    <p className="text-body text-sm mt-2">
                      <strong>Message:</strong> {automation.message}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-lg">
                      View Stats
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-h3 mb-2">No automations configured</h3>
              <p className="text-caption mb-6">Set up automated SMS campaigns to engage customers</p>
              <Button variant="primary" className="rounded-xl">
                Create Automation
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
