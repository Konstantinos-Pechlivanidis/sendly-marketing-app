import { useLoaderData } from "react-router";
import { Page, Card, Text, TextField } from "@shopify/polaris";
import { useState } from "react";
import { api } from "../../utils/api.client";

export const loader = async () => {
  const data = await api.get("/contacts");
  return data;
};

export default function ContactsPage() {
  const data = useLoaderData();
  const [query, setQuery] = useState("");

  const filtered = (data?.items || []).filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <Page title="Contacts">
      <Card>
        <Card.Section>
          <TextField label="Filter" value={query} onChange={setQuery} autoComplete="off" />
        </Card.Section>
      </Card>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <Card.Section>
              <Text as="h3" variant="headingMd">{c.name || c.phone || c.email}</Text>
              <Text as="p" variant="bodySm" tone="subdued">{c.phone} {c.email ? `• ${c.email}` : ""}</Text>
            </Card.Section>
          </Card>
        ))}
      </div>
    </Page>
  );
}


