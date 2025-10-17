import { useLoaderData } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input, Label } from "../../components/ui/Input";

export default function ContactsPage() {
  const data = useLoaderData();
  const [query, setQuery] = useState("");

  const filtered = (data?.contacts?.items || []).filter((contact) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      contact.name?.toLowerCase().includes(q) ||
      contact.phone?.toLowerCase().includes(q) ||
      contact.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1">Contacts</h1>
          <p className="text-caption mt-1">Manage your contact list</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Search Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div>
              <Label htmlFor="search">Search Contacts</Label>
              <Input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, phone, or email"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((contact) => (
            <Card key={contact.id} className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-deep">{contact.name || contact.phone || contact.email}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contact.phone && (
                    <p className="text-body text-muted">📞 {contact.phone}</p>
                  )}
                  {contact.email && (
                    <p className="text-body text-muted">✉️ {contact.email}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button className="text-xs text-primary hover:text-primary-hover">
                      Edit
                    </button>
                    <button className="text-xs text-danger hover:text-danger-hover">
                      Remove
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-neutral text-4xl mb-4">📱</div>
              <h3 className="text-h3 text-deep mb-2">No contacts found</h3>
              <p className="text-body text-muted">
                {query ? "Try adjusting your search terms" : "Start by adding your first contact"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}