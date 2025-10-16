import { useLoaderData } from "react-router";
import { Page, Card, Text, Button, Modal, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { api } from "../../utils/api.client";

export const loader = async () => {
  const data = await api.get("/campaigns");
  return data;
};

export default function CampaignsPage() {
  const data = useLoaderData();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const create = async () => {
    await api.post("/campaigns", { name, content });
    window.location.reload();
  };

  return (
    <Page title="Campaigns" primaryAction={{ content: "New campaign", onAction: toggle }}>
      <div className="grid grid-cols-1 gap-4">
        {(data?.items || []).map((c) => (
          <Card key={c.id}>
            <Card.Section>
              <Text as="h3" variant="headingMd">{c.name}</Text>
              <Text as="p" variant="bodyMd" tone="subdued">{c.status}</Text>
            </Card.Section>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={toggle} title="Create campaign" primaryAction={{ content: "Create", onAction: create }}>
        <Modal.Section>
          <div className="space-y-3">
            <TextField label="Name" value={name} onChange={setName} autoComplete="off" />
            <TextField label="Content" value={content} onChange={setContent} multiline />
          </div>
        </Modal.Section>
      </Modal>
    </Page>
  );
}


