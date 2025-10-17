import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";

export default function ReportsPage() {
  const data = useLoaderData();

  const exportData = async (type) => {
    try {
      const response = await fetch(`/api/reports/export?format=csv&type=${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.csv`;
      a.click();
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS 18 Glass Header */}
      <header className="glass-surface border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-h1 text-deep">Reports</h1>
          <p className="text-caption text-muted mt-1">Analytics and performance insights</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="hover:shadow-elevated transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-deep">Overview Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-3">
                      <pre className="text-xs text-muted overflow-auto">
                        {JSON.stringify(data?.overview || {}, null, 2)}
                      </pre>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportData('overview')}
                    >
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-deep">Campaign Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs text-muted overflow-auto">
                      {JSON.stringify(data?.campaigns || {}, null, 2)}
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('campaigns')}
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automations" className="space-y-4">
            <Card className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-deep">Automation Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs text-muted overflow-auto">
                      {JSON.stringify(data?.automations || {}, null, 2)}
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('automations')}
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messaging" className="space-y-4">
            <Card className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-deep">Messaging Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs text-muted overflow-auto">
                      {JSON.stringify(data?.messaging || {}, null, 2)}
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('messaging')}
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="hover:shadow-elevated transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-deep">Revenue Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs text-muted overflow-auto">
                      {JSON.stringify(data?.revenue || {}, null, 2)}
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportData('revenue')}
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
