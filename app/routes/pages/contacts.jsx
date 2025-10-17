import { useLoaderData } from "react-router";
import { useState } from "react";
import { Input, Label } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function ContactsPage() {
  const data = useLoaderData();
  const [query, setQuery] = useState("");

  // Adapt to backend response structure
  const contacts = data?.contacts?.data?.contacts || data?.contacts?.items || [];
  const stats = data?.stats?.data || data?.stats || {};

  const filtered = contacts.filter((contact) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      contact.name?.toLowerCase().includes(q) ||
      contact.phone?.toLowerCase().includes(q) ||
      contact.email?.toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'subscribed': return 'text-primary bg-primary/10';
      case 'unsubscribed': return 'text-danger bg-danger/10';
      case 'pending': return 'text-neutral bg-neutral/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Contacts</h1>
          <p className="text-caption mt-1">Manage your SMS subscriber list</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        {stats.total !== undefined && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-caption text-gray-600">Total Contacts</p>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-h2 text-deep">{stats.total?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-caption text-gray-600">Subscribed</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-h2 text-primary">{stats.subscribed?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-caption text-gray-600">Unsubscribed</p>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-h2 text-danger">{stats.unsubscribed?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-caption text-gray-600">Growth</p>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-h2 text-secondary">{stats.growth || "+0%"}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
          <Label htmlFor="search">Search Contacts</Label>
          <Input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="mt-1"
          />
        </div>

        {/* Contacts Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((contact) => (
              <div
                key={contact.id}
                className="bg-surface rounded-xl shadow-subtle border border-border p-6 hover:shadow-elevated transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-body font-semibold text-deep">
                      {contact.name || contact.phone || contact.email}
                    </h3>
                    {contact.status && (
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      <p className="text-caption text-gray-600">{contact.phone}</p>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✉️</span>
                      <p className="text-caption text-gray-600">{contact.email}</p>
                    </div>
                  )}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contact.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-neutral/10 text-neutral text-xs rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                    ✏️ Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                    📊 History
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl shadow-subtle border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">📱</span>
              <h3 className="text-h3 mt-4 mb-2">
                {query ? "No contacts found" : "No contacts yet"}
              </h3>
              <p className="text-caption mb-6">
                {query ? "Try adjusting your search terms" : "Start by adding your first contact"}
              </p>
              {!query && (
                <Button variant="primary" className="rounded-xl">
                  + Add Contact
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
