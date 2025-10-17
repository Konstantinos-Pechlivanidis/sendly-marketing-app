import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";

export default function TemplatesPage() {
  const data = useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1 text-deep">Templates</h1>
          <p className="text-caption text-muted mt-1">Browse and manage your message templates</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(data?.templates?.items || []).map((template) => (
                <Card key={template.id} className="hover:shadow-elevated transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-deep">{template.name}</CardTitle>
                    <p className="text-caption text-muted">{template.category}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-body text-deep">{template.content}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="primary" size="sm">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep">Template Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.categories || {}, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep">Popular Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.popular || {}, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep">Template Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs text-muted overflow-auto">
                    {JSON.stringify(data?.stats || {}, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {(!data?.templates?.items || data.templates.items.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-neutral text-4xl mb-4">📝</div>
              <h3 className="text-h3 text-deep mb-2">No templates found</h3>
              <p className="text-body text-muted">Start by creating your first template</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
