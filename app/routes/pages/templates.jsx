import { useLoaderData } from "react-router";
import { useState } from "react";
import { Input, Label } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function TemplatesPage() {
  const data = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const templates = data?.templates?.items || [];
  const filtered = templates.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Templates</h1>
          <p className="text-caption mt-1">Pre-built message templates for your campaigns</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Search */}
        <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
          <Label htmlFor="search">Search Templates</Label>
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or content"
            className="mt-1"
          />
        </div>

        {/* Templates Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <div
                key={template.id}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200"
              >
                <h2 className="text-h3 mb-2">{template.name}</h2>
                <p className="text-caption mb-4">{template.category}</p>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <p className="text-body text-sm">{template.content}</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-lg w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-h3 mb-2">No templates found</h3>
              <p className="text-caption">
                {searchQuery ? "Try different search terms" : "No templates available"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
