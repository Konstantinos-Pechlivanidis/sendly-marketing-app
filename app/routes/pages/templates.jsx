import { useLoaderData } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";

export default function TemplatesPage() {
  const data = useLoaderData();
  const templates = data?.templates?.items || [];
  const categories = data?.categories?.items || [];
  const triggers = data?.triggers?.items || [];
  const popular = data?.popular?.items || [];
  const stats = data?.stats || {};

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = templates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      promotional: "🎉",
      transactional: "📦",
      notification: "🔔",
      welcome: "👋",
      reminder: "⏰",
      default: "📝"
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Templates</h1>
          <p className="text-caption mt-1">Pre-built SMS templates for faster campaign creation</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Popular Templates */}
        {popular.length > 0 && (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
            <h2 className="text-h3 mb-4">🌟 Popular Templates</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popular.slice(0, 3).map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-primary/10 rounded-xl border border-primary/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-body font-semibold text-deep">{template.name}</h3>
                    <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  </div>
                  <p className="text-caption text-gray-600 mb-3 line-clamp-2">
                    {template.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-primary">
                      {template.usageCount || 0} uses
                    </span>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-caption text-gray-600 mb-2 block">Search Templates</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or content..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-caption text-gray-600 mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <div
                key={template.id}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-body font-semibold text-deep mb-1">
                      {template.name}
                    </h3>
                    {template.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral/10 text-neutral text-xs rounded-lg">
                        <span>{getCategoryIcon(template.category)}</span>
                        {template.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3 mb-4">
                  <p className="text-caption text-gray-700 line-clamp-4">
                    {template.content}
                  </p>
                </div>

                {template.triggers && template.triggers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-caption text-gray-600 mb-1">Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.triggers.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-lg"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-caption text-gray-600">
                    {template.usageCount || 0} uses
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      👁️ Preview
                    </Button>
                    <Button variant="primary" size="sm" className="rounded-lg">
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">📝</span>
              <h3 className="text-h3 mt-4 mb-2">
                {searchQuery || selectedCategory !== "all" ? "No templates found" : "No templates available"}
              </h3>
              <p className="text-caption mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Check back later for new templates"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
