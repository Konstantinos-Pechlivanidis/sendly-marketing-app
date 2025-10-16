import { useLoaderData } from "react-router";
import { Page, Card, Text } from "@shopify/polaris";
import { api } from "../../utils/api.client";

export const loader = async () => {
  const data = await api.get("/dashboard");
  return data;
};

export default function DashboardPage() {
  const data = useLoaderData();
  return (
    <Page title="Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <Card.Section>
            <Text as="h3" variant="headingMd">
              Overview
            </Text>
            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded-lg shadow-subtle">
              {JSON.stringify(data?.overview || {}, null, 2)}
            </pre>
          </Card.Section>
        </Card>
        <Card>
          <Card.Section>
            <Text as="h3" variant="headingMd">
              Campaigns Summary
            </Text>
            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded-lg shadow-subtle">
              {JSON.stringify(data?.campaigns || {}, null, 2)}
            </pre>
          </Card.Section>
        </Card>
        <Card>
          <Card.Section>
            <Text as="h3" variant="headingMd">
              Stats
            </Text>
            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded-lg shadow-subtle">
              {JSON.stringify(data?.stats || {}, null, 2)}
            </pre>
          </Card.Section>
        </Card>
      </div>
    </Page>
  );
}


