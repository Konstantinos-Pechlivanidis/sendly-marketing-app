import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function DashboardPage() {
  const data = useLoaderData();
  
  console.log("Dashboard data:", data);
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'red' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'blue', borderBottom: '4px solid yellow', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ padding: '16px 24px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: 'yellow', marginTop: '4px' }}>Overview of your SMS marketing performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Overview Card */}
          <div style={{ backgroundColor: 'green', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid purple', padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Overview</h2>
            <div style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '12px' }}>
              <pre style={{ fontSize: '0.75rem', color: 'black', overflow: 'auto' }}>
                {JSON.stringify(data?.overview?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div style={{ backgroundColor: 'green', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid purple', padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Quick Stats</h2>
            <div style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '12px' }}>
              <pre style={{ fontSize: '0.75rem', color: 'black', overflow: 'auto' }}>
                {JSON.stringify(data?.quickStats?.data || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>

          {/* System Health Card */}
          <div style={{ backgroundColor: 'green', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid purple', padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '16px' }}>System Health</h2>
            <div style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '12px' }}>
              <pre style={{ fontSize: '0.75rem', color: 'black', overflow: 'auto' }}>
                {JSON.stringify(data?.health || { message: "No data available" }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}