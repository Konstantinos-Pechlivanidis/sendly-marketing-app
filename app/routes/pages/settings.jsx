import { useLoaderData } from "react-router";
import { Page, Card, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { api } from "../../utils/api.client";

export const loader = async () => {
  const data = await api.get("/settings");
  return data;
};

export default function SettingsPage() {
  const data = useLoaderData();
  const [providerApiKey, setProviderApiKey] = useState(data?.smsProvider?.apiKey || "");
  const [senderId, setSenderId] = useState(data?.smsProvider?.senderId || "");

  const save = useCallback(async () => {
    await api.put("/settings", { smsProvider: { apiKey: providerApiKey, senderId } });
  }, [providerApiKey, senderId]);

  return (
    <Page title="Settings" primaryAction={{ content: "Save", onAction: save }}>
      <Card>
        <Card.Section>
          <div className="grid grid-cols-1 gap-4">
            <TextField label="SMS Provider API Key" value={providerApiKey} onChange={setProviderApiKey} autoComplete="off" />
            <TextField label="Sender ID" value={senderId} onChange={setSenderId} autoComplete="off" />
          </div>
        </Card.Section>
      </Card>
    </Page>
  );
}


